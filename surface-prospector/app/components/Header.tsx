"use client";

import { dataProvider } from "@/lib/data-provider";
import { getRotationForDate } from "@/lib/rotation";
import { useStorageSnapshot } from "@/lib/storage-hooks";

export default function Header() {
  const rotation = getRotationForDate();
  const snapshot = useStorageSnapshot();
  const dayLabel = new Date().toLocaleDateString(undefined, { weekday: "long" });

  const companies = dataProvider.getCompanies();
  const queuedCount = companies.reduce((acc, company) => {
    const status = snapshot.statuses?.[company.id]?.status ?? "queued";
    return status === "queued" ? acc + 1 : acc;
  }, 0);

  return (
    <header className="border-b border-border bg-ink px-6 py-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">
            Surface Prospector
          </h1>
          <p className="mt-1 text-xs text-text-secondary">
            {dayLabel}: {rotation.label} • {queuedCount} accounts queued
          </p>
        </div>
        <div className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-text-secondary">
          Today: {dayLabel}
        </div>
      </div>
    </header>
  );
}
