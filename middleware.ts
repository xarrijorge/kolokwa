import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.AUTH_JWT_SECRET || "dev-secret";
const COOKIE_NAME = "kolo_auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin routes except login
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      const payload = jwt.verify(token, JWT_SECRET) as any;
      const role = payload.role;
      if (!role || !["admin", "editor", "staff"].includes(role)) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    } catch {
      // Invalid or expired token
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
