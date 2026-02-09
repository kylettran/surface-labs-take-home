"use client";

import { useEffect, useState } from "react";
import { Company, DriveScore } from "@/lib/types";
import { storage } from "@/lib/storage";
import { useToast } from "./ToastProvider";
import DriveScoreCard from "./DriveScore";
import EmailDraft from "./EmailDraft";

export default function AccountDetailClient({ company }: { company: Company }) {
  const toast = useToast();
  const [score, setScore] = useState<DriveScore | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEmail, setShowEmail] = useState(false);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState(
    storage.getAccountStatus(company.id)?.status ?? "queued"
  );
  const [flashStatus, setFlashStatus] = useState(false);

  const loadScore = async () => {
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
      setScore(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const cached = storage.getDriveScore(company.id);
    if (cached) {
      setScore(cached);
      return;
    }

    loadScore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [company.id]);

  useEffect(() => {
    const savedNotes = storage.getNotes(company.id);
    if (savedNotes) setNotes(savedNotes);
  }, [company.id]);

  const updateStatus = (nextStatus: typeof status) => {
    setStatus(nextStatus);
    storage.setAccountStatus({
      companyId: company.id,
      status: nextStatus,
      lastAction: `Marked as ${nextStatus}`,
      updatedAt: new Date().toISOString(),
    });
    setFlashStatus(true);
    setTimeout(() => setFlashStatus(false), 1000);
    toast.push({
      title: "Status updated",
      message: `Account moved to ${nextStatus.replace("_", " ")}.`,
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-surface p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold text-text-primary">
                {company.name}
              </h2>
              <a
                href={company.url}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex text-sm text-primary hover:text-blue-300"
              >
                {company.url}
              </a>
              <p className="mt-3 text-sm text-text-secondary">
                {company.description}
              </p>
            </div>
            {company.isExistingCustomer && (
              <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary">
                🏆 Customer
              </span>
            )}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-ink p-4 text-xs text-text-secondary">
              <p className="uppercase tracking-wide">Employees</p>
              <p className="mt-2 text-sm font-semibold text-text-primary">
                {company.employeeCount}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-ink p-4 text-xs text-text-secondary">
              <p className="uppercase tracking-wide">Funding</p>
              <p className="mt-2 text-sm font-semibold text-text-primary">
                {company.fundingStage}
              </p>
              <p className="mt-1 text-[11px] text-text-secondary">
                {company.fundingAmount}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-ink p-4 text-xs text-text-secondary">
              <p className="uppercase tracking-wide">HQ</p>
              <p className="mt-2 text-sm font-semibold text-text-primary">
                {company.headquarters}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-ink p-4 text-xs text-text-secondary">
              <p className="uppercase tracking-wide">Region</p>
              <p className="mt-2 text-sm font-semibold text-text-primary">
                {company.region}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-ink p-4 text-xs text-text-secondary">
              <p className="uppercase tracking-wide">ARR Estimate</p>
              <p className="mt-2 text-sm font-semibold text-text-primary">
                {company.arrEstimate ?? "N/A"}
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-text-secondary">
                Tech Stack
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(company.techStack ?? []).map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-border bg-ink px-3 py-1 text-xs text-text-secondary"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-text-secondary">
                Buyer Personas
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(company.buyerPersonas ?? []).map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-border bg-ink px-3 py-1 text-xs text-text-secondary"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-text-secondary">
                Hiring Signals
              </p>
              <ul className="mt-2 space-y-2 text-sm text-text-secondary">
                {(company.hiringSignals ?? []).map((item) => (
                  <li key={item} className="rounded-lg border border-border bg-ink px-3 py-2">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-text-secondary">
                Pain Signals
              </p>
              <ul className="mt-2 space-y-2 text-sm">
                {(company.painSignals ?? []).map((item) => (
                  <li
                    key={item}
                    className="rounded-lg border border-border bg-warning/10 px-3 py-2 text-warning"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6">
          <p className="text-xs uppercase tracking-wide text-text-secondary">
            Notes
          </p>
          <textarea
            className="mt-3 min-h-[120px] w-full rounded-lg border border-border bg-ink p-3 text-sm text-text-primary"
            placeholder="Add notes for this account..."
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            onBlur={() => storage.setNotes(company.id, notes)}
          />
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              className="rounded-full border border-border px-4 py-2 text-xs text-text-secondary hover:text-text-primary"
              onClick={() => updateStatus("contacted")}
            >
              Mark as Contacted
            </button>
            <button
              className="rounded-full border border-border px-4 py-2 text-xs text-text-secondary hover:text-text-primary"
              onClick={() => updateStatus("replied")}
            >
              Mark as Replied
            </button>
            <button
              className="rounded-full border border-border px-4 py-2 text-xs text-text-secondary hover:text-text-primary"
              onClick={() => updateStatus("skipped")}
            >
              Skip
            </button>
            <button
              className="rounded-full border border-border px-4 py-2 text-xs text-text-secondary hover:text-text-primary"
              onClick={() => updateStatus("meeting_booked")}
            >
              Book Meeting
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-surface p-4">
          <div className="flex flex-wrap gap-2">
            <button
              className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white"
              onClick={() => setShowEmail((prev) => !prev)}
              disabled={!score}
            >
              Generate Email
            </button>
          </div>
          <p className={`mt-2 text-xs text-text-secondary ${flashStatus ? "animate-flash" : ""}`}>
            Current status: <span className="text-text-primary">{status.replace("_", " ")}</span>
          </p>
        </div>

        {isLoading && (
          <div className="space-y-4 rounded-2xl border border-border bg-surface p-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <div>
                <p className="text-sm font-semibold text-text-primary">
                  Scoring in progress
                </p>
                <p className="text-xs text-text-secondary">
                  Analyzing DRIVE signals with Claude…
                </p>
              </div>
            </div>
            <div className="space-y-3 animate-pulse">
              <div className="h-4 w-1/3 rounded bg-ink" />
              <div className="h-24 rounded bg-ink" />
              <div className="h-10 rounded bg-ink" />
            </div>
          </div>
        )}

        {error && !score && (
          <div className="rounded-2xl border border-warning/40 bg-warning/10 p-4 text-sm text-warning">
            <p>Score pending. {error}</p>
            <button
              className="mt-2 rounded-full border border-warning/40 px-3 py-1 text-xs"
              onClick={loadScore}
            >
              Retry
            </button>
          </div>
        )}

        {score && (
          <>
            <DriveScoreCard score={score} />
            <div className="rounded-2xl border border-border bg-surface p-4">
              <p className="text-xs uppercase tracking-wide text-text-secondary">
                Top Pain Signal
              </p>
              <p className="mt-2 text-sm font-semibold text-text-primary">
                {score.topPainSignal}
              </p>
              <p className="mt-3 text-xs text-text-secondary">{score.summary}</p>
            </div>
            {showEmail && (
              <div className="transition-all duration-500 animate-fade-in">
                <EmailDraft company={company} score={score} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
