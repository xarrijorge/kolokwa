import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.AUTH_JWT_SECRET || "dev-secret"
const COOKIE_NAME = "kolo_auth"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

function cookieOptions() {
  const secure = process.env.NODE_ENV === "production"
  return {
    httpOnly: true,
    path: "/",
    sameSite: "lax" as const,
    secure,
    maxAge: COOKIE_MAX_AGE,
  }
}

/**
 * Helper: attempt to load the DB module dynamically and return helper if available.
 * The DB module may export a function `getStaffByEmail(email)` that returns a staff user
 * object { id, email, password, role }.
 */
async function tryLoadDbHelpers() {
  try {
    const mod = await import("@/lib/db/client")
    return mod
  } catch (err) {
    // DB not available or failed to import
    return null
  }
}

/**
 * POST /api/auth
 * - Body: { email, password }
 * - Authenticates and sets a JWT cookie on success.
 *
 * Behavior:
 * - If a DB helper `getStaffByEmail` is available, it will be used for lookup.
 * - Otherwise a development fallback user is allowed:
 *     admin@example.com / password
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null)
    if (!body || typeof body !== "object") {
      return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 })
    }

    const { email, password } = body as { email?: string; password?: string }
    if (!email || !password) {
      return NextResponse.json({ message: "email and password required" }, { status: 400 })
    }

    // Try to use DB-backed staff lookup if available
    const db = await tryLoadDbHelpers()

    let staff: any = null
    if (db && typeof db.getStaffByEmail === "function") {
      try {
        staff = await db.getStaffByEmail(email)
      } catch (err) {
        // If DB fails, fall back to null and let dev fallback handle it below
        staff = null
      }
    }

    // Dev fallback credentials when DB isn't available
    if (!staff) {
      if (email === "admin@example.com" && password === "password") {
        const payload = { sub: "dev-admin", email, role: "admin" }
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" })
        const res = NextResponse.json({ user: { id: payload.sub, email, role: "admin" } }, { status: 200 })
        res.cookies.set(COOKIE_NAME, token, cookieOptions() as any)
        return res
      }

      // No staff and not matching dev fallback -> unauthorized
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    // NOTE: Password hashing should be used in production. This compares plaintext for now.
    if (staff.password !== password) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    const payload = { sub: staff.id, email: staff.email, role: staff.role ?? "staff" }
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" })
    const res = NextResponse.json({ user: { id: staff.id, email: staff.email, role: staff.role ?? "staff" } }, { status: 200 })
    res.cookies.set(COOKIE_NAME, token, cookieOptions() as any)
    return res
  } catch (err: any) {
    return NextResponse.json({ message: "Server error", error: String(err) }, { status: 500 })
  }
}

/**
 * GET /api/auth
 * - Returns the currently authenticated user (based on cookie) or { user: null }.
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value
    if (!token) return NextResponse.json({ user: null }, { status: 200 })

    try {
      const payload = jwt.verify(token, JWT_SECRET) as any
      // Return minimal safe user object
      const user = {
        id: payload.sub ?? null,
        email: payload.email ?? null,
        role: payload.role ?? null,
      }
      return NextResponse.json({ user }, { status: 200 })
    } catch {
      // Invalid/expired token -> treat as not authenticated
      return NextResponse.json({ user: null }, { status: 200 })
    }
  } catch (err: any) {
    return NextResponse.json({ message: "Server error", error: String(err) }, { status: 500 })
  }
}

/**
 * DELETE /api/auth
 * - Logs out by clearing the auth cookie.
 */
export async function DELETE() {
  const res = NextResponse.json({ ok: true }, { status: 200 })
  // Clear cookie by setting maxAge 0
  res.cookies.set(COOKIE_NAME, "", { ...cookieOptions(), maxAge: 0 } as any)
  return res
}
