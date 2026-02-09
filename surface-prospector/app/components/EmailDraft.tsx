"use client";

import { useCallback, useEffect, useState } from "react";
import { Company, DriveScore, OutboundEmail } from "@/lib/types";
import { DEFAULT_ANGLES, getSurfaceValueProp } from "@/lib/email-templates";
import { storage } from "@/lib/storage";
import { useToast } from "./ToastProvider";

export default function EmailDraft({
  company,
  score,
}: {
  company: Company;
  score: DriveScore;
}) {
  const toast = useToast();
  const [draft, setDraft] = useState<OutboundEmail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [angle, setAngle] = useState(DEFAULT_ANGLES[0]);
  const [showAngles, setShowAngles] = useState(false);

  const generateEmail = useCallback(
    async (selectedAngle: string) => {
      setIsLoading(true);
      setError(null);
      setAngle(selectedAngle);
      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            company,
            topPainSignal: score.topPainSignal,
            angle: selectedAngle,
            buyerPersona: company.buyerPersonas?.[0] ?? "Revenue leader",
            valueProp: getSurfaceValueProp(company),
          }),
        });

        if (!response.ok) {
          const payload = await response.json();
          throw new Error(payload?.error ?? "Failed to generate email");
        }

        const data = (await response.json()) as OutboundEmail;
        setDraft(data);
        storage.setEmailDraft(company.id, data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    },
    [company, score.topPainSignal]
  );

  useEffect(() => {
    const cached = storage.getEmailDraft(company.id);
    if (cached) {
      setDraft(cached);
      setAngle(cached.angle || DEFAULT_ANGLES[0]);
      return;
    }
    generateEmail(DEFAULT_ANGLES[0]);
  }, [company.id, generateEmail]);

  const handleGenerate = (selectedAngle: string) => {
    generateEmail(selectedAngle);
  };

  const handleCopy = async () => {
    if (!draft) return;
    try {
      await navigator.clipboard.writeText(`Subject: ${draft.subject}\n\n${draft.body}`);
      toast.push({
        title: "Copied",
        message: "Email copied to clipboard.",
      });
    } catch {
      toast.push({
        title: "Copy failed",
        message: "Unable to access clipboard.",
      });
    }
  };

  return (
    <div className="mt-6 rounded-2xl border border-border bg-surface p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-text-secondary">
            Email Draft
          </p>
          <p className="mt-1 text-sm text-text-secondary">
            Angle: <span className="text-text-primary">{angle}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleCopy}
            className="rounded-full border border-border px-3 py-1 text-xs text-text-secondary hover:text-text-primary"
            disabled={!draft}
          >
            Copy to Clipboard
          </button>
          <button
            onClick={() => handleGenerate(angle)}
            className="rounded-full border border-border px-3 py-1 text-xs text-text-secondary hover:text-text-primary"
            disabled={isLoading}
          >
            Regenerate
          </button>
          <button
            onClick={() => setShowAngles((prev) => !prev)}
            className="rounded-full border border-border px-3 py-1 text-xs text-text-secondary hover:text-text-primary"
          >
            Try Different Angle
          </button>
        </div>
      </div>

      {showAngles && (
        <div className="mt-3 flex flex-wrap gap-2">
          {DEFAULT_ANGLES.filter((item) => item !== angle)
            .slice(0, 3)
            .map((item) => (
              <button
                key={item}
                className="rounded-full bg-ink px-3 py-1 text-xs text-text-secondary hover:text-text-primary"
                onClick={() => handleGenerate(item)}
              >
                {item}
              </button>
            ))}
        </div>
      )}

      {isLoading && (
        <div className="mt-4 rounded-xl border border-border bg-ink p-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <div>
              <p className="text-sm font-semibold text-text-primary">
                Generating email
              </p>
              <p className="text-xs text-text-secondary">
                Writing a tailored outbound message…
              </p>
            </div>
          </div>
          <div className="mt-4 animate-pulse space-y-3">
            <div className="h-4 w-1/3 rounded bg-surface" />
            <div className="h-24 rounded bg-surface" />
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-lg border border-warning/40 bg-warning/10 px-3 py-2 text-xs text-warning">
          {error}
        </div>
      )}

      {draft && !isLoading && (
        <div className="mt-4 space-y-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-text-secondary">
              Subject
            </p>
            <p className="mt-1 text-sm font-semibold text-text-primary">
              {draft.subject}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-text-secondary">
              Body
            </p>
            <div
              className="mt-2 min-h-[120px] rounded-lg border border-border bg-ink p-3 text-sm text-text-primary"
              contentEditable
              suppressContentEditableWarning
              onBlur={(event) => {
                const updated = event.currentTarget.textContent ?? "";
                setDraft((prev) => {
                  if (!prev) return prev;
                  const next = { ...prev, body: updated };
                  storage.setEmailDraft(company.id, next);
                  return next;
                });
              }}
            >
              {draft.body}
            </div>
          </div>
          <div className="rounded-lg border border-border bg-ink px-3 py-2 text-xs text-text-secondary">
            <p className="font-semibold text-text-primary">Why this angle</p>
            <p className="mt-1">{draft.personalizationNotes}</p>
          </div>
        </div>
      )}
    </div>
  );
}
