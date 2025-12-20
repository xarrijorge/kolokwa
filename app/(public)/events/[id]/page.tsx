import type { Metadata } from "next";
import Link from "next/link";
import { getEventById } from "@/lib/db/client";

type Props = {
  params: {
    id: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;
  const ev = await getEventById(id);

  if (!ev) {
    return {
      title: "Event Not Found - Kolokwa TechGuild",
      description: "The requested event could not be found.",
    };
  }

  return {
    title: `${ev.title} - Kolokwa TechGuild`,
    description:
      ev.description ||
      "Join this event by Kolokwa TechGuild to build Liberia's tech ecosystem.",
  };
}

export default async function EventPage({ params }: Props) {
  const id = params.id;
  const ev = await getEventById(id);

  if (!ev) {
    return (
      <main className="container mx-auto py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Event not found</h1>
          <p className="text-muted-foreground mb-6">
            We couldn't find the event you're looking for.
          </p>
          <Link
            href="/"
            className="inline-block rounded-md bg-accent px-4 py-2 text-white hover:opacity-90"
          >
            Back home
          </Link>
        </div>
      </main>
    );
  }

  const dateLabel = ev.date ? new Date(ev.date).toLocaleString() : "TBA";

  return (
    <main className="container mx-auto py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{ev.title}</h1>

        {ev.image ? (
          // Using a simple img tag to avoid runtime config for next/image external domains.
          <img
            src={ev.image}
            alt={ev.title}
            className="w-full h-auto rounded-md mb-6"
          />
        ) : null}

        <div className="text-sm text-muted-foreground mb-6">{dateLabel}</div>

        <div className="prose max-w-none mb-8">
          {ev.description ? (
            <p>{ev.description}</p>
          ) : (
            <p>No description provided.</p>
          )}
        </div>

        <div className="flex gap-3">
          <Link
            href="/register"
            className="inline-block rounded-md bg-secondary px-4 py-2 text-white hover:opacity-95"
          >
            Register
          </Link>

          <Link
            href="/#events"
            className="inline-block rounded-md border px-4 py-2"
          >
            Back to events
          </Link>
        </div>
      </div>
    </main>
  );
}
