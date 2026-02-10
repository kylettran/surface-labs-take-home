"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Company, DriveScore } from "@/lib/types";
import { storage } from "@/lib/storage";

const statusLabels: Record<string, string> = {
  queued: "Queued",
  contacted: "Contacted",
  replied: "Replied",
  meeting_booked: "Meeting Booked",
  skipped: "Skipped",
};

function getScoreColor(total100: number) {
  if (total100 >= 90) return "bg-success text-emerald-950";
  if (total100 >= 70) return "bg-warning text-yellow-950";
  return "bg-muted text-zinc-900";
}

export default function AccountCard({
  company,
  scoreTotal,
  status,
  isOverdue,
}: {
  company: Company;
  scoreTotal: number;
  status: string;
  isOverdue?: boolean;
}) {
  const router = useRouter();
  const initials = company.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const score100 = scoreTotal * 2;
  const [expanded, setExpanded] = useState(false);
  const [driveScore, setDriveScore] = useState<DriveScore | null>(
    storage.getDriveScore(company.id)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleBreakdown = async () => {
    const next = !expanded;
    setExpanded(next);
    if (!next || driveScore || isLoading) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company }),
      });

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload?.error ?? "Scoring failed");
      }

      const data = (await response.json()) as DriveScore;
      storage.setDriveScore(company.id, data);
      setDriveScore(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => router.push(`/account/${company.id}`)}
      onKeyDown={(event) => {
        if (event.key === "Enter") router.push(`/account/${company.id}`);
      }}
      className={`block rounded-2xl border bg-surface p-4 transition-transform duration-300 ease-out hover:-translate-y-0.5 ${
        isOverdue ? "border-rose-300/60 shadow-[0_0_0_1px_rgba(251,113,133,0.35)]" : "border-border"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-sm font-semibold text-text-primary">
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-text-primary">
                {company.name}
              </h3>
              {company.isExistingCustomer && (
                <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-semibold text-primary">
                  🏆 Customer
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-text-secondary">
              {company.description}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            toggleBreakdown();
          }}
          className={`rounded-full px-3 py-1 text-xs font-semibold font-mono ${getScoreColor(score100)}`}
          aria-label={`View DRIVE breakdown for ${company.name}`}
        >
          {score100}
        </button>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-text-secondary">
        <span className="rounded-full border border-border px-2 py-0.5">
          {company.region}
        </span>
        <span className="rounded-full border border-border px-2 py-0.5">
          {company.employeeCount} employees
        </span>
        <span className="rounded-full border border-border px-2 py-0.5">
          {company.fundingStage}
        </span>
        <span className="rounded-full bg-ink px-2 py-0.5 text-text-primary">
          {statusLabels[status] ?? "Queued"}
        </span>
      </div>

      {expanded && (
        <div
          className="mt-4 rounded-xl border border-border bg-ink p-3 text-xs text-text-secondary"
          onClick={(event) => event.stopPropagation()}
        >
          {isLoading && (
            <div className="space-y-2">
              <div className="h-3 w-1/2 rounded bg-surface" />
              <div className="h-3 w-2/3 rounded bg-surface" />
              <div className="h-3 w-1/3 rounded bg-surface" />
            </div>
          )}
          {error && !isLoading && (
            <div className="text-warning">
              {error}
              <button
                className="ml-2 text-xs text-text-primary underline"
                onClick={(event) => {
                  event.stopPropagation();
                  toggleBreakdown();
                }}
              >
                Retry
              </button>
            </div>
          )}
          {driveScore && !isLoading && (
            <div className="grid gap-2 text-xs text-text-secondary">
              <div className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2">
                <span>Demo-dependent</span>
                <span className="font-mono text-text-primary">{driveScore.demo * 10}/100</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2">
                <span>Real ad spend</span>
                <span className="font-mono text-text-primary">
                  {driveScore.realAdSpend * 10}/100
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2">
                <span>Intricate routing</span>
                <span className="font-mono text-text-primary">
                  {driveScore.intricateRouting * 10}/100
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2">
                <span>Velocity</span>
                <span className="font-mono text-text-primary">{driveScore.velocity * 10}/100</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2">
                <span>Evidence</span>
                <span className="font-mono text-text-primary">{driveScore.evidence * 10}/100</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
