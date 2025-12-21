import type { Metadata } from "next";
import { getEvents } from "@/lib/db/client";
import { EventsPageClient } from "@/components/events-page-client";

export const metadata: Metadata = {
  title: "Events - Kolokwa TechGuild",
  description:
    "Discover upcoming tech events, workshops, and meetups by Kolokwa TechGuild. Join our community and connect with Liberia's tech ecosystem.",
};

export default async function EventsPage() {
  const events = await getEvents();

  // Extract unique tags for filters
  const tags = Array.from(
    new Set(
      events
        .map((ev) => ev.tag as string | null)
        .filter((tag): tag is string => Boolean(tag))
    )
  );

  return (
    <EventsPageClient
      events={events.map((ev) => ({
        id: ev.id as string,
        title: ev.title as string,
        description: (ev.description as string | null) ?? null,
        date: (ev.date as string | null) ?? null,
        image: (ev.image as string | null) ?? null,
        tag: (ev.tag as string | null) ?? null,
      }))}
      tags={tags}
    />
  );
}
