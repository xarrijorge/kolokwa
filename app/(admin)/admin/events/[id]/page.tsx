"use client";

import React, { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Calendar, Users } from "lucide-react";

type EventItem = {
  id: string;
  title: string;
  description?: string | null;
  date?: string | null;
  image?: string | null;
  tag?: string | null;
  created_at?: string | null;
};

export default function EventDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState("");
  const [tag, setTag] = useState("");

  useEffect(() => {
    async function loadEvent() {
      setLoading(true);
      try {
        const res = await fetch(`/api/events/${id}`);
        if (!res.ok) {
          throw new Error(`Failed to load event (${res.status})`);
        }
        const data = await res.json();
        setEvent(data);
        // Populate form
        setTitle(data.title);
        setDescription(data.description ?? "");
        setDate(data.date ? data.date.slice(0, 16) : "");
        setImage(data.image ?? "");
        setTag(data.tag ?? "");
      } catch (err: any) {
        setError(String(err?.message ?? err));
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadEvent();
    }
  }, [id]);

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
      setSaving(true);
      const res = await fetch("/api/events", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...payload }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(
          errData?.message ?? `Failed to update event (${res.status})`,
        );
      }

      const updated = await res.json();
      setEvent(updated);
      setSuccess("Event updated successfully");
    } catch (err: any) {
      setError(String(err?.message ?? err));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="size-5 animate-pulse" />
          <span>Loading event...</span>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/events">
            <Button variant="ghost">
              <ArrowLeft className="size-4 mr-2" />
              Back to Events
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Event Not Found</h1>
          </div>
        </div>
        <Card className="p-6">
          <p className="text-muted-foreground">
            The requested event could not be found.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/events">
          <Button variant="ghost">
            <ArrowLeft className="size-4 mr-2" />
            Back to Events
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Edit Event</h1>
          <p className="text-sm text-muted-foreground">
            View and edit event details
          </p>
        </div>
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

      {/* Event Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Event Info */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Event Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Title</p>
                <p className="font-medium">{event.title}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">
                  {event.date
                    ? new Date(event.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })
                    : "TBA"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tag</p>
                <p className="font-medium">
                  {event.tag ? (
                    <span className="px-2 py-1 bg-secondary/10 text-secondary rounded text-xs font-medium">
                      {event.tag}
                    </span>
                  ) : (
                    "—"
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="font-medium">
                  {event.created_at
                    ? new Date(event.created_at).toLocaleDateString()
                    : "—"}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2">
          <Card className="p-4 sm:p-6 border-2 border-primary/20">
            <h2 className="text-lg font-semibold mb-4">Edit Event</h2>
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
                    required
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
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <Loader2 className="size-4 animate-spin mr-2" />
                  ) : null}
                  Update Event
                </Button>
                <Link href={`/admin/events/${event.id}/checkin`}>
                  <Button type="button" variant="default">
                    <Users className="size-4 mr-2" />
                    Check-In Participants
                  </Button>
                </Link>
                <Link href={`/events/${event.id}`} target="_blank">
                  <Button type="button" variant="outline">
                    View Public Page
                  </Button>
                </Link>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
