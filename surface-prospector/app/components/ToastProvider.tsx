"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { storage } from "@/lib/storage";

interface Toast {
  id: string;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface ToastContextValue {
  push: (toast: Omit<Toast, "id">) => void;
}

const ToastContext = createContext<ToastContextValue>({
  push: () => undefined,
});

export function useToast() {
  return useContext(ToastContext);
}

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((toast: Omit<Toast, "id">) => {
    setToasts((prev) => [...prev, { ...toast, id: crypto.randomUUID() }]);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  useEffect(() => {
    const handler = () => {
      push({
        title: "Storage full",
        message: "Local storage is full. Clear cached data to keep saving scores and emails.",
        actionLabel: "Clear cache",
        onAction: () => storage.clearAll(),
      });
    };

    window.addEventListener("surface-prospector:quota", handler as EventListener);
    return () => window.removeEventListener("surface-prospector:quota", handler as EventListener);
  }, [push]);

  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toasts.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50 space-y-3">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className="w-80 rounded-xl border border-border bg-surface p-4 shadow-lift"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-text-primary">{toast.title}</p>
                  <p className="mt-1 text-xs text-text-secondary">{toast.message}</p>
                </div>
                <button
                  className="text-xs text-text-secondary hover:text-text-primary"
                  onClick={() => dismiss(toast.id)}
                >
                  Dismiss
                </button>
              </div>
              {toast.actionLabel && (
                <button
                  className="mt-3 text-xs font-semibold text-primary hover:text-blue-300"
                  onClick={() => {
                    toast.onAction?.();
                    dismiss(toast.id);
                  }}
                >
                  {toast.actionLabel}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}
