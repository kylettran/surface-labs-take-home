"use client";

import { useMemo } from "react";
import Link from "next/link";
import { dataProvider } from "@/lib/data-provider";
import { estimateDriveScoreTotal } from "@/lib/drive-scorer";
import { useStorageSnapshot } from "@/lib/storage-hooks";

const statusLabels: Record<string, string> = {
  queued: "Queued",
  contacted: "Contacted",
  replied: "Replied",
  meeting_booked: "Meeting Booked",
  skipped: "Skipped",
};

function getSizeBucket(employeeCount: number) {
  if (employeeCount >= 500) return "Enterprise";
  if (employeeCount >= 100) return "Mid-Market";
  if (employeeCount >= 50) return "Growth";
  return "Early";
}

export default function LeadOceanClient() {
  const companies = dataProvider.getCompanies();
  const snapshot = useStorageSnapshot();

  const regionCounts = useMemo(() => {
    return companies.reduce(
      (acc, company) => {
        acc[company.region] = (acc[company.region] ?? 0) + 1;
        return acc;
      },
      { NAM: 0, EMEA: 0, APAC: 0 } as Record<string, number>
    );
  }, [companies]);

  const statusCounts = useMemo(() => {
    return companies.reduce(
      (acc, company) => {
        const status = snapshot.statuses?.[company.id]?.status ?? "queued";
        acc[status] = (acc[status] ?? 0) + 1;
        return acc;
      },
      {
        queued: 0,
        contacted: 0,
        replied: 0,
        meeting_booked: 0,
        skipped: 0,
      } as Record<string, number>
    );
  }, [companies, snapshot]);

  const sizeCounts = useMemo(() => {
    return companies.reduce(
      (acc, company) => {
        const bucket = getSizeBucket(company.employeeCount);
        acc[bucket] = (acc[bucket] ?? 0) + 1;
        return acc;
      },
      { Growth: 0, "Mid-Market": 0, Enterprise: 0, Early: 0 } as Record<string, number>
    );
  }, [companies]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold text-text-primary">Lead Ocean</h2>
        <p className="mt-2 text-sm text-text-secondary">
          Full inventory of all accounts in the system.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-surface p-4">
          <p className="text-xs uppercase tracking-wide text-text-secondary">By Region</p>
          <div className="mt-3 space-y-2 text-sm text-text-secondary">
            {Object.entries(regionCounts).map(([region, count]) => (
              <Link
                key={region}
                href={`/?region=${region}`}
                className="flex w-full items-center justify-between rounded-lg px-2 py-1 text-left hover:bg-ink"
              >
                <span>{region}</span>
                <span className="font-mono text-text-primary">{count}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-4">
          <p className="text-xs uppercase tracking-wide text-text-secondary">By Status</p>
          <div className="mt-3 space-y-2 text-sm text-text-secondary">
            {Object.entries(statusCounts).map(([status, count]) => (
              <Link
                key={status}
                href={`/pipeline?status=${status}`}
                className="flex w-full items-center justify-between rounded-lg px-2 py-1 text-left hover:bg-ink"
              >
                <span>{statusLabels[status] ?? status}</span>
                <span className="font-mono text-text-primary">{count}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-4">
          <p className="text-xs uppercase tracking-wide text-text-secondary">By Size</p>
          <div className="mt-3 space-y-2 text-sm text-text-secondary">
            {Object.entries(sizeCounts).map(([bucket, count]) => (
              <Link
                key={bucket}
                href={`/?size=${encodeURIComponent(bucket)}`}
                className="flex w-full items-center justify-between rounded-lg px-2 py-1 text-left hover:bg-ink"
              >
                <span>{bucket}</span>
                <span className="font-mono text-text-primary">{count}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-wide text-text-secondary">All Accounts</p>
          <span className="text-xs text-text-secondary">{companies.length} total</span>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-xs uppercase tracking-wide text-text-secondary">
              <tr>
                <th className="py-2 text-left">Account</th>
                <th className="py-2 text-left">Region</th>
                <th className="py-2 text-left">Employees</th>
                <th className="py-2 text-left">Stage</th>
                <th className="py-2 text-left">Status</th>
                <th className="py-2 text-left">DRIVE</th>
              </tr>
            </thead>
            <tbody className="text-text-secondary">
              {companies.map((company) => {
                const status = snapshot.statuses?.[company.id]?.status ?? "queued";
                const score = snapshot.scores?.[company.id]?.total ?? estimateDriveScoreTotal(company);
                return (
                  <tr key={company.id} className="border-t border-border">
                    <td className="py-3 text-text-primary">{company.name}</td>
                    <td className="py-3">{company.region}</td>
                    <td className="py-3">{company.employeeCount}</td>
                    <td className="py-3">{company.fundingStage}</td>
                    <td className="py-3">{statusLabels[status] ?? status}</td>
                    <td className="py-3 font-mono text-text-primary">{score * 2}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
