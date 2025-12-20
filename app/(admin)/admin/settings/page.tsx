"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

/**
 * Admin settings placeholder page
 *
 * Notes:
 * - This is a UI-first placeholder. There is no server-side settings storage
 *   implemented by default in this project. Saving uses localStorage so you can
 *   preview changes in the admin UI. Replace the persistence layer with an API
 *   or DB-backed settings table when ready.
 */

type SettingsState = {
  siteTitle: string;
  siteDescription: string;
  newsletterEnabled: boolean;
  mailerliteApiKey: string;
};

const STORAGE_KEY = "kolokwa_admin_settings_v1";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingsState>({
    siteTitle: "KoloKwa Tech",
    siteDescription: "Building a thriving tech ecosystem in Liberia.",
    newsletterEnabled: true,
    mailerliteApiKey: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // Load saved settings from localStorage (placeholder persistence).
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setSettings((s) => ({ ...s, ...(parsed as Partial<SettingsState>) }));
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  function update<K extends keyof SettingsState>(
    key: K,
    value: SettingsState[K],
  ) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setLoading(true);
    setMessage(null);
    try {
      // Placeholder persistence: localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      setMessage(
        "Settings saved locally (placeholder). Replace with server API for persistence.",
      );
    } catch (err: any) {
      setMessage("Failed to save settings: " + String(err?.message ?? err));
    } finally {
      setLoading(false);
      // clear message after 4s
      setTimeout(() => setMessage(null), 4000);
    }
  }

  function handleReset() {
    if (!confirm("Reset settings to defaults?")) return;
    localStorage.removeItem(STORAGE_KEY);
    setSettings({
      siteTitle: "KoloKwa Tech",
      siteDescription: "Building a thriving tech ecosystem in Liberia.",
      newsletterEnabled: true,
      mailerliteApiKey: "",
    });
    setMessage("Settings reset to defaults (local).");
    setTimeout(() => setMessage(null), 3000);
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify(settings, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "kolokwa-settings.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function importJSON(file: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        setSettings((s) => ({ ...s, ...(parsed as Partial<SettingsState>) }));
        setMessage("Imported settings (local only). Save to persist.");
        setTimeout(() => setMessage(null), 3000);
      } catch (err: any) {
        setMessage("Failed to import: " + String(err?.message ?? err));
      }
    };
    reader.readAsText(file);
  }

  return (
    <main className="max-w-4xl mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage site-wide configuration (placeholder UI).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className="text-sm px-3 py-2 rounded-md hover:bg-muted/10"
          >
            Back to Admin
          </Link>
          <Button
            variant="outline"
            onClick={() => {
              localStorage.removeItem(STORAGE_KEY);
              setMessage("Cleared local cache");
              setTimeout(() => setMessage(null), 2500);
            }}
          >
            Clear Local Cache
          </Button>
        </div>
      </div>

      <section className="mb-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Site Information</h2>

          <div className="grid gap-3">
            <label className="text-sm font-medium">Site Title</label>
            <Input
              value={settings.siteTitle}
              onChange={(e) => update("siteTitle", e.target.value)}
            />

            <label className="text-sm font-medium">Site Description</label>
            <Textarea
              value={settings.siteDescription}
              onChange={(e) => update("siteDescription", e.target.value)}
            />
          </div>
        </Card>
      </section>

      <section className="mb-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Integrations</h2>

          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium block mb-1">
                Newsletter (MailerLite) Integration
              </label>
              <input
                className="w-full rounded-md border px-3 py-2"
                placeholder="MailerLite API key (stored locally in this demo)"
                value={settings.mailerliteApiKey}
                onChange={(e) => update("mailerliteApiKey", e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                In production, store API keys in environment variables or a
                secure secrets manager and never expose them to the browser.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.newsletterEnabled}
                  onChange={(e) =>
                    update("newsletterEnabled", e.target.checked)
                  }
                  className="h-4 w-4"
                />
                <span className="text-sm">Enable newsletter signup</span>
              </label>
            </div>
          </div>
        </Card>
      </section>

      <section className="mb-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            Local Persistence (Demo)
          </h2>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save Settings (local)"}
            </Button>

            <Button variant="outline" onClick={handleReset}>
              Reset to Defaults
            </Button>

            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={exportJSON}>
                Export JSON
              </Button>

              <label className="inline-flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="file"
                  accept="application/json"
                  onChange={(e) => importJSON(e.target.files?.[0] ?? null)}
                  className="hidden"
                />
                <span className="underline">Import JSON</span>
              </label>
            </div>
          </div>

          {message ? (
            <div className="mt-4 text-sm text-muted-foreground">{message}</div>
          ) : null}
        </Card>
      </section>

      <section>
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">What's next</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
            <li>
              Persist settings in the database (add a `settings` table) or a
              dedicated storage endpoint.
            </li>
            <li>
              Protect settings APIs behind admin authentication and role checks
              (server-side).
            </li>
            <li>
              Move secrets (API keys) into environment variables or a secrets
              manager — don't expose them to the client.
            </li>
          </ul>
        </Card>
      </section>
    </main>
  );
}
