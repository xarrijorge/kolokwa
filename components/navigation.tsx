"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex-shrink-0">
            <Link href="/">
              <img src="/images/kolokwa.png" alt="Kolokwa" className="h-8 sm:h-10 w-auto" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="/#about" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </a>
            <a href="/#events" className="text-sm font-medium hover:text-primary transition-colors">
              Events
            </a>
            <a href="/#mission" className="text-sm font-medium hover:text-primary transition-colors">
              Mission
            </a>
            <a href="/#team" className="text-sm font-medium hover:text-primary transition-colors">
              Team
            </a>
            <Link href="/contact">
              <Button size="sm">Join Us</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-3">
            <a
              href="/#about"
              className="block text-sm font-medium hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </a>
            <a
              href="/#events"
              className="block text-sm font-medium hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Events
            </a>
            <a
              href="/#mission"
              className="block text-sm font-medium hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Mission
            </a>
            <a
              href="/#team"
              className="block text-sm font-medium hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Team
            </a>
            <Link href="/contact">
              <Button size="sm" className="w-full">
                Join Us
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
