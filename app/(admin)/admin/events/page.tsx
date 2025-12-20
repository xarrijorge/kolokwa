"use client";

import React, { useEffect, useState, FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash, ExternalLink } from "lucide-react";
import Link from "next/link";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(""); // ISO datetime or date
  const [image, setImage] = useState("");
  const [tag, setTag] = useState("");

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/events", { cache: "no-store" });
      if (!res.ok) {
        throw new Error(`Failed to load events (${res.status})`);
      }
      const data = await res.json();
      // API may return { fallback: [...] } in fallback cases — handle both
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

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setError(null);

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
      // prepend newly created event
      setEvents((prev) => [created, ...prev]);

      // reset form
      setTitle("");
      setDescription("");
      setDate("");
      setImage("");
      setTag("");
    } catch (err: any) {
      setError(String(err?.message ?? err));
    } finally {
      setLoading(false);
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
      // remove locally
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (err: any) {
      setError(String(err?.message ?? err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-4xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Events</h1>
          <p className="text-sm text-muted-foreground">
            Create, edit and manage events shown on the site.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className="text-sm px-3 py-2 rounded-md hover:bg-muted/10"
          >
            Back to Admin
          </Link>
          <Button variant="outline" onClick={loadEvents}>
            Refresh
          </Button>
        </div>
      </div>

      <section className="mb-8">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Create New Event</h2>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-md border px-3 py-2"
                placeholder="Event title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-md border px-3 py-2"
                placeholder="Short description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Date / Time
                </label>
                <input
                  type="datetime-local"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-md border px-3 py-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Leave empty if date is TBA.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Image URL
                </label>
                <input
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full rounded-md border px-3 py-2"
                  placeholder="/images/my-event.png or https://..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Tag / Category
              </label>
              <input
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full rounded-md border px-3 py-2"
                placeholder="e.g. launch, conference, workshop"
              />
            </div>

            <div className="flex items-center gap-3">
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Event"}
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  setTitle("");
                  setDescription("");
                  setDate("");
                  setImage("");
                  setTag("");
                }}
              >
                Reset
              </Button>
            </div>

            {error ? <p className="text-sm text-destructive">{error}</p> : null}
          </form>
        </Card>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">
          All events ({events.length})
        </h2>

        {loading && events.length === 0 ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : events.length === 0 ? (
          <p className="text-sm text-muted-foreground">No events found.</p>
        ) : (
          <div className="grid gap-4">
            {events.map((ev) => (
              <Card
                key={ev.id}
                className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium truncate">
                        {ev.title}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {ev.description ?? "No description"}
                      </p>
                      <div className="text-xs text-muted-foreground mt-1">
                        <span className="mr-3">Tag: {ev.tag ?? "—"}</span>
                        <span>
                          Date:{" "}
                          {ev.date ? new Date(ev.date).toLocaleString() : "TBA"}
                        </span>
                      </div>
                    </div>

                    {ev.image ? (
                      <img
                        src={ev.image}
                        alt={ev.title}
                        className="w-24 h-16 object-cover rounded-md ml-2 hidden sm:block"
                      />
                    ) : null}
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 sm:mt-0">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const url = `/events/${encodeURIComponent(ev.id)}`;
                      window.open(url, "_blank");
                    }}
                  >
                    <ExternalLink className="size-4 mr-2" /> Open
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(ev.id)}
                    disabled={loading}
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
