"use client";

import React, { useEffect, useState, FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Trash2,
  ExternalLink,
  Plus,
  Search,
  X,
  Briefcase,
  Loader2,
} from "lucide-react";

type Partner = {
  id: string;
  name: string;
  website?: string | null;
  logo?: string | null;
  created_at?: string | null;
};

export default function PartnersAdminPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [logo, setLogo] = useState("");

  useEffect(() => {
    loadPartners();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPartners(partners);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredPartners(
        partners.filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            p.website?.toLowerCase().includes(query),
        ),
      );
    }
  }, [searchQuery, partners]);

  async function loadPartners() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/partners", { cache: "no-store" });
      if (!res.ok) {
        throw new Error(`Failed to load partners (${res.status})`);
      }
      const data = await res.json();
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

  function resetForm() {
    setName("");
    setWebsite("");
    setLogo("");
    setShowForm(false);
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

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
      setSuccess("Partner created successfully");
      resetForm();
    } catch (err: any) {
      setError(String(err?.message ?? err));
    } finally {
      setSubmitting(false);
      setTimeout(() => setSuccess(null), 3000);
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
      setSuccess("Partner deleted successfully");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(String(err?.message ?? err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Partners</h1>
          <p className="text-sm text-muted-foreground">
            Manage partner organizations
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="size-4 mr-2" /> Add Partner
        </Button>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 rounded-lg bg-green-100 text-green-800 text-sm">
          {success}
        </div>
      )}

      {/* Create Form */}
      {showForm && (
        <Card className="p-4 sm:p-6 border-2 border-primary/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Add New Partner</h2>
            <Button variant="ghost" size="sm" onClick={resetForm}>
              <X className="size-4" />
            </Button>
          </div>

          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Partner name"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://example.org"
                  className="mt-1"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="logo">Logo URL</Label>
                <Input
                  id="logo"
                  value={logo}
                  onChange={(e) => setLogo(e.target.value)}
                  placeholder="/images/partner.png or https://..."
                  className="mt-1"
                />
                {logo && (
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground mb-1">
                      Preview:
                    </p>
                    <div className="w-24 h-16 rounded-md overflow-hidden border bg-white">
                      <img
                        src={logo}
                        alt="Logo preview"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <Loader2 className="size-4 animate-spin mr-2" />
                ) : null}
                Create Partner
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Search and Table */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search partners..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {filteredPartners.length} partner
              {filteredPartners.length !== 1 && "s"}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={loadPartners}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Refresh"
              )}
            </Button>
          </div>
        </div>

        {loading && partners.length === 0 ? (
          <div className="text-center py-12">
            <Loader2 className="size-8 animate-spin mx-auto text-muted-foreground" />
            <p className="text-sm text-muted-foreground mt-2">
              Loading partners...
            </p>
          </div>
        ) : filteredPartners.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="size-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground mb-4">
              {searchQuery
                ? "No partners match your search"
                : "No partners added yet"}
            </p>
            {!searchQuery && (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="size-4 mr-2" /> Add First Partner
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Logo</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Website
                  </TableHead>
                  <TableHead className="hidden md:table-cell">Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPartners.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      {p.logo ? (
                        <div className="w-12 h-10 rounded overflow-hidden bg-white border flex items-center justify-center">
                          <img
                            src={p.logo}
                            alt={p.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-10 bg-muted rounded flex items-center justify-center">
                          <span className="text-xs font-medium text-muted-foreground">
                            {p.name.slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{p.name}</p>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {p.website ? (
                        <a
                          href={p.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-blue-600 hover:underline truncate max-w-[200px] block"
                        >
                          {p.website.replace(/^https?:\/\//, "")}
                        </a>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {p.created_at
                        ? new Date(p.created_at).toLocaleDateString()
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        {p.website && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(p.website!, "_blank")}
                            title="Visit website"
                          >
                            <ExternalLink className="size-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(p.id)}
                          disabled={loading}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          title="Delete"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
}
