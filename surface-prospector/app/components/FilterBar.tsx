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
      <div className="flex items-center gap-2">
        <span className="text-xs uppercase tracking-wide text-text-secondary">
          Region
        </span>
        <div className="flex items-center gap-1">
          {regionOptions.map((option) => (
            <button
              key={option}
              onClick={() => onChange({ ...filters, region: option })}
              className={`rounded-full px-3 py-1 text-xs transition-colors ${
                filters.region === option
                  ? "bg-primary text-white"
                  : "bg-ink text-text-secondary hover:text-text-primary"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs uppercase tracking-wide text-text-secondary">
          Size
        </span>
        <div className="flex items-center gap-1">
          {sizeOptions.map((option) => (
            <button
              key={option}
              onClick={() => onChange({ ...filters, size: option })}
              className={`rounded-full px-3 py-1 text-xs transition-colors ${
                filters.size === option
                  ? "bg-primary text-white"
                  : "bg-ink text-text-secondary hover:text-text-primary"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs uppercase tracking-wide text-text-secondary">
          Status
        </span>
        <div className="flex flex-wrap items-center gap-1">
          {statusOptions.map((option) => (
            <button
              key={option}
              onClick={() => onChange({ ...filters, status: option })}
              className={`rounded-full px-3 py-1 text-xs transition-colors ${
                filters.status === option
                  ? "bg-primary text-white"
                  : "bg-ink text-text-secondary hover:text-text-primary"
              }`}
            >
              {statusLabels[option] ?? option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
