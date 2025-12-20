"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Calendar,
  Users,
  Briefcase,
  Settings,
  LogOut,
  FilePlus,
} from "lucide-react"

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

type User = { id?: string | null; email?: string | null; role?: string | null } | null

function NavItem({
  href,
  label,
  Icon,
  active,
}: {
  href: string
  label: string
  Icon: React.ComponentType<any>
  active?: boolean
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm ${
        active ? "bg-accent/10 text-accent font-medium" : "hover:bg-muted/60 text-muted-foreground"
      }`}
    >
      <Icon className="size-4" />
      <span>{label}</span>
    </Link>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/admin"
  const [user, setUser] = useState<User>(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    let mounted = true
    setLoadingUser(true)
    fetch("/api/auth")
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return
        setUser(data?.user ?? null)
      })
      .catch(() => {
        if (!mounted) return
        setUser(null)
      })
      .finally(() => {
        if (!mounted) return
        setLoadingUser(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  async function handleLogout() {
    try {
      await fetch("/api/auth", { method: "DELETE" })
      // reload to clear auth state and redirect to login or homepage
      window.location.href = "/admin"
    } catch (err) {
      // best-effort: still reload
      window.location.reload()
    }
  }

  const nav = [
    { href: "/admin", label: "Dashboard", Icon: Home },
    { href: "/admin/events", label: "Events", Icon: Calendar },
    { href: "/admin/partners", label: "Partners", Icon: Briefcase },
    { href: "/admin/staff", label: "Staff", Icon: Users },
    { href: "/admin/settings", label: "Settings", Icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar for small screens */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-muted/10 md:hidden">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen((s) => !s)}
              aria-label="Toggle menu"
              className="p-2 rounded-md hover:bg-muted/10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link href="/admin" className="text-lg font-bold">
              KoloKwa Admin
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {loadingUser ? (
              <div className="text-sm text-muted-foreground">Checking...</div>
            ) : user ? (
              <div className="text-sm">{user.email ?? "Staff"}</div>
            ) : (
              <Link href="/admin" className="text-sm text-muted-foreground">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="md:flex md:gap-6">
          {/* Sidebar */}
          <aside
            className={`hidden md:block w-64 shrink-0 py-8 border-r border-muted/10`}
            aria-label="Admin sidebar"
          >
            <div className="px-4">
              <Link href="/admin" className="flex items-center gap-3 mb-6">
                <div className="rounded-sm p-2 bg-accent/10">
                  <Home className="size-5 text-accent" />
                </div>
                <div>
                  <div className="text-lg font-bold">KoloKwa Admin</div>
                  <div className="text-xs text-muted-foreground">Manage site</div>
                </div>
              </Link>

              <nav className="flex flex-col gap-2 mt-4">
                {nav.map((n) => (
                  <NavItem
                    key={n.href}
                    href={n.href}
                    label={n.label}
                    Icon={n.Icon}
                    active={pathname === n.href || pathname?.startsWith(n.href + "/")}
                  />
                ))}
              </nav>

              <div className="mt-8 border-t border-muted/10 pt-4">
                {loadingUser ? (
                  <div className="text-sm text-muted-foreground">Checking auth…</div>
                ) : user ? (
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium">{user.email}</div>
                      <div className="text-xs text-muted-foreground">{user.role}</div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted/10 text-sm"
                    >
                      <LogOut className="size-4" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Link href="/admin" className="text-sm px-3 py-2 rounded-md hover:bg-muted/10">
                      Sign in
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Mobile drawer */}
          {mobileOpen && (
            <div className="md:hidden absolute inset-x-0 top-16 bg-background z-50 border-b border-muted/10">
              <div className="px-4 py-4">
                <nav className="flex flex-col gap-2">
                  {nav.map((n) => (
                    <Link
                      key={n.href}
                      href={n.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md ${
                        pathname === n.href ? "bg-accent/10 text-accent" : "hover:bg-muted/10"
                      }`}
                    >
                      <n.Icon className="size-4" />
                      <span>{n.label}</span>
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          )}

          {/* Main content */}
          <main className="flex-1 min-w-0 py-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold">
                  {pathname === "/admin"
                    ? "Dashboard"
                    : pathname?.split("/").slice(2).join(" ").replace(/-/g, " ") || "Admin"}
                </h1>
                <p className="text-sm text-muted-foreground">Manage the site content and users</p>
              </div>

              <div className="flex items-center gap-3">
                <Link href="/admin/partners" className="inline-flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted/10">
                  <FilePlus className="size-4" />
                  New Partner
                </Link>
                <button
                  onClick={() => {
                    // quick sign out
                    handleLogout()
                  }}
                  className="px-3 py-2 rounded-md hover:bg-muted/10"
                >
                  Sign out
                </button>
              </div>
            </div>

            <div className="bg-card rounded-md shadow-sm p-6">{children}</div>
          </main>
        </div>
      </div>
    </div>
  )
}
