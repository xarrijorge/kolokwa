"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Calendar,
  Users,
  Lightbulb,
  Target,
  Globe,
  Heart,
  Sparkles,
  Code,
  Rocket,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"

export default function DevFestPage() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <main className="min-h-screen overflow-hidden">
      <Navigation />

      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute top-[10%] left-[5%] animate-float"
            style={{ transform: `translateY(${scrollY * 0.2}px)` }}
          >
            <Image src="/images/pattern-1.png" alt="" width={100} height={100} className="drop-shadow-lg" />
          </div>
          <div
            className="absolute top-[20%] right-[10%] animate-float-delayed"
            style={{ transform: `translateY(${scrollY * 0.15}px)` }}
          >
            <Image src="/images/pattern-2.png" alt="" width={120} height={120} className="drop-shadow-lg" />
          </div>
          <div
            className="absolute top-[60%] left-[15%] animate-float"
            style={{ transform: `translateY(${scrollY * 0.25}px)` }}
          >
            <Image src="/images/pattern-3.png" alt="" width={110} height={110} className="drop-shadow-lg" />
          </div>
          <div
            className="absolute top-[40%] right-[20%] animate-pulse-slow"
            style={{ transform: `translateY(${scrollY * 0.18}px)` }}
          >
            <Image src="/images/pattern-4.png" alt="" width={90} height={90} className="drop-shadow-lg" />
          </div>
          <div
            className="absolute bottom-[20%] right-[8%] animate-float-delayed"
            style={{ transform: `translateY(${scrollY * 0.22}px)` }}
          >
            <Image src="/images/pattern-5.png" alt="" width={105} height={105} className="drop-shadow-lg" />
          </div>

          {/* Second set of patterns */}
          <div
            className="absolute top-[30%] left-[25%] animate-pulse-slow"
            style={{ transform: `translateY(${scrollY * 0.17}px)` }}
          >
            <Image src="/images/pattern-1.png" alt="" width={85} height={85} className="drop-shadow-lg" />
          </div>
          <div
            className="absolute bottom-[35%] right-[30%] animate-float"
            style={{ transform: `translateY(${scrollY * 0.21}px)` }}
          >
            <Image src="/images/pattern-2.png" alt="" width={95} height={95} className="drop-shadow-lg" />
          </div>
          <div
            className="absolute top-[15%] right-[35%] animate-float-delayed"
            style={{ transform: `translateY(${scrollY * 0.19}px)` }}
          >
            <Image src="/images/pattern-3.png" alt="" width={88} height={88} className="drop-shadow-lg" />
          </div>
          <div
            className="absolute bottom-[25%] left-[30%] animate-float"
            style={{ transform: `translateY(${scrollY * 0.23}px)` }}
          >
            <Image src="/images/pattern-4.png" alt="" width={100} height={100} className="drop-shadow-lg" />
          </div>
          <div
            className="absolute top-[50%] left-[8%] animate-pulse-slow"
            style={{ transform: `translateY(${scrollY * 0.16}px)` }}
          >
            <Image src="/images/pattern-5.png" alt="" width={92} height={92} className="drop-shadow-lg" />
          </div>
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <Link href="/">
            <Button variant="ghost" className="mb-8 group absolute top-4 left-4">
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Home
            </Button>
          </Link>

          <div className="text-center max-w-4xl mx-auto pt-20">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full font-bold text-sm mb-6 uppercase tracking-wide animate-fade-in-up">
              <Sparkles className="h-4 w-4" />
              Coming 2026
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight text-balance animate-fade-in-up animation-delay-200">
              KoloKwa{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
                DevFest
              </span>
            </h1>

            <p className="text-xl sm:text-2xl md:text-3xl text-muted-foreground leading-relaxed text-pretty mb-8 animate-fade-in-up animation-delay-400">
              Liberia's Premier Tech & Innovation Festival
            </p>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto animate-fade-in-up animation-delay-600">
              Where developers, innovators, and entrepreneurs come together to celebrate local talent, share knowledge,
              and build the digital future of Liberia
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="container mx-auto max-w-6xl">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-primary to-primary/60 mb-2">
                3
              </div>
              <div className="text-muted-foreground font-medium">Days of Innovation</div>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-secondary to-secondary/60 mb-2">
                500+
              </div>
              <div className="text-muted-foreground font-medium">Expected Attendees</div>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-accent to-accent/60 mb-2">
                50+
              </div>
              <div className="text-muted-foreground font-medium">Speakers & Mentors</div>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-primary via-secondary to-accent mb-2">
                100+
              </div>
              <div className="text-muted-foreground font-medium">Projects Showcased</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Purpose</h2>
            <p className="text-xl text-muted-foreground">Building Liberia's tech ecosystem, one connection at a time</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="group relative p-8 rounded-2xl bg-card border-2 border-border hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2">
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/20 opacity-0 group-hover:opacity-100 blur-3xl transition-opacity duration-500"></div>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/60 mb-6 group-hover:scale-110 transition-transform duration-300">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-4">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                To spotlight and celebrate Liberia's developers, innovators, and entrepreneurs—champions building impact
                who need platforms to be seen and heard. We break limiting structures, foster collaboration across tech
                builders, startups, corporates, and government, empowering locally sourced solutions.
              </p>
            </div>

            <div className="group relative p-8 rounded-2xl bg-card border-2 border-border hover:border-secondary/50 hover:shadow-2xl hover:shadow-secondary/10 transition-all duration-500 hover:-translate-y-2">
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br from-secondary to-secondary/20 opacity-0 group-hover:opacity-100 blur-3xl transition-opacity duration-500"></div>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-secondary/60 mb-6 group-hover:scale-110 transition-transform duration-300">
                <Rocket className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-4">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                A vibrant, collaborative, and globally recognized Liberian tech ecosystem where developers, innovators,
                and entrepreneurs thrive, influence change, and create solutions that redefine the nation's future.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">What to Expect</h2>
            <p className="text-xl text-muted-foreground">Three days packed with learning, networking, and innovation</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group bg-card p-8 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-border">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <Code className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Technical Talks</h3>
              <p className="text-muted-foreground leading-relaxed">
                Learn from industry experts about the latest technologies, frameworks, and best practices in software
                development
              </p>
            </div>

            <div className="group bg-card p-8 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-border">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-secondary to-secondary/60 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <Lightbulb className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Workshops</h3>
              <p className="text-muted-foreground leading-relaxed">
                Hands-on sessions covering web development, mobile apps, AI/ML, cloud computing, and more
              </p>
            </div>

            <div className="group bg-card p-8 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-border">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Startup Showcase</h3>
              <p className="text-muted-foreground leading-relaxed">
                Watch Liberian startups pitch their innovative solutions and compete for prizes and investment
                opportunities
              </p>
            </div>

            <div className="group bg-card p-8 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-border">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <Users className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Networking</h3>
              <p className="text-muted-foreground leading-relaxed">
                Connect with fellow developers, entrepreneurs, investors, and tech leaders shaping Liberia's digital
                future
              </p>
            </div>

            <div className="group bg-card p-8 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-border">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <Sparkles className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Built in Liberia</h3>
              <p className="text-muted-foreground leading-relaxed">
                Celebrate locally developed products and solutions that are making real impact in communities across
                Liberia
              </p>
            </div>

            <div className="group bg-card p-8 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-border">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent to-secondary flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <Heart className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Community Building</h3>
              <p className="text-muted-foreground leading-relaxed">
                Join a movement of passionate builders creating lasting connections and collaborative opportunities
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Core Values</h2>
            <p className="text-xl text-muted-foreground">The principles that guide everything we do</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="group relative p-6 rounded-xl bg-gradient-to-br from-primary/5 to-transparent hover:from-primary/10 transition-all duration-300 border border-border hover:border-primary/50">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Empowerment</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Giving Liberian tech builders the visibility and support they need to lead
                  </p>
                </div>
              </div>
            </div>

            <div className="group relative p-6 rounded-xl bg-gradient-to-br from-secondary/5 to-transparent hover:from-secondary/10 transition-all duration-300 border border-border hover:border-secondary/50">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Heart className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Collaboration</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Fostering partnerships across builders, startups, corporates, and government
                  </p>
                </div>
              </div>
            </div>

            <div className="group relative p-6 rounded-xl bg-gradient-to-br from-accent/5 to-transparent hover:from-accent/10 transition-all duration-300 border border-border hover:border-accent/50">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Lightbulb className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Innovation</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Championing bold ideas that advance Liberia's digital future
                  </p>
                </div>
              </div>
            </div>

            <div className="group relative p-6 rounded-xl bg-gradient-to-br from-primary/5 to-transparent hover:from-primary/10 transition-all duration-300 border border-border hover:border-primary/50">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Local-first</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Prioritizing solutions built by Liberians for Liberia
                  </p>
                </div>
              </div>
            </div>

            <div className="group relative p-6 rounded-xl bg-gradient-to-br from-secondary/5 to-transparent hover:from-secondary/10 transition-all duration-300 border border-border hover:border-secondary/50">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Integrity</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Promoting transparency and ethical leadership in tech
                  </p>
                </div>
              </div>
            </div>

            <div className="group relative p-6 rounded-xl bg-gradient-to-br from-accent/5 to-transparent hover:from-accent/10 transition-all duration-300 border border-border hover:border-accent/50">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Globe className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Inclusion</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Ensuring opportunities are accessible to all, regardless of background
                  </p>
                </div>
              </div>
            </div>

            {/* <div className="group relative p-6 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent hover:shadow-2xl transition-all duration-300 border border-border sm:col-span-2 lg:col-span-3">
              <div className="flex items-start gap-4 justify-center">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div className="max-w-2xl">
                  <h3 className="text-xl font-bold mb-2 text-white">Progress</h3>
                  <p className="text-white/90 text-sm leading-relaxed">
                    Believing in continuous learning, experimentation, and the unstoppable drive to move forward
                  </p>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10"></div>
        <div className="absolute inset-0 bg-[url('/images/pattern-5.png')] opacity-[0.02] bg-repeat"></div>

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full font-bold text-sm mb-6 uppercase tracking-wide">
            <Sparkles className="h-4 w-4" />
            Start Your Journey
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Begin With Code & Cocktails</h2>

          <p className="text-xl text-muted-foreground mb-10 text-pretty leading-relaxed max-w-2xl mx-auto">
            Join our pilot event—an intimate tech mixer where the Kolokwa movement begins. Network, learn, and be part
            of something bigger.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8 py-6 group">
                Join Code & Cocktails
                <Sparkles className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}