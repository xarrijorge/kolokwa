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
  Plus,
  Search,
  X,
  User,
  Loader2,
  Shield,
  Copy,
  Check,
} from "lucide-react";

type Staff = {
  id: string;
  email: string;
  name?: string | null;
  username?: string | null;
  role?: string | null;
  created_at?: string | null;
};

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("staff");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    loadStaff();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredStaff(staff);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredStaff(
        staff.filter(
          (s) =>
            s.email.toLowerCase().includes(query) ||
            s.name?.toLowerCase().includes(query) ||
            s.username?.toLowerCase().includes(query) ||
            s.role?.toLowerCase().includes(query),
        ),
      );
    }
  }, [searchQuery, staff]);

  async function loadStaff() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/staff", { cache: "no-store" });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(
          body?.message ?? `Failed to load staff (${res.status})`,
        );
      }
      const data = await res.json();
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

  function resetForm() {
    setEmail("");
    setPassword("");
    setRole("staff");
    setName("");
    setUsername("");
    setShowForm(false);
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.trim() || !password) {
      setError("Email and password are required");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        email: email.trim(),
        password: password,
        role,
        name: name.trim() || undefined,
        username: username.trim() || undefined,
      };
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
      setStaff((prev) => [created, ...prev]);
      setSuccess("Staff member created successfully");
      resetForm();
    } catch (err: any) {
      setError(String(err?.message ?? err));
    } finally {
      setSubmitting(false);
      setTimeout(() => setSuccess(null), 3000);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this staff member? This action cannot be undone."))
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
      setSuccess("Staff member deleted successfully");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(String(err?.message ?? err));
    } finally {
      setLoading(false);
    }
  }

  function copyId(id: string) {
    navigator.clipboard?.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Staff Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage admin access and staff accounts
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="size-4 mr-2" /> Add Staff
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
            <h2 className="text-lg font-semibold">Add New Staff Member</h2>
            <Button variant="ghost" size="sm" onClick={resetForm}>
              <X className="size-4" />
            </Button>
          </div>

          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Secure password"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="staff">Staff</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <Loader2 className="size-4 animate-spin mr-2" />
                ) : null}
                Create Staff
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
              placeholder="Search staff..."
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
              {filteredStaff.length} member{filteredStaff.length !== 1 && "s"}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={loadStaff}
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

        {loading && staff.length === 0 ? (
          <div className="text-center py-12">
            <Loader2 className="size-8 animate-spin mx-auto text-muted-foreground" />
            <p className="text-sm text-muted-foreground mt-2">
              Loading staff...
            </p>
          </div>
        ) : filteredStaff.length === 0 ? (
          <div className="text-center py-12">
            <User className="size-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground mb-4">
              {searchQuery
                ? "No staff match your search"
                : "No staff accounts yet"}
            </p>
            {!searchQuery && (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="size-4 mr-2" /> Add First Staff Member
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="hidden sm:table-cell">Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>
                      <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                        <User className="size-5 text-muted-foreground" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{s.name || "—"}</p>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{s.username || "—"}</p>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{s.email}</p>
                      <p className="text-xs text-muted-foreground font-mono truncate max-w-[150px]">
                        {s.id}
                      </p>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                          s.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : s.role === "editor"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {s.role === "admin" && <Shield className="size-3" />}
                        {s.role ?? "staff"}
                      </span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                      {s.created_at
                        ? new Date(s.created_at).toLocaleDateString()
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyId(s.id)}
                          title="Copy ID"
                        >
                          {copiedId === s.id ? (
                            <Check className="size-4 text-green-600" />
                          ) : (
                            <Copy className="size-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(s.id)}
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
