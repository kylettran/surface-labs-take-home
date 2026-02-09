"use client";

import { useEffect, useState } from "react";
import { DriveScore } from "@/lib/types";

type ScoreKey = "demo" | "realAdSpend" | "intricateRouting" | "velocity" | "evidence";

const items: Array<{ key: ScoreKey; label: string }> = [
  { key: "demo", label: "Demo-dependent" },
  { key: "realAdSpend", label: "Real ad spend" },
  { key: "intricateRouting", label: "Intricate routing" },
  { key: "velocity", label: "Velocity" },
  { key: "evidence", label: "Evidence" },
];

function getBarColor(value: number) {
  if (value >= 8) return "bg-success";
  if (value >= 6) return "bg-warning";
  return "bg-muted";
}

export default function DriveScoreCard({ score }: { score: DriveScore }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-surface p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-text-secondary">
            DRIVE Score
          </p>
          <p className="mt-1 text-2xl font-semibold text-text-primary">
            <span className="font-mono">{score.total * 2}</span>
          </p>
        </div>
        <div className="rounded-full border border-border bg-ink px-3 py-1 text-xs text-text-secondary">
          Max 100
        </div>
      </div>
      <div className="space-y-3">
        {items.map((item) => {
          const value = score[item.key] as number;
          const percent = `${(value / 10) * 100}%`;
          return (
            <div key={item.key} className="space-y-1">
              <div className="flex items-center justify-between text-xs text-text-secondary">
                <span>{item.label}</span>
                <span className="font-mono text-text-primary">{value}/10</span>
              </div>
              <div className="h-2 w-full rounded-full bg-ink">
                <div
                  className={`h-2 rounded-full transition-all duration-700 ${getBarColor(value)}`}
                  style={{ width: mounted ? percent : "0%" }}
                />
              </div>
              <p className="text-[11px] text-text-secondary">
                {score.reasoning[item.key]}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
