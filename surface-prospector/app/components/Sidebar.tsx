"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { dataProvider } from "@/lib/data-provider";
import { getRotationForDate } from "@/lib/rotation";
import { useStorageSnapshot } from "@/lib/storage-hooks";

const navItems = [
  { href: "/leads", label: "Lead Ocean" },
  { href: "/", label: "Dashboard" },
  { href: "/pipeline", label: "Pipeline" },
  { href: "/settings", label: "Settings" },
];

const statusLabels: Record<string, string> = {
  queued: "Queued",
  contacted: "Contacted",
  replied: "Replied",
  meeting_booked: "Meeting Booked",
  skipped: "Skipped",
};

export default function Sidebar() {
  const pathname = usePathname();
  const rotation = getRotationForDate();
  const snapshot = useStorageSnapshot();
  const companies = dataProvider.getCompanies();

  const counts = companies.reduce(
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

  return (
    <aside className="w-52 shrink-0 border-r border-border bg-surface px-4 py-6">
      <a
        href="https://withsurface.com/"
        target="_blank"
        rel="noreferrer"
        className="text-sm font-semibold tracking-wide text-text-primary hover:text-blue-300"
      >
        <span className="text-text-primary">Surface </span>
        <span className="text-primary">Labs</span>
      </a>
      <div className="mt-6 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-ink text-text-primary"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="mt-8">
        <p className="text-xs uppercase tracking-wide text-text-secondary">
          Today&apos;s Rotation
        </p>
        <p className="mt-2 text-sm font-medium text-text-primary">
          {rotation.label}
        </p>
      </div>

      <div className="mt-8">
        <p className="text-xs uppercase tracking-wide text-text-secondary">
          Status Counts
        </p>
        <div className="mt-3 space-y-2 text-xs text-text-secondary">
          {Object.entries(statusLabels).map(([key, label]) => (
            <Link
              key={key}
              href={`/pipeline?status=${key}`}
              className="flex items-center justify-between rounded-md px-2 py-1 hover:bg-ink"
            >
              <span>{label}</span>
              <span className="font-mono text-text-primary">
                {counts[key] ?? 0}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
