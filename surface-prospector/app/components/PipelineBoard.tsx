"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Company } from "@/lib/types";
import { estimateDriveScoreTotal } from "@/lib/drive-scorer";
import { storage } from "@/lib/storage";
import { useStorageSnapshot } from "@/lib/storage-hooks";

const columns = [
  { key: "queued", label: "Queued" },
  { key: "contacted", label: "Contacted" },
  { key: "replied", label: "Replied" },
  { key: "meeting_booked", label: "Meeting Booked" },
  { key: "skipped", label: "Skipped" },
] as const;

export default function PipelineBoard({ companies }: { companies: Company[] }) {
  const snapshot = useStorageSnapshot();
  const [flashId, setFlashId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get("status");

  const itemsByStatus = useMemo(() => {
    const grouped: Record<string, Company[]> = {
      queued: [],
      contacted: [],
      replied: [],
      meeting_booked: [],
      skipped: [],
    };

    companies.forEach((company) => {
      const status = snapshot.statuses?.[company.id]?.status ?? "queued";
      if (statusFilter && statusFilter !== status) return;
      grouped[status] = grouped[status] ?? [];
      grouped[status].push(company);
    });

    return grouped;
  }, [companies, snapshot, statusFilter]);

  const activity = snapshot.activity ?? [];
  const now = Date.now();
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
  const weekly = activity.filter((event) => new Date(event.updatedAt).getTime() >= weekAgo);
  const uniqueTouched = new Set(weekly.map((event) => event.companyId)).size;
  const emailsSent = weekly.filter((event) => event.status === "contacted").length;
  const replies = weekly.filter((event) => event.status === "replied").length;
  const meetings = weekly.filter((event) => event.status === "meeting_booked").length;
  const replyRate = emailsSent ? Math.round((replies / emailsSent) * 100) : 0;

  const handleDrop = (status: (typeof columns)[number]["key"], companyId: string) => {
    storage.setAccountStatus({
      companyId,
      status,
      lastAction: `Moved to ${status}`,
      updatedAt: new Date().toISOString(),
    });
    setFlashId(companyId);
    setTimeout(() => setFlashId(null), 1000);
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-4 lg:grid-cols-5">
        {columns.map((column) => (
          <div
            key={column.key}
            className="min-h-[200px] rounded-xl border border-border bg-surface p-3"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              const companyId = event.dataTransfer.getData("text/plain");
              if (companyId) handleDrop(column.key, companyId);
            }}
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-text-primary">
                {column.label}
              </span>
              <span className="rounded-full border border-border px-2 py-0.5 text-xs text-text-secondary">
                {itemsByStatus[column.key]?.length ?? 0}
              </span>
            </div>
            <div className="space-y-2">
              {(itemsByStatus[column.key] ?? []).map((company) => {
                const score =
                  snapshot.scores?.[company.id]?.total ?? estimateDriveScoreTotal(company);
                const score100 = score * 2;
                return (
                  <div
                    key={company.id}
                    draggable
                    onDragStart={(event) => {
                      event.dataTransfer.setData("text/plain", company.id);
                      setDraggingId(company.id);
                    }}
                    onDragEnd={() => setDraggingId(null)}
                    onClick={() => {
                      if (draggingId === company.id) return;
                      router.push(`/account/${company.id}`);
                    }}
                    className={`rounded-lg border border-border bg-ink p-3 text-xs text-text-secondary transition-shadow ${
                      flashId === company.id ? "animate-flash" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-text-primary">
                        {company.name}
                      </span>
                      <span className="font-mono text-text-primary">{score100}</span>
                    </div>
                    <p className="mt-1 text-[11px] text-text-secondary">
                      {snapshot.statuses?.[company.id]?.updatedAt
                        ? new Date(snapshot.statuses[company.id].updatedAt).toLocaleDateString()
                        : "No activity"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs uppercase tracking-wide text-text-secondary">
            Accounts touched
          </p>
          <p className="mt-2 text-2xl font-semibold font-mono text-text-primary">
            {uniqueTouched}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs uppercase tracking-wide text-text-secondary">
            Emails sent
          </p>
          <p className="mt-2 text-2xl font-semibold font-mono text-text-primary">
            {emailsSent}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs uppercase tracking-wide text-text-secondary">
            Reply rate
          </p>
          <p className="mt-2 text-2xl font-semibold font-mono text-text-primary">
            {replyRate}%
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs uppercase tracking-wide text-text-secondary">
            Meetings booked
          </p>
          <p className="mt-2 text-2xl font-semibold font-mono text-text-primary">
            {meetings}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface p-4">
        <p className="text-xs uppercase tracking-wide text-text-secondary">
          Recent activity
        </p>
        <div className="mt-3 space-y-3">
          {activity.slice(0, 10).map((event) => {
            const company = companies.find((item) => item.id === event.companyId);
            return (
              <div key={`${event.companyId}-${event.updatedAt}`} className="text-xs">
                <span className="text-text-primary font-semibold">
                  {company?.name ?? event.companyId}
                </span>{" "}
                <span className="text-text-secondary">
                  moved to {event.status.replace("_", " ")}
                </span>
                <span className="ml-2 text-text-secondary">
                  {new Date(event.updatedAt).toLocaleString()}
                </span>
              </div>
            );
          })}
          {activity.length === 0 && (
            <p className="text-xs text-text-secondary">No recent activity yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
