"use client";

import React, { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash, ExternalLink } from "lucide-react";

type Partner = {
  id: string;
  name: string;
  website?: string | null;
  logo?: string | null;
  created_at?: string | null;
};

export default function PartnersAdminPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // form state
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [logo, setLogo] = useState("");

  useEffect(() => {
    loadPartners();
  }, []);

  async function loadPartners() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/partners", { cache: "no-store" });
      if (!res.ok) {
        // API can return fallback data with status 200; handle non-ok as an error
        throw new Error(`Failed to load partners (${res.status})`);
      }
      const data = await res.json();
      // handle both direct list and { fallback: [...] } shapes
      const list: Partner[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.fallback)
          ? data.fallback
          : [];
      setPartners(list);
    } catch (err: any) {
      setError(String(err?.message ?? err));
      setPartners([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    const payload = {
      name: name.trim(),
      website: website?.trim() || undefined,
      logo: logo?.trim() || undefined,
    };

    try {
      setSubmitting(true);
      const res = await fetch("/api/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(
          errData?.message ?? `Failed to create partner (${res.status})`,
        );
      }

      const created: Partner = await res.json();
      setPartners((prev) => [created, ...prev]);

      // reset form
      setName("");
      setWebsite("");
      setLogo("");
    } catch (err: any) {
      setError(String(err?.message ?? err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this partner? This action cannot be undone.")) return;
    setError(null);
    try {
      setLoading(true);
      const res = await fetch(`/api/partners?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(
          errData?.message ?? `Failed to delete partner (${res.status})`,
        );
      }
      setPartners((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      setError(String(err?.message ?? err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-4xl mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Partners</h1>
          <p className="text-sm text-muted-foreground">
            Add and manage partners shown across the site.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className="text-sm px-3 py-2 rounded-md hover:bg-muted/10"
          >
            Back to Admin
          </Link>
          <Button variant="outline" onClick={loadPartners} disabled={loading}>
            Refresh
          </Button>
        </div>
      </div>

      <section className="mb-8">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Create Partner</h2>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border px-3 py-2"
                placeholder="Partner name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Website</label>
              <input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full rounded-md border px-3 py-2"
                placeholder="https://example.org"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Logo (image URL)
              </label>
              <input
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                className="w-full rounded-md border px-3 py-2"
                placeholder="/images/partner.png or https://..."
              />
              {logo ? (
                <div className="mt-3">
                  <div className="text-xs text-muted-foreground mb-1">
                    Preview
                  </div>
                  <div className="w-36 h-20 rounded-md overflow-hidden border">
                    {/* using img for simplicity */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logo}
                      alt="logo preview"
                      className="w-full h-full object-contain bg-white"
                    />
                  </div>
                </div>
              ) : null}
            </div>

            <div className="flex items-center gap-3 mt-2">
              <Button type="submit" disabled={submitting}>
                {submitting ? "Creating..." : "Create Partner"}
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  setName("");
                  setWebsite("");
                  setLogo("");
                }}
              >
                Reset
              </Button>
            </div>

            {error ? (
              <p className="text-sm text-destructive mt-2">{error}</p>
            ) : null}
          </form>
        </Card>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">
          All partners ({partners.length})
        </h2>

        {loading && partners.length === 0 ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : partners.length === 0 ? (
          <p className="text-sm text-muted-foreground">No partners yet.</p>
        ) : (
          <div className="grid gap-4">
            {partners.map((p) => (
              <Card
                key={p.id}
                className="p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-16 h-12 rounded-md overflow-hidden bg-white border flex items-center justify-center">
                    {p.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.logo}
                        alt={p.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-xs text-muted-foreground px-2 text-center">
                        {p.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="font-medium truncate">{p.name}</div>
                    <div className="text-sm text-muted-foreground truncate">
                      {p.website ? (
                        <a
                          href={p.website}
                          target="_blank"
                          rel="noreferrer"
                          className="underline"
                        >
                          {p.website}
                        </a>
                      ) : (
                        <span className="text-xs">No website</span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {p.created_at
                        ? new Date(p.created_at).toLocaleString()
                        : ""}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {p.website ? (
                    <a
                      href={p.website}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted/10"
                    >
                      <ExternalLink className="size-4" /> Visit
                    </a>
                  ) : null}

                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(p.id)}
                  >
                    <Trash className="size-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
