"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Search,
  X,
  Calendar,
  Users,
  Lightbulb,
  Filter,
  ArrowLeft,
} from "lucide-react";

type EventItem = {
  id: string;
  title: string;
  description: string | null;
  date: string | null;
  image: string | null;
  tag: string | null;
};

type EventsPageClientProps = {
  events: EventItem[];
  tags: string[];
};

export function EventsPageClient({ events, tags }: EventsPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<"all" | "upcoming" | "past">(
    "all",
  );

  const filteredEvents = useMemo(() => {
    let result = events;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (ev) =>
          ev.title.toLowerCase().includes(query) ||
          ev.description?.toLowerCase().includes(query) ||
          ev.tag?.toLowerCase().includes(query),
      );
    }

    // Tag filter
    if (selectedTag) {
      result = result.filter((ev) => ev.tag === selectedTag);
    }

    // Date filter
    const now = new Date();
    if (dateFilter === "upcoming") {
      result = result.filter((ev) => {
        if (!ev.date) return true; // TBA events are considered upcoming
        return new Date(ev.date) >= now;
      });
    } else if (dateFilter === "past") {
      result = result.filter((ev) => {
        if (!ev.date) return false;
        return new Date(ev.date) < now;
      });
    }

    return result;
  }, [events, searchQuery, selectedTag, dateFilter]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTag(null);
    setDateFilter("all");
  };

  const hasActiveFilters = searchQuery || selectedTag || dateFilter !== "all";

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-muted/50 to-background">
        <div className="container mx-auto">
          <Link href="/">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Upcoming Events
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">
            Discover tech events, workshops, and meetups. Join our community and
            connect with Liberia's growing tech ecosystem.
          </p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 border-b bg-background sticky top-0 z-10">
        <div className="container mx-auto">
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="relative flex-1 gap-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
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

            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Filter className="size-4" />
                <span className="hidden sm:inline">Filters:</span>
              </div>

              {/* Date Filter */}
              <div className="flex rounded-lg border overflow-hidden">
                <button
                  onClick={() => setDateFilter("all")}
                  className={`px-3 py-1.5 text-sm transition-colors ${
                    dateFilter === "all"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setDateFilter("upcoming")}
                  className={`px-3 py-1.5 text-sm transition-colors border-l ${
                    dateFilter === "upcoming"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  Upcoming
                </button>
                <button
                  onClick={() => setDateFilter("past")}
                  className={`px-3 py-1.5 text-sm transition-colors border-l ${
                    dateFilter === "past"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  Past
                </button>
              </div>

              {/* Tag Filters */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() =>
                        setSelectedTag(selectedTag === tag ? null : tag)
                      }
                      className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                        selectedTag === tag
                          ? "bg-secondary text-white"
                          : "bg-secondary/10 text-secondary hover:bg-secondary/20"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-muted-foreground"
                >
                  <X className="size-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          {/* Results Count */}
          <div className="mb-6 text-sm text-muted-foreground">
            {filteredEvents.length === events.length
              ? `Showing all ${events.length} events`
              : `Showing ${filteredEvents.length} of ${events.length} events`}
          </div>

          {filteredEvents.length === 0 ? (
            <div className="text-center py-16">
              <Calendar className="size-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No events found</h3>
              <p className="text-muted-foreground mb-6">
                {hasActiveFilters
                  ? "Try adjusting your filters or search terms"
                  : "Check back soon for upcoming events"}
              </p>
              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
              {filteredEvents.map((ev) => {
                const img =
                  ev.image ??
                  (ev.tag === "launch"
                    ? "/images/cocktails.png"
                    : "/images/devfest.png");
                const dateLabel = ev.date
                  ? new Date(ev.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Date TBA";
                const isPast = ev.date && new Date(ev.date) < new Date();

                return (
                  <Card
                    key={ev.id}
                    className={`overflow-hidden border hover:shadow-md transition-all ${
                      isPast ? "opacity-75" : ""
                    }`}
                  >
                    <div className="aspect-video relative overflow-hidden bg-white">
                      <img
                        src={img}
                        alt={ev.title}
                        className="w-full h-full object-cover"
                      />
                      {isPast && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <span className="bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                            Past Event
                          </span>
                        </div>
                      )}
                      {ev.tag && !isPast && (
                        <div className="absolute top-3 left-3">
                          <span className="bg-secondary text-white px-2 py-1 rounded text-xs font-medium">
                            {ev.tag}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-4 sm:p-5">
                      <h3 className="text-lg font-semibold mb-2 line-clamp-1">
                        {ev.title}
                      </h3>

                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {ev.description ?? "Join us for this exciting event!"}
                      </p>

                      <div className="space-y-2 mb-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="size-4 shrink-0" />
                          <span>{dateLabel}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="size-4 shrink-0" />
                          <span>Community event</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          className="flex-1 bg-secondary hover:bg-secondary/90"
                          asChild
                          disabled={isPast}
                        >
                          <Link href={`/events/${ev.id}`}>
                            {isPast ? "View Details" : "Register"}
                          </Link>
                        </Button>
                        <Button variant="outline" asChild>
                          <Link href={`/events/${ev.id}`}>Details</Link>
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-4xl text-center">
          <Lightbulb className="size-10 mx-auto text-secondary mb-4" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Want to host an event?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Partner with KoloKwa TechGuild to organize tech events, workshops,
            or meetups. Let's build Liberia's tech ecosystem together.
          </p>
          <Button size="lg" asChild>
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
