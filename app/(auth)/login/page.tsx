import { Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getStaffByEmail, verifyPassword } from "@/lib/db/client";
import jwt from "jsonwebtoken";

export const metadata: Metadata = {
  title: "Login - Kolokwa",
  description: "Sign in to access the Kolokwa admin dashboard",
};

const JWT_SECRET = process.env.AUTH_JWT_SECRET || "dev-secret";
const COOKIE_NAME = "kolo_auth";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

async function login(formData: FormData) {
  "use server";

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    redirect(
      `/login?error=${encodeURIComponent("Email and password are required")}`,
    );
  }

  // Attempt to find staff user by email
  let staff: any = null;
  try {
    staff = await getStaffByEmail(email);
  } catch (err) {
    // If DB fails, check dev fallback credentials
    if (email === "admin@example.com" && password === "password") {
      const payload = { sub: "dev-admin", email, role: "admin" };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

      const cookieStore = await cookies();
      cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: COOKIE_MAX_AGE,
      });

      redirect("/admin");
    }
    redirect(
      `/login?error=${encodeURIComponent("Database error. Please try again.")}`,
    );
  }

  // Check if staff user exists
  if (!staff) {
    // Dev fallback when no user found in DB
    if (email === "admin@example.com" && password === "password") {
      const payload = { sub: "dev-admin", email, role: "admin" };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

      const cookieStore = await cookies();
      cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: COOKIE_MAX_AGE,
      });

      redirect("/admin");
    }
    redirect(`/login?error=${encodeURIComponent("Invalid credentials")}`);
  }

  // Verify password using bcrypt
  const isPasswordValid = await verifyPassword(
    password,
    staff.password as string,
  );
  if (!isPasswordValid) {
    redirect(`/login?error=${encodeURIComponent("Invalid credentials")}`);
  }

  // Create JWT token
  const payload = {
    sub: staff.id,
    email: staff.email,
    role: staff.role ?? "staff",
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

  // Set auth cookie
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: COOKIE_MAX_AGE,
  });

  // On success, redirect to admin dashboard
  redirect("/admin");
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const error = params.error;

  return (
    <main className="min-h-screen flex items-center justify-center py-24 px-4">
      <Card className="p-8 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img
            src="/images/kolokwa.png"
            alt="Kolokwa Logo"
            className="w-24 h-24 object-contain"
          />
        </div>
        <h1 className="text-2xl font-bold mb-2">Sign in</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Sign in with your staff credentials.
        </p>

        <form action={login} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              className="w-full rounded-md border px-3 py-2"
              required
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              className="w-full rounded-md border px-3 py-2"
              required
              autoComplete="current-password"
            />
          </div>

          <div className="flex items-center justify-between">
            <Button type="submit">Sign in</Button>

            <a
              href="/login?email=admin@example.com&password=password"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              Use dev creds
            </a>
          </div>

          {error ? (
            <div className="text-sm text-destructive">{error}</div>
          ) : null}
        </form>
      </Card>
    </main>
  );
}
