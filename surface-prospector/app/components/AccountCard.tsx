import Link from "next/link";
import { Company } from "@/lib/types";

const statusLabels: Record<string, string> = {
  queued: "Queued",
  contacted: "Contacted",
  replied: "Replied",
  meeting_booked: "Meeting Booked",
  skipped: "Skipped",
};

function getScoreColor(total: number) {
  if (total >= 45) return "bg-success text-emerald-950";
  if (total >= 35) return "bg-warning text-yellow-950";
  return "bg-muted text-zinc-900";
}

export default function AccountCard({
  company,
  scoreTotal,
  status,
}: {
  company: Company;
  scoreTotal: number;
  status: string;
}) {
  const initials = company.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Link
      href={`/account/${company.id}`}
      className="block rounded-2xl border border-border bg-surface p-4 transition-transform duration-300 ease-out hover:-translate-y-0.5"
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
        <div className={`rounded-full px-3 py-1 text-xs font-semibold font-mono ${getScoreColor(scoreTotal)}`}>
          {scoreTotal}
        </div>
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
    </Link>
  );
}
