import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, Users, Lightbulb } from "lucide-react";

type EventItem = {
  id: string;
  title: string;
  description?: string | null;
  date?: string | null;
  image?: string | null;
  tag?: string | null;
};

/**
 * Server component: fetches events from the API and renders them.
 * - Uses the internal API route at /api/events
 * - Adds an Admin button that links to /admin for event management
 */
export async function Events() {
  // Fetch events from the internal API. Using a relative URL works in Next server components.
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/events`,
    {
      // Keep a short revalidate window; adjust as needed
      next: { revalidate: 60 },
    },
  ).catch(() => null);

  let events: EventItem[] = [];

  if (res && res.ok) {
    try {
      // safe-guard: ensure we get an array
      const data = await res.json();
      events = Array.isArray(data) ? data : [];
    } catch {
      events = [];
    }
  }

  return (
    <section id="events" className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-start justify-between mb-8">
          <div className="text-left">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-balance">
              Our Events
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl text-pretty">
              From intimate mixers to annual conferences, we create platforms
              for Liberian innovators to connect, learn, and showcase their
              work.
            </p>
          </div>

          <div className="ml-6">
            <Button variant="outline" asChild>
              <Link href="/admin">Admin</Link>
            </Button>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-muted-foreground mb-6">
              No upcoming events yet.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button className="bg-secondary hover:bg-secondary/90" asChild>
                <Link href="/register">Register Interest</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/#contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            {events.map((ev) => {
              const img =
                ev.image ??
                (ev.tag === "launch"
                  ? "/images/cocktails.png"
                  : "/images/devfest.png");
              const dateLabel = ev.date
                ? new Date(ev.date).toLocaleDateString()
                : "TBA";

              return (
                <Card
                  key={ev.id}
                  className="overflow-hidden border-2 hover:shadow-md transition-all"
                >
                  <div className="p-8">
                    <div className="mb-6">
                      <img
                        src={img}
                        alt={ev.title}
                        className="w-full h-auto max-w-md mx-auto"
                      />
                    </div>

                    {ev.tag ? (
                      <div className="inline-block bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm font-medium mb-4">
                        {ev.tag}
                      </div>
                    ) : null}

                    <h3 className="text-2xl font-bold mb-2">{ev.title}</h3>

                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {ev.description}
                    </p>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-start gap-3">
                        <Users className="h-5 w-5 text-secondary mt-0.5 shrink-0" />
                        <span className="text-sm">Community-focused event</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Lightbulb className="h-5 w-5 text-secondary mt-0.5 shrink-0" />
                        <span className="text-sm">
                          Local showcases and demos
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-secondary mt-0.5 shrink-0" />
                        <span className="text-sm">{dateLabel}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <Button
                        className="w-full bg-secondary hover:bg-secondary/90"
                        asChild
                      >
                        <Link href="/register">Register</Link>
                      </Button>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href={`/events/${ev.id}`}>View Details</Link>
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
  );
}
