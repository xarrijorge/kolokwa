"use client";

import React, { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash, UserPlus, User } from "lucide-react";

/**
 * Admin Staff Management Page
 *
 * - Lists staff users by fetching GET /api/staff
 * - Creates staff users by POST /api/staff with { email, password, role }
 * - Deletes staff users by DELETE /api/staff?id=<id>
 *
 * Notes:
 * - The server-side API routes should perform authentication/authorization checks.
 * - Passwords are handled as plaintext here; in production the server must store
 *   hashed passwords and enforce appropriate validation & policies.
 */

type Staff = {
  id: string;
  email: string;
  role?: string | null;
  created_at?: string | null;
};

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("staff");

  useEffect(() => {
    loadStaff();
  }, []);

  async function loadStaff() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/staff", { cache: "no-store" });
      if (!res.ok) {
        // Try to read body for helpful message
        const body = await res.json().catch(() => null);
        throw new Error(
          body?.message ?? `Failed to load staff (${res.status})`,
        );
      }
      const data = await res.json();
      // allow for fallback shapes { fallback: [...] }
      const list: Staff[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.fallback)
          ? data.fallback
          : [];
      setStaff(list);
    } catch (err: any) {
      setError(String(err?.message ?? err));
      setStaff([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Email and password are required");
      return;
    }

    setSubmitting(true);
    try {
      const payload = { email: email.trim(), password: password, role };
      const res = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(
          body?.message ?? `Failed to create staff (${res.status})`,
        );
      }
      const created = await res.json();
      // server should return created user object
      setStaff((prev) => [created, ...prev]);
      setEmail("");
      setPassword("");
      setRole("staff");
    } catch (err: any) {
      setError(String(err?.message ?? err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this staff user? This action cannot be undone."))
      return;
    setError(null);
    try {
      setLoading(true);
      const res = await fetch(`/api/staff?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message ?? `Failed to delete (${res.status})`);
      }
      setStaff((prev) => prev.filter((s) => s.id !== id));
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
          <h1 className="text-2xl font-bold">Staff Management</h1>
          <p className="text-sm text-muted-foreground">
            Create and manage staff accounts who can access the admin area.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className="text-sm px-3 py-2 rounded-md hover:bg-muted/10"
          >
            Back to Admin
          </Link>
          <Button variant="outline" onClick={loadStaff} disabled={loading}>
            Refresh
          </Button>
        </div>
      </div>

      <section className="mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-md bg-accent/10 p-2">
              <UserPlus className="size-5 text-accent" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Create Staff User</h2>
              <p className="text-sm text-muted-foreground">
                Provide email, password and role. The server should hash
                passwords in production.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleCreate}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3"
          >
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border px-3 py-2 col-span-2"
              type="email"
            />
            <input
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border px-3 py-2"
              type="password"
            />

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="col-span-1 rounded-md border px-3 py-2"
            >
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>

            <div className="col-span-3 flex gap-2 mt-2">
              <Button type="submit" disabled={submitting}>
                {submitting ? "Creating..." : "Create Staff"}
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  setEmail("");
                  setPassword("");
                  setRole("staff");
                }}
              >
                Reset
              </Button>
            </div>

            {error && (
              <div className="text-destructive text-sm mt-2 col-span-3">
                {error}
              </div>
            )}
          </form>
        </Card>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">
          All Staff ({staff.length})
        </h2>

        {loading && staff.length === 0 ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : staff.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No staff accounts found.
          </p>
        ) : (
          <div className="grid gap-3">
            {staff.map((s) => (
              <Card
                key={s.id}
                className="p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="rounded-md bg-muted/5 p-2">
                    <User className="size-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="font-medium truncate">{s.email}</div>
                    <div className="text-sm text-muted-foreground truncate">
                      {s.role ?? "staff"}
                    </div>
                    {s.created_at ? (
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(s.created_at).toLocaleString()}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard?.writeText(s.id);
                      alert("ID copied to clipboard");
                    }}
                  >
                    Copy ID
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(s.id)}
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
