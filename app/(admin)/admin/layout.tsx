"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Calendar,
  Users,
  Briefcase,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/**
 * Admin layout with sidebar and top bar.
 *
 * Routes expected:
 * - /admin               -> dashboard / index
 * - /admin/events        -> events admin
 * - /admin/partners      -> partners form & list
 * - /admin/staff         -> staff management
 * - /admin/settings      -> settings
 *
 * This component is a client component so it can handle user state and logout.
 * It fetches /api/auth (GET) to determine the current user, and calls DELETE
 * to sign out.
 */

type User = {
  id?: string | null;
  email?: string | null;
  role?: string | null;
  name?: string | null;
  username?: string | null;
} | null;

function NavItem({
  href,
  label,
  Icon,
  active,
  collapsed,
}: {
  href: string;
  label: string;
  Icon: React.ComponentType<any>;
  active?: boolean;
  collapsed?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all text-sm ${
        active
          ? "bg-primary text-primary-foreground font-medium shadow-sm"
          : "hover:bg-accent/50"
      } ${collapsed ? "justify-center" : ""}`}
      title={collapsed ? label : undefined}
    >
      <Icon className="size-5 shrink-0" />
      {!collapsed && <span>{label}</span>}
    </Link>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() || "/admin";
  const router = useRouter();
  const [user, setUser] = useState<User>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoadingUser(true);
    fetch("/api/auth")
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        setUser(data?.user ?? null);
        const allowedRoles = ["admin", "editor", "staff"];
        const isAuthorized =
          data?.user && data.user.role && allowedRoles.includes(data.user.role);
        setAuthorized(isAuthorized);
        if (!isAuthorized && pathname !== "/login") {
          router.push("/login");
        }
      })
      .catch(() => {
        if (!mounted) return;
        setUser(null);
        setAuthorized(false);
        if (pathname !== "/login") {
          router.push("/login");
        }
      })
      .finally(() => {
        if (!mounted) return;
        setLoadingUser(false);
      });
    return () => {
      mounted = false;
    };
  }, [router]);

  async function handleLogout() {
    try {
      await fetch("/api/auth", { method: "DELETE" });
      // reload to clear auth state and redirect to login or homepage
      window.location.href = "/admin";
    } catch (err) {
      // best-effort: still reload
      window.location.reload();
    }
  }

  const nav = [
    { href: "/admin", label: "Dashboard", Icon: Home },
    { href: "/admin/events", label: "Events", Icon: Calendar },
    { href: "/admin/partners", label: "Partners", Icon: Briefcase },
    { href: "/admin/staff", label: "Staff", Icon: Users },
    { href: "/admin/settings", label: "Settings", Icon: Settings },
  ];

  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        Loading...
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        Unauthorized
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 text-foreground flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen((s) => !s)}
              aria-label="Toggle menu"
              className="p-2 rounded-md hover:bg-accent/50 transition-colors md:hidden"
            >
              {mobileOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
            <Link href="/admin" className="text-lg font-bold">
              KoloKwa Admin
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden md:flex p-2 rounded-md hover:bg-accent/50 transition-colors"
              aria-label={
                sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
              }
            >
              {sidebarCollapsed ? (
                <ChevronRight className="size-4" />
              ) : (
                <ChevronLeft className="size-4" />
              )}
            </button>
            <div className="md:hidden text-sm">
              {loadingUser ? (
                <div className="text-sm text-muted-foreground">Checking...</div>
              ) : user ? (
                <div className="text-sm">{user.email ?? "Staff"}</div>
              ) : (
                <Link href="/login" className="text-sm text-muted-foreground">
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`hidden md:flex flex-col min-h-full bg-card border-r shadow-sm transition-all duration-300 ${
            sidebarCollapsed ? "w-20" : "w-64"
          }`}
          aria-label="Admin sidebar"
        >
          <div className="flex-1 overflow-y-auto py-6 px-3">
            {/* Logo/Brand */}
            <div className={`mb-6 ${sidebarCollapsed ? "px-1" : "px-2"}`}>
              <Link
                href="/admin"
                className={`flex items-center gap-3 ${sidebarCollapsed ? "justify-center" : ""}`}
              >
                <div className="rounded-lg p-2 bg-primary/10">
                  <Home className="size-5 text-primary" />
                </div>
                {!sidebarCollapsed && (
                  <div>
                    <div className="text-lg font-bold">KoloKwa</div>
                    <div className="text-xs text-muted-foreground">
                      Admin Panel
                    </div>
                  </div>
                )}
              </Link>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-1">
              {nav.map((n) => (
                <NavItem
                  key={n.href}
                  href={n.href}
                  label={n.label}
                  Icon={n.Icon}
                  active={
                    n.href === "/admin"
                      ? pathname === "/admin"
                      : pathname === n.href ||
                        pathname?.startsWith(n.href + "/")
                  }
                  collapsed={sidebarCollapsed}
                />
              ))}
            </nav>
          </div>

          {/* User info and logout */}
          <div className="border-t p-3">
            {loadingUser ? (
              <div
                className={`text-sm text-muted-foreground ${sidebarCollapsed ? "text-center" : ""}`}
              >
                {sidebarCollapsed ? "..." : "Loading..."}
              </div>
            ) : user ? (
              <div
                className={`flex ${sidebarCollapsed ? "flex-col items-center gap-2" : "items-center justify-between"}`}
              >
                {!sidebarCollapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {user.email}
                    </div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {user.role}
                    </div>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent/50 text-sm transition-colors ${sidebarCollapsed ? "" : ""}`}
                  title={sidebarCollapsed ? "Logout" : undefined}
                >
                  <LogOut className="size-4" />
                  {!sidebarCollapsed && <span>Logout</span>}
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center justify-center px-3 py-2 rounded-md hover:bg-accent/50 text-sm"
              >
                Sign in
              </Link>
            )}
          </div>
        </aside>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div
            className="md:hidden fixed inset-0 top-[61px] bg-black/50 z-50"
            onClick={() => setMobileOpen(false)}
          >
            <div
              className="bg-card h-full w-64 shadow-xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-4 py-6">
                <nav className="flex flex-col gap-1">
                  {nav.map((n) => (
                    <Link
                      key={n.href}
                      href={n.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                        pathname === n.href
                          ? "bg-primary text-primary-foreground font-medium"
                          : "hover:bg-accent/50"
                      }`}
                    >
                      <n.Icon className="size-5" />
                      <span>{n.label}</span>
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 h-full min-w-0 overflow-x-hidden">
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
