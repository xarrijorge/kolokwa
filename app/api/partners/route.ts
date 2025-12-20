import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const COOKIE_NAME = "kolo_auth";
const JWT_SECRET = process.env.AUTH_JWT_SECRET || "dev-secret";

/**
 * Sample fallback partners returned when DB isn't configured or fails.
 * Keeps the frontend usable in development when the DB isn't set up.
 */
const samplePartners = [
  {
    id: "sample-partner-1",
    name: "Liberia Tech Collective",
    website: "https://liberiatech.example",
    logo: "/images/partner-1.png",
    created_at: new Date().toISOString(),
  },
];

/**
 * Read and verify JWT from request cookies. Returns a payload or null.
 */
function getUserFromRequest(request: NextRequest) {
  try {
    const cookie = request.cookies.get(COOKIE_NAME)?.value;
    if (!cookie) return null;
    const payload = jwt.verify(cookie, JWT_SECRET);
    return payload as any;
  } catch {
    return null;
  }
}

/**
 * Helper to dynamically import DB helpers. We do this at runtime to avoid
 * throwing at module load when env vars are missing.
 */
async function loadDbModuleSafe() {
  try {
    const mod = await import("@/lib/db/client");
    return mod;
  } catch (err) {
    return null;
  }
}

/**
 * GET /api/partners
 * - Returns a list of partners.
 * - When DB is not configured or fails to load, returns samplePartners.
 */
export async function GET(request: NextRequest) {
  try {
    const db = await loadDbModuleSafe();
    if (!db || typeof db.listPartners !== "function") {
      return NextResponse.json(samplePartners, { status: 200 });
    }

    try {
      const partners = await db.listPartners();
      return NextResponse.json(partners ?? [], { status: 200 });
    } catch (err: any) {
      // Return fallback with error info (non-fatal for frontend)
      return NextResponse.json(
        {
          message: "Error reading partners from DB; returning fallback data",
          error: String(err),
          fallback: samplePartners,
        },
        { status: 200 },
      );
    }
  } catch (err: any) {
    return NextResponse.json(
      { message: "Server error", error: String(err) },
      { status: 500 },
    );
  }
}

/**
 * POST /api/partners
 * - Requires authentication (JWT cookie). Only staff/admin may create partners.
 * - Body: { name: string, website?: string, logo?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Basic role guard: allow staff or admin
    const role = (user as any).role ?? "staff";
    if (!(role === "admin" || role === "staff")) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
    }

    const { name, website, logo } = body as Record<string, any>;
    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json({ message: "Field `name` is required" }, { status: 400 });
    }

    const db = await loadDbModuleSafe();
    if (!db || typeof db.createPartner !== "function") {
      return NextResponse.json(
        { message: "Database not configured. Cannot create partner." },
        { status: 503 },
      );
    }

    try {
      const created = await db.createPartner({
        name: String(name).trim(),
        website: website ? String(website) : undefined,
        logo: logo ? String(logo) : undefined,
      });
      return NextResponse.json(created, { status: 201 });
    } catch (err: any) {
      return NextResponse.json({ message: "Failed to create partner", error: String(err) }, { status: 500 });
    }
  } catch (err: any) {
    return NextResponse.json({ message: "Server error", error: String(err) }, { status: 500 });
  }
}

/**
 * DELETE /api/partners
 * - Requires authentication (JWT cookie). Only staff/admin may delete partners.
 * - Accepts `id` as query parameter or JSON body { id }.
 */
export async function DELETE(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const role = (user as any).role ?? "staff";
    if (!(role === "admin" || role === "staff")) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const url = new URL(request.url);
    let id = url.searchParams.get("id");

    if (!id) {
      const body = await request.json().catch(() => null);
      if (body && typeof body === "object" && typeof (body as any).id === "string") {
        id = (body as any).id;
      }
    }

    if (!id) {
      return NextResponse.json({ message: "Field `id` is required" }, { status: 400 });
    }

    const db = await loadDbModuleSafe();
    if (!db || typeof db.deletePartner !== "function") {
      return NextResponse.json({ message: "Database not configured. Cannot delete partner." }, { status: 503 });
    }

    try {
      const ok = await db.deletePartner(id);
      if (!ok) {
        return NextResponse.json({ message: "Failed to delete partner" }, { status: 500 });
      }
      return NextResponse.json({ message: "Deleted" }, { status: 200 });
    } catch (err: any) {
      return NextResponse.json({ message: "Failed to delete partner", error: String(err) }, { status: 500 });
    }
  } catch (err: any) {
    return NextResponse.json({ message: "Server error", error: String(err) }, { status: 500 });
  }
}
