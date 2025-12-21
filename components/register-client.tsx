"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type EventInfo = {
  id: string;
  title: string;
  description?: string | null;
  date?: string | null;
};

type RegisterClientProps = {
  event?: EventInfo;
};

export function RegisterClient({ event }: RegisterClientProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    role: "",
    interests: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.email.trim()) {
      setError("Email is required");
      return;
    }

    if (!event) {
      setError("Event not found");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/events/${event.id}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(
          "Registration successful! Check your email for an invite link.",
        );
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <main className="min-h-screen">
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-2xl">
          <Link href="/">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>

          <div className="text-secondary font-bold text-sm mb-4 uppercase tracking-wide">
            {event?.date
              ? new Date(event.date).toLocaleDateString()
              : "Starting Soon"}
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
            {event ? `Register for ${event.title}` : "Join Code & Cocktails"}
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8">
            {event?.description ||
              "Sign up for our launch event—an intimate tech mixer celebrating local innovation and building Liberia's tech community."}
          </p>

          {/* Event Details */}
          <div className="bg-muted/30 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Event Details</h2>
            <div className="space-y-3 text-muted-foreground">
              <div className="flex justify-between">
                <span className="font-medium">Duration:</span>
                <span>3 hours</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Time:</span>
                <span>6:30 PM - 9:30 PM</span>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <h3 className="font-bold">What to Expect:</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-secondary mr-2">•</span>
                  <span>Signature cocktails and mocktails</span>
                </li>
                <li className="flex items-start">
                  <span className="text-secondary mr-2">•</span>
                  <span>
                    "Built in Liberia" tech showcase featuring local innovations
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-secondary mr-2">•</span>
                  <span>
                    Networking with developers, founders, and innovators
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-secondary mr-2">•</span>
                  <span>
                    Community directory sign-up to connect with attendees
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-secondary mr-2">•</span>
                  <span>Live music and professional photography</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="+231 XXX XXXX"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="company">Company / Organization</Label>
              <Input
                id="company"
                name="company"
                type="text"
                value={formData.company}
                onChange={handleChange}
                placeholder="Your company or organization"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="role">Role / Title</Label>
              <Input
                id="role"
                name="role"
                type="text"
                value={formData.role}
                onChange={handleChange}
                placeholder="e.g. Developer, Founder, Designer"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="interests">Areas of Interest</Label>
              <Textarea
                id="interests"
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                placeholder="What brings you to Code & Cocktails? (e.g. mobile dev, fintech, AI, networking)"
                className="mt-2 min-h-[100px]"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Registering..." : "Complete Registration"}
            </Button>
          </form>

          <p className="text-sm text-muted-foreground mt-6 text-center">
            By registering, you'll receive an email invite to create your
            account and access the event.
          </p>
        </div>
      </section>
    </main>
  );
}
