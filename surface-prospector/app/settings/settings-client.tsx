"use client";

import { useEffect, useState } from "react";
import { storage } from "@/lib/storage";
import { useToast } from "@/app/components/ToastProvider";
import Image from "next/image";
import apolloIcon from "./apollo-icon.svg";

export default function SettingsClient() {
  const toast = useToast();
  const [apolloEndpoint, setApolloEndpoint] = useState("");
  const [apolloApiKey, setApolloApiKey] = useState("");
  const [showApollo, setShowApollo] = useState(false);

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
          Manage integrations that power Deep Surface Prospector. Connect the tools you want, and
          keep the rest disabled.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6">
        <p className="text-xs uppercase tracking-wide text-text-secondary">
          Integrations
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <button
            onClick={() => setShowApollo((prev) => !prev)}
            className="flex items-center gap-4 rounded-xl border border-border bg-ink p-4 text-left hover:border-primary/40"
          >
            <div className="h-12 w-12 rounded-xl border border-border bg-surface flex items-center justify-center">
              <Image src={apolloIcon} alt="Apollo" width={36} height={36} />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">Apollo</p>
              <p className="mt-1 text-xs text-text-secondary">
                Power real-time lead discovery and enrichment.
              </p>
            </div>
          </button>
          <div className="flex items-center gap-4 rounded-xl border border-dashed border-border bg-ink/30 p-4">
            <div className="h-12 w-12 rounded-xl border border-border bg-surface flex items-center justify-center text-xs text-text-secondary">
              Soon
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">More integrations</p>
              <p className="mt-1 text-xs text-text-secondary">
                Clay, HubSpot, and routing tools coming next.
              </p>
            </div>
          </div>
        </div>
      </div>

      {showApollo && (
        <div className="rounded-2xl border border-border bg-surface p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-text-primary">Apollo Integration</h3>
              <p className="mt-1 text-xs text-text-secondary">
                Connect Apollo to power real-time lead discovery.
              </p>
            </div>
            <button
              onClick={() => setShowApollo(false)}
              className="text-xs text-text-secondary hover:text-text-primary"
            >
              Close
            </button>
          </div>
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
            Save Apollo Settings
          </button>
        </div>
      )}
    </div>
  );
}
