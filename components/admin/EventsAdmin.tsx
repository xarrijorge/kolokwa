"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
} from "lucide-react";

type EventItem = {
  id: string;
  title: string;
  description?: string | null;
  date?: string | null;
  image?: string | null;
  tag?: string | null;
  created_at?: string | null;
  participantsCount?: number;
  checkedInCount?: number;
};

export default function EventsAdmin() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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

      // Fetch participants count for each event
      const eventsWithCounts = await Promise.all(
        list.map(async (event: EventItem) => {
          try {
            const participantsRes = await fetch(
              `/api/events/${event.id}/participants`,
            );
            if (participantsRes.ok) {
              const participants = await participantsRes.json();
              const checkedInCount = participants.filter(
                (p: any) => p.checked_in,
              ).length;
              return {
                ...event,
                participantsCount: participants.length,
                checkedInCount,
              };
            }
          } catch (error) {
            console.error(
              `Failed to fetch participants for event ${event.id}:`,
              error,
            );
          }
          return { ...event, participantsCount: 0, checkedInCount: 0 };
        }),
      );

      setEvents(eventsWithCounts);
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
        <Link href="/admin/events/create">
          <Button>
            <Plus className="size-4 mr-2" /> New Event
          </Button>
        </Link>
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
              <Link href="/admin/events/create">
                <Button>
                  <Plus className="size-4 mr-2" /> Create First Event
                </Button>
              </Link>
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
                    Participants
                  </TableHead>
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
                    <TableCell className="hidden lg:table-cell text-sm">
                      {ev.checkedInCount ?? 0} / {ev.participantsCount ?? 0}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                      {ev.created_at
                        ? new Date(ev.created_at).toLocaleDateString()
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/events/${ev.id}`}>
                          <Button variant="ghost" size="sm" title="Edit">
                            <Pencil className="size-4" />
                          </Button>
                        </Link>
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
