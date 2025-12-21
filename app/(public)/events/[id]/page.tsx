import type { Metadata } from "next";
import { getEventById } from "@/lib/db/client";
import { RegisterClient } from "@/components/register-client";
import Link from "next/link";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
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
  const { id } = await params;
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

  return (
    <RegisterClient
      event={{
        id: ev.id as string,
        title: ev.title as string,
        description: ev.description as string | null,
        date: ev.date as string | null,
      }}
    />
  );
}
