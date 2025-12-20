"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.message || "Invalid credentials")
      }

      // On success the server sets a cookie; redirect to admin dashboard
      router.push("/admin")
    } catch (err: any) {
      setError(String(err?.message ?? err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center py-24 px-4">
      <Card className="p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2">Admin sign in</h1>
        <p className="text-sm text-muted-foreground mb-6">Sign in with your staff credentials.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border px-3 py-2"
              required
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border px-3 py-2"
              required
              autoComplete="current-password"
            />
          </div>

          <div className="flex items-center justify-between">
            <Button type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setEmail("admin@example.com")
                setPassword("password")
              }}
            >
              Use dev creds
            </Button>
          </div>

          {error ? <div className="text-sm text-destructive">{error}</div> : null}
        </form>
      </Card>
    </main>
  )
}
