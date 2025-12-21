import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, Users, Lightbulb } from "lucide-react";
import { getEvents } from "@/lib/db/client";

/**
 * Server component: fetches events directly from the database.
 */
export async function Events() {
  const events = await getEvents();

  return (
    <section
      id="events"
      className="py-16 sm:py-20 lg:py-32 px-4 sm:px-6 lg:px-8"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-3 sm:mb-4 text-balance">
            Our Events
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl text-pretty">
            From intimate mixers to annual conferences, we create platforms for
            Liberian innovators to connect, learn, and showcase their work.
          </p>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12 sm:py-20">
            <p className="text-base sm:text-lg text-muted-foreground mb-6">
              No upcoming events yet.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Button
                className="w-full sm:w-auto bg-secondary hover:bg-secondary/90"
                asChild
              >
                <Link href="/register">Register Interest</Link>
              </Button>
              <Button variant="outline" className="w-full sm:w-auto" asChild>
                <Link href="/#contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {events.map((ev) => {
              const img =
                (ev.image as string | null) ??
                ((ev.tag as string | null) === "launch"
                  ? "/images/cocktails.png"
                  : "/images/devfest.png");
              const dateLabel = ev.date
                ? new Date(ev.date as string).toLocaleDateString()
                : "TBA";

              return (
                <Card
                  key={ev.id as string}
                  className="overflow-hidden border-2 hover:shadow-md transition-all"
                >
                  <div className="p-4 sm:p-6 lg:p-8">
                    <div className="mb-4 sm:mb-6">
                      <img
                        src={img}
                        alt={ev.title as string}
                        className="w-full h-auto max-w-xs sm:max-w-sm md:max-w-md mx-auto rounded-md"
                      />
                    </div>

                    {ev.tag ? (
                      <div className="inline-block bg-secondary/10 text-secondary px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
                        {ev.tag as string}
                      </div>
                    ) : null}

                    <h3 className="text-xl sm:text-2xl font-bold mb-2">
                      {ev.title as string}
                    </h3>

                    <p className="text-sm sm:text-base text-muted-foreground mb-4 leading-relaxed line-clamp-3">
                      {ev.description as string}
                    </p>

                    <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                      <div className="flex items-start gap-2 sm:gap-3">
                        <Users className="h-4 w-4 sm:h-5 sm:w-5 text-secondary mt-0.5 shrink-0" />
                        <span className="text-xs sm:text-sm">
                          Community-focused event
                        </span>
                      </div>
                      <div className="flex items-start gap-2 sm:gap-3">
                        <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5 text-secondary mt-0.5 shrink-0" />
                        <span className="text-xs sm:text-sm">
                          Local showcases and demos
                        </span>
                      </div>
                      <div className="flex items-start gap-2 sm:gap-3">
                        <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-secondary mt-0.5 shrink-0" />
                        <span className="text-xs sm:text-sm">{dateLabel}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:gap-3">
                      <Button
                        className="w-full bg-secondary hover:bg-secondary/90 text-sm sm:text-base"
                        asChild
                      >
                        <Link href={`/events/${ev.id}`}>Register</Link>
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full text-sm sm:text-base"
                        asChild
                      >
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
