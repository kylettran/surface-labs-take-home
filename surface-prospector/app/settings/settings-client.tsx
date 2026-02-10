"use client";

import { useEffect, useState } from "react";
import { storage } from "@/lib/storage";
import { useToast } from "@/app/components/ToastProvider";

export default function SettingsClient() {
  const toast = useToast();
  const [apolloEndpoint, setApolloEndpoint] = useState("");
  const [apolloApiKey, setApolloApiKey] = useState("");

  useEffect(() => {
    const settings = storage.getSettings();
    if (settings) {
      setApolloEndpoint(settings.apolloEndpoint ?? "");
      setApolloApiKey(settings.apolloApiKey ?? "");
    }
  }, []);

  const save = () => {
    storage.setSettings({ apolloEndpoint, apolloApiKey });
    toast.push({
      title: "Settings saved",
      message: "Apollo connection details updated.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold text-text-primary">Settings</h2>
        <p className="mt-2 text-sm text-text-secondary">
          Connect Apollo to power real-time lead discovery. These credentials are stored locally
          for now and can be swapped to a server-side provider later.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 space-y-4">
        <div>
          <label className="text-xs uppercase tracking-wide text-text-secondary">
            Apollo API Endpoint
          </label>
          <input
            className="mt-2 w-full rounded-lg border border-border bg-ink px-3 py-2 text-sm text-text-primary"
            placeholder="https://api.apollo.io/v1/"
            value={apolloEndpoint}
            onChange={(event) => setApolloEndpoint(event.target.value)}
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wide text-text-secondary">
            Apollo API Key
          </label>
          <input
            className="mt-2 w-full rounded-lg border border-border bg-ink px-3 py-2 text-sm text-text-primary"
            placeholder="apollo_api_key"
            type="password"
            value={apolloApiKey}
            onChange={(event) => setApolloApiKey(event.target.value)}
          />
          <p className="mt-2 text-xs text-text-secondary">
            Stored locally in the browser for now. We can wire this to a secure backend later.
          </p>
        </div>
        <button
          className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white"
          onClick={save}
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}
