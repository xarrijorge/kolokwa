import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.AUTH_JWT_SECRET || "dev-secret";
const COOKIE_NAME = "kolo_auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log("🔒 Middleware running for:", pathname);

  // Protect admin routes except login
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get(COOKIE_NAME)?.value;

    console.log("Cookie name:", COOKIE_NAME);
    console.log(
      "All cookies:",
      request.cookies.getAll().map((c) => c.name),
    );
    console.log("Token found:", token ? "YES" : "NO");

    if (!token) {
      console.log("❌ No token found, redirecting to /login");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    console.log("Token preview:", token.substring(0, 20) + "...");

    try {
      // Use jose for Edge Runtime compatibility
      const secret = new TextEncoder().encode(JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      const role = payload.role as string;

      console.log("Decoded payload:", payload);

      if (!role || !["admin", "editor", "staff"].includes(role)) {
        console.log("❌ Invalid role:", role, "redirecting to /login");
        return NextResponse.redirect(new URL("/login", request.url));
      }

      console.log("✅ Auth successful for user:", payload.email, "role:", role);
    } catch (error: any) {
      // Invalid or expired token
      console.log("❌ Token verification failed:", error.message);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
