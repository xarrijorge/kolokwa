import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

/**
 * Staff API
 * - GET  /api/staff         -> list staff (public read; returns fallback when DB missing)
 * - POST /api/staff         -> create staff (admin only)
 * - DELETE /api/staff?id=.. -> delete staff (admin only)
 *
 * Authentication:
 * - Expects a JWT cookie named `kolo_auth` signed with AUTH_JWT_SECRET (or default dev secret).
 * - Only users with role `admin` are allowed to create or delete staff.
 *
 * The API dynamically imports the DB helpers in `@/lib/db/client` at runtime to avoid
 * throwing at module import time when DB env vars are not present.
 */

const COOKIE_NAME = "kolo_auth";
const JWT_SECRET = process.env.AUTH_JWT_SECRET || "dev-secret";

/**
 * Read and verify JWT from request cookies. Returns payload or null.
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
 * Safe dynamic import of DB helpers module.
 * Returns the imported module object or null if import fails.
 */
async function loadDbSafe() {
  try {
    const mod = await import("@/lib/db/client");
    return mod;
  } catch (err) {
    return null;
  }
}

/**
 * GET /api/staff
 * - Returns list of staff users.
 * - If DB unavailable, returns a small fallback (development) list so the UI can render.
 */
export async function GET() {
  const sample = [
    {
      id: "dev-admin",
      email: "admin@example.com",
      role: "admin",
      created_at: new Date().toISOString(),
    },
  ];

  try {
    const db = await loadDbSafe();
    if (!db || typeof db.listStaff !== "function") {
      return NextResponse.json(sample, { status: 200 });
    }

    try {
      const list = await db.listStaff();
      return NextResponse.json(list ?? [], { status: 200 });
    } catch (err: any) {
      // Non-fatal: return fallback and include minimal error info
      return NextResponse.json(
        {
          message: "Error reading staff from DB; returning fallback",
          error: String(err),
          fallback: sample,
        },
        { status: 200 }
      );
    }
  } catch (err: any) {
    return NextResponse.json({ message: "Server error", error: String(err) }, { status: 500 });
  }
}

/**
 * POST /api/staff
 * - Body: { email: string, password: string, role?: string }
 * - Requires an authenticated admin user (cookie-based JWT).
 */
export async function POST(request: NextRequest) {
  try {
    // Auth
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const role = (user as any).role ?? "staff";
    if (role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Body
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
    }

    const { email, password, role: newRole } = body as Record<string, any>;
    if (!email || typeof email !== "string") {
      return NextResponse.json({ message: "Field `email` is required" }, { status: 400 });
    }
    if (!password || typeof password !== "string") {
      return NextResponse.json({ message: "Field `password` is required" }, { status: 400 });
    }

    // DB
    const db = await loadDbSafe();
    if (!db || typeof db.createStaff !== "function") {
      return NextResponse.json({ message: "Database not configured. Cannot create staff." }, { status: 503 });
    }

    try {
      // NOTE: passwords are stored as provided by this API. In production you must hash passwords server-side.
      const created = await db.createStaff({
        email: String(email).trim(),
        password: String(password),
        role: typeof newRole === "string" ? String(newRole).trim() : "staff",
      });

      return NextResponse.json(created, { status: 201 });
    } catch (err: any) {
      return NextResponse.json({ message: "Failed to create staff", error: String(err) }, { status: 500 });
    }
  } catch (err: any) {
    return NextResponse.json({ message: "Server error", error: String(err) }, { status: 500 });
  }
}

/**
 * DELETE /api/staff?id=<id>
 * - Requires authenticated admin.
 * - Can also accept JSON body { id }.
 */
export async function DELETE(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const role = (user as any).role ?? "staff";
    if (role !== "admin") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    // Determine id
    const url = new URL(request.url);
    let id = url.searchParams.get("id");
    if (!id) {
      const body = await request.json().catch(() => null);
      if (body && typeof body === "object" && typeof (body as any).id === "string") {
        id = (body as any).id;
      }
    }
    if (!id) return NextResponse.json({ message: "Field `id` is required" }, { status: 400 });

    const db = await loadDbSafe();
    if (!db || typeof db.deleteStaff !== "function") {
      return NextResponse.json({ message: "Database not configured. Cannot delete staff." }, { status: 503 });
    }

    try {
      const ok = await db.deleteStaff(id);
      if (!ok) {
        return NextResponse.json({ message: "Failed to delete staff" }, { status: 500 });
      }
      return NextResponse.json({ message: "Deleted" }, { status: 200 });
    } catch (err: any) {
      return NextResponse.json({ message: "Failed to delete staff", error: String(err) }, { status: 500 });
    }
  } catch (err: any) {
    return NextResponse.json({ message: "Server error", error: String(err) }, { status: 500 });
  }
}
