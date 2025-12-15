'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight } from "lucide-react"
import { useState } from "react"

export function CallToAction() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    setStatus("")

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus("success")
        setEmail("")
      } else {
        setStatus("error")
      }
    } catch (error) {
      setStatus("error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-foreground text-background">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-balance">Join the Movement</h2>
        <p className="text-lg sm:text-xl mb-12 opacity-90 max-w-2xl mx-auto leading-relaxed text-pretty">
          Be part of building a thriving tech ecosystem in Liberia. Stay updated on events, opportunities, and ways to
          get involved.
        </p>
        <div className="max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-8">
            <Input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-background text-foreground flex-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
            <Button type="submit" size="lg" className="bg-primary hover:bg-primary/90" disabled={loading}>
              {loading ? "Subscribing..." : "Subscribe"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>
          {status === "success" && (
            <p className="text-sm text-green-400 mb-4">Successfully subscribed! Check your email.</p>
          )}
          {status === "error" && (
            <p className="text-sm text-red-400 mb-4">Something went wrong. Please try again.</p>
          )}
          <p className="text-sm opacity-75">Join our community of developers, innovators, and entrepreneurs.</p>
        </div>
      </div>
    </section>
  )
}