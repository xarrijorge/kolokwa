import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * NOTE: we intentionally avoid importing the DB client at module import time.
 * If Turso environment variables are missing the client initialization can throw
 * during import which causes the entire route to 500 before handlers run.
 *
 * Instead, we dynamically import the DB helper inside handlers when needed.
 */

/**
 * Fallback sample data used when the database is not configured or when a read
 * fails. This allows the frontend to remain functional.
 */
const sampleEvents = [
  {
    id: "sample-1",
    title: "Welcome: KoloKwa Launch",
    description:
      "Celebrating the launch of KoloKwa — building community and a tech ecosystem together.",
    date: new Date().toISOString(),
    image: "/images/cocktails.png",
    tag: "launch",
    created_at: new Date().toISOString(),
  },
];

const hasDb =
  Boolean(process.env.TURSO_DB_URL) && Boolean(process.env.TURSO_DB_TOKEN);

/**
 * Helper: try to dynamically import the DB module.
 * Returns the imported module or throws the original error.
 */
async function loadDbModule() {
  const mod = await import("@/lib/db/client");
  return mod;
}

/**
 * GET /api/events
 * - If `id` query parameter is provided, returns single event
 * - Otherwise returns all events
 *
 * Behavior:
 * - When DB env vars are missing, returns `sampleEvents` (200) so the frontend stays usable.
 * - When DB exists but a runtime read fails, returns a response containing a helpful message and fallback.
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    // If no DB configured, return fallback data
    if (!hasDb) {
      if (id) {
        const ev = sampleEvents.find((e) => e.id === id);
        if (!ev)
          return NextResponse.json(
            { message: "Event not found" },
            { status: 404 },
          );
        return NextResponse.json(ev, { status: 200 });
      }
      return NextResponse.json(sampleEvents, { status: 200 });
    }

    // DB is configured — dynamically import the module and run queries.
    let dbModule;
    try {
      dbModule = await loadDbModule();
    } catch (err: any) {
      // If import fails, return fallback data so the frontend can still render.
      return NextResponse.json(
        {
          message: "Failed to load database helper; returning fallback data",
          error: String(err),
          fallback: sampleEvents,
        },
        { status: 200 },
      );
    }

    if (id) {
      try {
        const event = await dbModule.getEventById(id);
        if (!event)
          return NextResponse.json(
            { message: "Event not found" },
            { status: 404 },
          );
        return NextResponse.json(event, { status: 200 });
      } catch (err: any) {
        return NextResponse.json(
          {
            message: "Error querying the database; returning fallback data",
            error: String(err),
            fallback: sampleEvents,
          },
          { status: 200 },
        );
      }
    }

    try {
      const events = await dbModule.getEvents();
      return NextResponse.json(events ?? [], { status: 200 });
    } catch (err: any) {
      return NextResponse.json(
        {
          message: "Error querying the database; returning fallback data",
          error: String(err),
          fallback: sampleEvents,
        },
        { status: 200 },
      );
    }
  } catch (err: any) {
    // On unexpected errors while handling GET, return fallback sampleEvents so
    // the frontend remains usable instead of producing a 500.
    return NextResponse.json(
      {
        message: "Server error; returning fallback data",
        error: String(err),
        fallback: sampleEvents,
      },
      { status: 200 },
    );
  }
}

/**
 * POST /api/events
 * Body: { title, description?, date?, image?, tag? }
 * Creates an event and returns it (201)
 *
 * When DB env vars are missing or DB import fails, writes are not permitted and return 503 with guidance.
 */
export async function POST(request: NextRequest) {
  if (!hasDb) {
    return NextResponse.json(
      {
        message:
          "Database not configured. To enable creating events, set TURSO_DB_URL and TURSO_DB_TOKEN in your environment.",
      },
      { status: 503 },
    );
  }

  // try to import DB helper
  let dbModule;
  try {
    dbModule = await loadDbModule();
  } catch (err: any) {
    return NextResponse.json(
      {
        message:
          "Failed to load database helper. Ensure TURSO_DB_URL and TURSO_DB_TOKEN are set and valid.",
        error: String(err),
      },
      { status: 503 },
    );
  }

  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { message: "Invalid JSON body" },
        { status: 400 },
      );
    }

    const {
      title,
      description,
      date,
      image,
      tag,
      numParticipants,
      venue,
      eventType,
      cost,
      speakers,
      sponsors,
    } = body as Record<string, any>;

    if (!title || typeof title !== "string" || title.trim() === "") {
      return NextResponse.json(
        { message: "Field `title` is required" },
        { status: 400 },
      );
    }

    const created = await dbModule.createEvent({
      title: title.trim(),
      description: description ? String(description) : undefined,
      date: date ? String(date) : undefined,
      image: image ? String(image) : undefined,
      tag: tag ? String(tag) : undefined,
      numParticipants:
        numParticipants !== undefined ? Number(numParticipants) : undefined,
      venue: venue ? String(venue) : undefined,
      eventType: eventType ? String(eventType) : undefined,
      cost: cost !== undefined ? Number(cost) : undefined,
      speakers: speakers ? speakers : undefined,
      sponsors: sponsors ? sponsors : undefined,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { message: "Server error", error: String(err) },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/events
 * Body: { id, title?, description?, date?, image?, tag? }
 * Updates an event and returns the updated row
 */
export async function PUT(request: NextRequest) {
  if (!hasDb) {
    return NextResponse.json(
      {
        message:
          "Database not configured. To enable updating events, set TURSO_DB_URL and TURSO_DB_TOKEN in your environment.",
      },
      { status: 503 },
    );
  }

  // try to import DB helper
  let dbModule;
  try {
    dbModule = await loadDbModule();
  } catch (err: any) {
    return NextResponse.json(
      {
        message:
          "Failed to load database helper. Ensure TURSO_DB_URL and TURSO_DB_TOKEN are set and valid.",
        error: String(err),
      },
      { status: 503 },
    );
  }

  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { message: "Invalid JSON body" },
        { status: 400 },
      );
    }

    const {
      id,
      title,
      description,
      date,
      image,
      tag,
      numParticipants,
      venue,
      eventType,
      cost,
      speakers,
      sponsors,
    } = body as Record<string, any>;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { message: "Field `id` is required" },
        { status: 400 },
      );
    }

    const existing = await dbModule.getEventById(id);
    if (!existing) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    const updated = await dbModule.updateEvent({
      id,
      title: title !== undefined ? String(title) : undefined,
      description: description !== undefined ? String(description) : undefined,
      date: date !== undefined ? String(date) : undefined,
      image: image !== undefined ? String(image) : undefined,
      tag: tag !== undefined ? String(tag) : undefined,
      numParticipants:
        numParticipants !== undefined ? Number(numParticipants) : undefined,
      venue: venue !== undefined ? String(venue) : undefined,
      eventType: eventType !== undefined ? String(eventType) : undefined,
      cost: cost !== undefined ? Number(cost) : undefined,
      speakers: speakers !== undefined ? speakers : undefined,
      sponsors: sponsors !== undefined ? sponsors : undefined,
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { message: "Server error", error: String(err) },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/events
 * - Accepts `id` as a query parameter or in JSON body { id }
 */
export async function DELETE(request: NextRequest) {
  if (!hasDb) {
    return NextResponse.json(
      {
        message:
          "Database not configured. To enable deleting events, set TURSO_DB_URL and TURSO_DB_TOKEN in your environment.",
      },
      { status: 503 },
    );
  }

  // try to import DB helper
  let dbModule;
  try {
    dbModule = await loadDbModule();
  } catch (err: any) {
    return NextResponse.json(
      {
        message:
          "Failed to load database helper. Ensure TURSO_DB_URL and TURSO_DB_TOKEN are set and valid.",
        error: String(err),
      },
      { status: 503 },
    );
  }

  try {
    const url = new URL(request.url);
    let id = url.searchParams.get("id");

    if (!id) {
      // try body
      const body = await request.json().catch(() => null);
      if (
        body &&
        typeof body === "object" &&
        typeof (body as any).id === "string"
      ) {
        id = (body as any).id;
      }
    }

    if (!id) {
      return NextResponse.json(
        { message: "Field `id` is required" },
        { status: 400 },
      );
    }

    const existing = await dbModule.getEventById(id);
    if (!existing) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    const ok = await dbModule.deleteEvent(id);
    if (!ok) {
      return NextResponse.json(
        { message: "Failed to delete event" },
        { status: 500 },
      );
    }

    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { message: "Server error", error: String(err) },
      { status: 500 },
    );
  }
}
