"use client";

import React, { useEffect, useState, FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Pencil,
  Calendar,
  Loader2,
  MoreHorizontal,
} from "lucide-react";

type EventItem = {
  id: string;
  title: string;
  description?: string | null;
  date?: string | null;
  image?: string | null;
  tag?: string | null;
  created_at?: string | null;
};

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState("");
  const [tag, setTag] = useState("");

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredEvents(events);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredEvents(
        events.filter(
          (ev) =>
            ev.title.toLowerCase().includes(query) ||
            ev.description?.toLowerCase().includes(query) ||
            ev.tag?.toLowerCase().includes(query),
        ),
      );
    }
  }, [searchQuery, events]);

  async function loadEvents() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/events", { cache: "no-store" });
      if (!res.ok) {
        throw new Error(`Failed to load events (${res.status})`);
      }
      const data = await res.json();
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.fallback)
          ? data.fallback
          : [];
      setEvents(list);
    } catch (err: any) {
      setError(String(err?.message ?? err));
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setTitle("");
    setDescription("");
    setDate("");
    setImage("");
    setTag("");
    setEditingEvent(null);
    setShowForm(false);
  }

  function openEditForm(event: EventItem) {
    setEditingEvent(event);
    setTitle(event.title);
    setDescription(event.description ?? "");
    setDate(event.date ? event.date.slice(0, 16) : "");
    setImage(event.image ?? "");
    setTag(event.tag ?? "");
    setShowForm(true);
  }

  function openCreateForm() {
    resetForm();
    setShowForm(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim() || undefined,
      date: date || undefined,
      image: image || undefined,
      tag: tag || undefined,
    };

    try {
      setLoading(true);

      if (editingEvent) {
        const res = await fetch("/api/events", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingEvent.id, ...payload }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => null);
          throw new Error(
            errData?.message ?? `Failed to update event (${res.status})`,
          );
        }

        const updated: EventItem = await res.json();
        setEvents((prev) =>
          prev.map((ev) => (ev.id === editingEvent.id ? updated : ev)),
        );
        setSuccess("Event updated successfully");
      } else {
        const res = await fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => null);
          throw new Error(
            errData?.message ?? `Failed to create event (${res.status})`,
          );
        }

        const created: EventItem = await res.json();
        setEvents((prev) => [created, ...prev]);
        setSuccess("Event created successfully");
      }

      resetForm();
    } catch (err: any) {
      setError(String(err?.message ?? err));
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(null), 3000);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this event? This action cannot be undone.")) return;
    setError(null);
    try {
      setLoading(true);
      const res = await fetch(`/api/events?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message ?? `Failed to delete (${res.status})`);
      }
      setEvents((prev) => prev.filter((e) => e.id !== id));
      setSuccess("Event deleted successfully");
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
          <h1 className="text-2xl font-bold">Events</h1>
          <p className="text-sm text-muted-foreground">
            Manage events displayed on the site
          </p>
        </div>
        <Button onClick={openCreateForm}>
          <Plus className="size-4 mr-2" /> New Event
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

      {/* Create/Edit Form */}
      {showForm && (
        <Card className="p-4 sm:p-6 border-2 border-primary/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              {editingEvent ? "Edit Event" : "Create New Event"}
            </h2>
            <Button variant="ghost" size="sm" onClick={resetForm}>
              <X className="size-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Event title"
                  className="mt-1"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Event description"
                  rows={3}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="date">Date & Time</Label>
                <Input
                  id="date"
                  type="datetime-local"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Leave empty for TBA
                </p>
              </div>

              <div>
                <Label htmlFor="tag">Tag / Category</Label>
                <Input
                  id="tag"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="e.g. launch, workshop"
                  className="mt-1"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="/images/event.png or https://..."
                  className="mt-1"
                />
                {image && (
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground mb-1">
                      Preview:
                    </p>
                    <img
                      src={image}
                      alt="Preview"
                      className="w-32 h-20 object-cover rounded-md border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <Loader2 className="size-4 animate-spin mr-2" />
                ) : null}
                {editingEvent ? "Update Event" : "Create Event"}
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
              placeholder="Search events..."
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
              {filteredEvents.length} event{filteredEvents.length !== 1 && "s"}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={loadEvents}
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

        {loading && events.length === 0 ? (
          <div className="text-center py-12">
            <Loader2 className="size-8 animate-spin mx-auto text-muted-foreground" />
            <p className="text-sm text-muted-foreground mt-2">
              Loading events...
            </p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="size-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground mb-4">
              {searchQuery
                ? "No events match your search"
                : "No events created yet"}
            </p>
            {!searchQuery && (
              <Button onClick={openCreateForm}>
                <Plus className="size-4 mr-2" /> Create First Event
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Tag</TableHead>
                  <TableHead className="hidden sm:table-cell">Date</TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Created
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((ev) => (
                  <TableRow key={ev.id}>
                    <TableCell>
                      {ev.image ? (
                        <img
                          src={ev.image}
                          alt={ev.title}
                          className="w-10 h-10 object-cover rounded"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                          <Calendar className="size-4 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="min-w-0">
                        <p className="font-medium truncate max-w-[200px]">
                          {ev.title}
                        </p>
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {ev.description ?? "No description"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {ev.tag ? (
                        <span className="px-2 py-1 bg-secondary/10 text-secondary rounded text-xs font-medium">
                          {ev.tag}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm">
                      {ev.date
                        ? new Date(ev.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "TBA"}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                      {ev.created_at
                        ? new Date(ev.created_at).toLocaleDateString()
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditForm(ev)}
                          title="Edit"
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            window.open(`/events/${ev.id}`, "_blank")
                          }
                          title="View"
                        >
                          <ExternalLink className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(ev.id)}
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
