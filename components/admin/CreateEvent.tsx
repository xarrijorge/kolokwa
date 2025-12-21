"use client";

import React, { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Loader2, Plus, X } from "lucide-react";

type Speaker = {
  image: string;
  name: string;
  position: string;
  bio: string;
};

type Sponsor = {
  name: string;
  type: string;
};

export default function CreateEvent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState("");
  const [tag, setTag] = useState("");
  const [numParticipants, setNumParticipants] = useState("");
  const [venue, setVenue] = useState("");
  const [eventType, setEventType] = useState("Free");
  const [cost, setCost] = useState("");
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);

  // Temp state for adding speakers/sponsors
  const [newSpeaker, setNewSpeaker] = useState<Speaker>({
    image: "",
    name: "",
    position: "",
    bio: "",
  });
  const [newSponsor, setNewSponsor] = useState<Sponsor>({ name: "", type: "" });

  function addSpeaker() {
    if (newSpeaker.name.trim()) {
      setSpeakers([...speakers, newSpeaker]);
      setNewSpeaker({ image: "", name: "", position: "", bio: "" });
    }
  }

  function removeSpeaker(index: number) {
    setSpeakers(speakers.filter((_, i) => i !== index));
  }

  function addSponsor() {
    if (newSponsor.name.trim()) {
      setSponsors([...sponsors, newSponsor]);
      setNewSponsor({ name: "", type: "" });
    }
  }

  function removeSponsor(index: number) {
    setSponsors(sponsors.filter((_, i) => i !== index));
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
      numParticipants: numParticipants ? parseInt(numParticipants) : undefined,
      venue: venue.trim() || undefined,
      eventType,
      cost: eventType === "Paid" ? cost : undefined,
      speakers: speakers.length > 0 ? speakers : undefined,
      sponsors: sponsors.length > 0 ? sponsors : undefined,
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

      const created = await res.json();
      setSuccess("Event created successfully");
      // Redirect to events list after success
      setTimeout(() => router.push("/admin/events"), 1500);
    } catch (err: any) {
      setError(String(err?.message ?? err));
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-2xl font-bold">Create New Event</h1>
          <p className="text-sm text-muted-foreground">
            Add a new event to display on the site
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

      {/* Create Form */}
      <Card className="p-4 sm:p-6 border-2 border-primary/20">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Event title"
                className="mt-2"
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
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="date">Date & Time</Label>
              <Input
                id="date"
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-2"
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
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="numParticipants">Number of Participants</Label>
              <Input
                id="numParticipants"
                type="number"
                value={numParticipants}
                onChange={(e) => setNumParticipants(e.target.value)}
                placeholder="Expected participants"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="venue">Venue</Label>
              <Input
                id="venue"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="Event location"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="eventType">Event Type</Label>
              <Select value={eventType} onValueChange={setEventType}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Free">Free</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {eventType === "Paid" && (
              <div>
                <Label htmlFor="cost">Cost</Label>
                <Input
                  id="cost"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  placeholder="e.g. $50"
                  className="mt-2"
                />
              </div>
            )}

            <div className="md:col-span-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="/images/event.png or https://..."
                className="mt-2"
              />
              {image && (
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground mb-1">Preview:</p>
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

          {/* Speakers Section */}
          <div>
            <Label>Speakers</Label>
            <div className="space-y-4 mt-2">
              {speakers.map((speaker, index) => (
                <Card key={index} className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                      <Input
                        placeholder="Speaker Image URL"
                        value={speaker.image}
                        onChange={(e) => {
                          const updated = [...speakers];
                          updated[index].image = e.target.value;
                          setSpeakers(updated);
                        }}
                      />
                      <Input
                        placeholder="Name"
                        value={speaker.name}
                        onChange={(e) => {
                          const updated = [...speakers];
                          updated[index].name = e.target.value;
                          setSpeakers(updated);
                        }}
                      />
                      <Input
                        placeholder="Position"
                        value={speaker.position}
                        onChange={(e) => {
                          const updated = [...speakers];
                          updated[index].position = e.target.value;
                          setSpeakers(updated);
                        }}
                      />
                      <Textarea
                        placeholder="Bio"
                        value={speaker.bio}
                        onChange={(e) => {
                          const updated = [...speakers];
                          updated[index].bio = e.target.value;
                          setSpeakers(updated);
                        }}
                        rows={2}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSpeaker(index)}
                      className="ml-2"
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                </Card>
              ))}
              <Card className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Speaker Image URL"
                    value={newSpeaker.image}
                    onChange={(e) =>
                      setNewSpeaker({ ...newSpeaker, image: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Name"
                    value={newSpeaker.name}
                    onChange={(e) =>
                      setNewSpeaker({ ...newSpeaker, name: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Position"
                    value={newSpeaker.position}
                    onChange={(e) =>
                      setNewSpeaker({ ...newSpeaker, position: e.target.value })
                    }
                  />
                  <Textarea
                    placeholder="Bio"
                    value={newSpeaker.bio}
                    onChange={(e) =>
                      setNewSpeaker({ ...newSpeaker, bio: e.target.value })
                    }
                    rows={2}
                  />
                </div>
                <Button type="button" onClick={addSpeaker} className="mt-4">
                  <Plus className="size-4 mr-2" />
                  Add Speaker
                </Button>
              </Card>
            </div>
          </div>

          {/* Sponsors Section */}
          <div>
            <Label>Sponsors</Label>
            <div className="space-y-4 mt-2">
              {sponsors.map((sponsor, index) => (
                <Card key={index} className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                      <Input
                        placeholder="Sponsor Name"
                        value={sponsor.name}
                        onChange={(e) => {
                          const updated = [...sponsors];
                          updated[index].name = e.target.value;
                          setSponsors(updated);
                        }}
                      />
                      <Select
                        value={sponsor.type}
                        onValueChange={(value) => {
                          const updated = [...sponsors];
                          updated[index].type = value;
                          setSponsors(updated);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Premium">Premium</SelectItem>
                          <SelectItem value="Community Partner">
                            Community Partner
                          </SelectItem>
                          <SelectItem value="Gold">Gold</SelectItem>
                          <SelectItem value="Silver">Silver</SelectItem>
                          <SelectItem value="Bronze">Bronze</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSponsor(index)}
                      className="ml-2"
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                </Card>
              ))}
              <Card className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Sponsor Name"
                    value={newSponsor.name}
                    onChange={(e) =>
                      setNewSponsor({ ...newSponsor, name: e.target.value })
                    }
                  />
                  <Select
                    value={newSponsor.type}
                    onValueChange={(value) =>
                      setNewSponsor({ ...newSponsor, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Premium">Premium</SelectItem>
                      <SelectItem value="Community Partner">
                        Community Partner
                      </SelectItem>
                      <SelectItem value="Gold">Gold</SelectItem>
                      <SelectItem value="Silver">Silver</SelectItem>
                      <SelectItem value="Bronze">Bronze</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="button" onClick={addSponsor} className="mt-4">
                  <Plus className="size-4 mr-2" />
                  Add Sponsor
                </Button>
              </Card>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="size-4 animate-spin mr-2" />
              ) : null}
              Create Event
            </Button>
            <Link href="/admin/events">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
