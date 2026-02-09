"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "surface-prospector:call-guide-open";

export default function CallGuide() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "true") setOpen(true);
  }, []);

  const toggle = () => {
    setOpen((prev) => {
      const next = !prev;
      window.localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  };

  return (
    <div className="fixed bottom-6 left-6 z-40">
      {open && (
        <div className="mb-3 w-80 rounded-2xl border border-border bg-surface p-4 shadow-lift">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-wide text-text-secondary">
              Call Guide
            </p>
            <button
              onClick={toggle}
              className="text-xs text-text-secondary hover:text-text-primary"
            >
              Collapse
            </button>
          </div>

          <div className="mt-4 space-y-4">
            <div className="relative rounded-xl border border-border bg-ink p-3">
              <p className="text-[11px] text-text-secondary">Step 1</p>
              <p className="mt-1 text-sm text-text-primary">
                Introduce and build rapport
              </p>
              <span className="absolute -bottom-4 left-1/2 h-4 w-px -translate-x-1/2 bg-border" />
            </div>
            <div className="relative rounded-xl border border-border bg-ink p-3">
              <p className="text-[11px] text-text-secondary">Step 2</p>
              <p className="mt-1 text-sm text-text-primary">
                Discover pain points and provide value
              </p>
              <span className="absolute -bottom-4 left-1/2 h-4 w-px -translate-x-1/2 bg-border" />
            </div>
            <div className="rounded-xl border border-border bg-ink p-3">
              <p className="text-[11px] text-text-secondary">Step 3</p>
              <p className="mt-1 text-sm text-text-primary">
                Pitch the meeting with our strategic team
              </p>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={toggle}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-xs font-semibold text-ink shadow-lift hover:-translate-y-0.5 transition-transform"
        aria-label={open ? "Collapse call guide" : "Expand call guide"}
      >
        SL
      </button>
    </div>
  );
}
