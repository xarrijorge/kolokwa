import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Users, Heart, Lightbulb } from "lucide-react";

export const metadata: Metadata = {
  title: "Join Us - Kolokwa TechGuild",
  description:
    "Get in touch with Kolokwa TechGuild. Join our team or express your interest in building Liberia's tech ecosystem.",
};

export default function JoinTeamPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-balance">
              Join The Movement
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Be part of building Liberia's tech ecosystem. Whether you're a
              developer, designer, marketer, or passionate about innovation, we
              want to hear from you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            {/* Why Join Section */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">Why Join Us?</h2>
                <p className="text-muted-foreground mb-8">
                  Kolokwa TechGuild is more than a team—it's a community of
                  innovators, builders, and dreamers committed to transforming
                  Liberia's tech landscape.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">
                      Collaborative Community
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Work alongside talented individuals who share your passion
                      for technology and innovation.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Impact & Innovation</h3>
                    <p className="text-sm text-muted-foreground">
                      Create meaningful change by building platforms and
                      experiences that empower developers.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Heart className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Growth & Learning</h3>
                    <p className="text-sm text-muted-foreground">
                      Develop your skills while contributing to events,
                      workshops, and initiatives that matter.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Form */}
            <div className="bg-muted/30 rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-6">Express Your Interest</h3>
              <form className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </label>
                  <Input id="name" placeholder="Your name" required />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="role" className="text-sm font-medium">
                    Area of Interest
                  </label>
                  <Input
                    id="role"
                    placeholder="e.g., Developer, Designer, Marketing"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Tell Us About Yourself
                  </label>
                  <Textarea
                    id="message"
                    placeholder="What excites you about joining Kolokwa TechGuild?"
                    rows={6}
                    required
                  />
                </div>

                <Button type="submit" size="lg" className="w-full">
                  Submit Application
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
