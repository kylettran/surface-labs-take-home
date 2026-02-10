"use client";

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

const regionOptions: FilterState["region"][] = [
  "All",
  "NAM",
  "EMEA",
  "APAC",
];
const sizeOptions: FilterState["size"][] = [
  "All",
  "Growth",
  "Mid-Market",
  "Enterprise",
];
const statusOptions: FilterState["status"][] = [
  "All",
  "queued",
  "contacted",
  "replied",
  "meeting_booked",
  "skipped",
];

const statusLabels: Record<string, string> = {
  queued: "Queued",
  contacted: "Contacted",
  replied: "Replied",
  meeting_booked: "Meeting Booked",
  skipped: "Skipped",
  All: "All",
};

export default function FilterBar({
  filters,
  onChange,
}: {
  filters: FilterState;
  onChange: (next: FilterState) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-surface px-4 py-3">
      <label className="flex items-center gap-2 text-xs text-text-secondary">
        Region
        <select
          value={filters.region}
          onChange={(event) =>
            onChange({ ...filters, region: event.target.value as FilterState["region"] })
          }
          className="rounded-lg border border-border bg-ink px-3 py-1 text-xs text-text-primary"
        >
          {regionOptions.map((option) => (
            <option key={option} value={option} className="bg-ink">
              {option}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-2 text-xs text-text-secondary">
        Size
        <select
          value={filters.size}
          onChange={(event) =>
            onChange({ ...filters, size: event.target.value as FilterState["size"] })
          }
          className="rounded-lg border border-border bg-ink px-3 py-1 text-xs text-text-primary"
        >
          {sizeOptions.map((option) => (
            <option key={option} value={option} className="bg-ink">
              {option}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-2 text-xs text-text-secondary">
        Status
        <select
          value={filters.status}
          onChange={(event) =>
            onChange({ ...filters, status: event.target.value as FilterState["status"] })
          }
          className="rounded-lg border border-border bg-ink px-3 py-1 text-xs text-text-primary"
        >
          {statusOptions.map((option) => (
            <option key={option} value={option} className="bg-ink">
              {statusLabels[option] ?? option}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
