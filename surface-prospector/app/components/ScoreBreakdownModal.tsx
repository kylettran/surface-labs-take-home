"use client";

import { DriveScore } from "@/lib/types";

export default function ScoreBreakdownModal({
  score,
  companyName,
  onClose,
}: {
  score: DriveScore | null;
  companyName: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-5 shadow-lift">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-text-secondary">
              DRIVE Breakdown
            </p>
            <h3 className="mt-1 text-lg font-semibold text-text-primary">
              {companyName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-xs text-text-secondary hover:text-text-primary"
          >
            Close
          </button>
        </div>

        {!score && (
          <div className="mt-4 rounded-xl border border-border bg-ink p-4 text-xs text-text-secondary">
            Score not generated yet. Open the account to generate a DRIVE score.
          </div>
        )}

        {score && (
          <div className="mt-4 space-y-3 text-sm text-text-primary">
            <div className="flex items-center justify-between rounded-lg border border-border bg-ink px-3 py-2">
              <span>Demo-dependent</span>
              <span className="font-mono">{score.demo}/10</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border bg-ink px-3 py-2">
              <span>Real ad spend</span>
              <span className="font-mono">{score.realAdSpend}/10</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border bg-ink px-3 py-2">
              <span>Intricate routing</span>
              <span className="font-mono">{score.intricateRouting}/10</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border bg-ink px-3 py-2">
              <span>Velocity</span>
              <span className="font-mono">{score.velocity}/10</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border bg-ink px-3 py-2">
              <span>Evidence</span>
              <span className="font-mono">{score.evidence}/10</span>
            </div>
            <div className="mt-3 flex items-center justify-between rounded-lg border border-border bg-ink px-3 py-2">
              <span className="text-xs uppercase tracking-wide text-text-secondary">
                Total (100)
              </span>
              <span className="font-mono text-lg text-text-primary">
                {score.total * 2}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
