"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Company } from "@/lib/types";
import { estimateDriveScoreTotal } from "@/lib/drive-scorer";
import { filterCompaniesForRotation, getRotationForDate } from "@/lib/rotation";
import { useStorageSnapshot } from "@/lib/storage-hooks";
import AccountCard from "./AccountCard";
import FilterBar from "./FilterBar";

interface FilterState {
  region: "All" | "NAM" | "EMEA" | "APAC";
  size: "All" | "Growth" | "Mid-Market" | "Enterprise";
  status:
    | "All"
    | "queued"
    | "contacted"
    | "replied"
    | "meeting_booked"
    | "skipped";
}

const defaultFilters: FilterState = {
  region: "All",
  size: "All",
  status: "All",
};

function filterBySize(company: Company, size: FilterState["size"]) {
  if (size === "All") return true;
  if (size === "Growth") return company.employeeCount >= 50 && company.employeeCount < 100;
  if (size === "Mid-Market")
    return company.employeeCount >= 100 && company.employeeCount <= 500;
  return company.employeeCount > 500;
}

export default function AccountQueue({ companies }: { companies: Company[] }) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const snapshot = useStorageSnapshot();
  const rotation = getRotationForDate();
  const searchParams = useSearchParams();

  useEffect(() => {
    const region = searchParams.get("region") as FilterState["region"] | null;
    const size = searchParams.get("size") as FilterState["size"] | null;
    const status = searchParams.get("status") as FilterState["status"] | null;

    setFilters((prev) => ({
      region: region ?? prev.region,
      size: size ?? prev.size,
      status: status ?? prev.status,
    }));
  }, [searchParams]);

  const sorted = useMemo(() => {
    const rotationCompanies = filterCompaniesForRotation(companies, rotation);

    const filtered = rotationCompanies.filter((company) => {
      const status = snapshot.statuses?.[company.id]?.status ?? "queued";
      const matchesRegion = filters.region === "All" || company.region === filters.region;
      const matchesSize = filterBySize(company, filters.size);
      const matchesStatus = filters.status === "All" || status === filters.status;
      return matchesRegion && matchesSize && matchesStatus;
    });

    return filtered
      .map((company) => {
        const cached = snapshot.scores?.[company.id];
        const statusEntry = snapshot.statuses?.[company.id];
        const lastTouched = statusEntry?.updatedAt
          ? new Date(statusEntry.updatedAt).getTime()
          : null;
        const isOverdue =
          (statusEntry?.status ?? "queued") === "queued" &&
          (!lastTouched || Date.now() - lastTouched > 2 * 24 * 60 * 60 * 1000);
        return {
          company,
          score: cached?.total ?? estimateDriveScoreTotal(company),
          status: snapshot.statuses?.[company.id]?.status ?? "queued",
          isOverdue,
        };
      })
      .sort((a, b) => b.score - a.score);
  }, [companies, filters, rotation, snapshot]);

  const topQueued = sorted.filter((item) => item.status === "queued").slice(0, 5);
  const topQueuedIds = new Set(topQueued.map((item) => item.company.id));
  const remaining = sorted.filter((item) => !topQueuedIds.has(item.company.id));

  return (
    <div className="space-y-6">
      <FilterBar filters={filters} onChange={setFilters} />

      <div className="space-y-3">
        {topQueued.length > 0 && (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-text-primary">
                Top 5 Uncontacted
              </p>
              <span className="text-xs text-text-secondary">
                {rotation.label}
              </span>
            </div>
            <div className="space-y-3">
              {topQueued.map((item) => (
                <AccountCard
                  key={item.company.id}
                  company={item.company}
                  scoreTotal={item.score}
                  status={item.status}
                  isOverdue={item.isOverdue}
                />
              ))}
            </div>
            {remaining.length > 0 && (
              <div className="border-t border-border pt-4 text-xs uppercase tracking-wide text-text-secondary">
                Remaining Accounts
              </div>
            )}
          </>
        )}

        <div className="space-y-3">
          {(topQueued.length ? remaining : sorted).map((item) => (
            <AccountCard
              key={item.company.id}
              company={item.company}
              scoreTotal={item.score}
              status={item.status}
              isOverdue={item.isOverdue}
            />
          ))}
        </div>

        {sorted.length === 0 && (
          <div className="rounded-xl border border-dashed border-border bg-surface px-4 py-10 text-center text-sm text-text-secondary">
            No accounts match the current filters.
          </div>
        )}
      </div>
    </div>
  );
}
