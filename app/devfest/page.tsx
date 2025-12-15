import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Users, Lightbulb, Target, Globe, Heart } from "lucide-react"
import Link from "next/link"

export default function DevFestPage() {
  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <Link href="/">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>

          <div className="text-accent font-bold text-sm mb-4 uppercase tracking-wide">Coming Soon</div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight text-balance">
            KoloKwa DevFest
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed text-pretty">
            Liberia's annual celebration of developers, innovators, and entrepreneurs shaping the country's digital
            future
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                KoloKwa DevFest exists to spotlight and celebrate Liberia's developers, innovators, and
                entrepreneurs—champions who are building impact but often lack the platform to be seen or heard. We are
                committed to breaking limiting structures, fostering collaboration across tech builders, startups,
                corporates, and government, and empowering locally sourced solutions that move the nation forward.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
              <p className="text-muted-foreground leading-relaxed">
                To build a vibrant, collaborative, and globally recognized Liberian tech ecosystem where developers,
                innovators, and entrepreneurs can thrive, influence change, and create solutions that redefine the
                nation's future.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-12 text-center">Core Values</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Empowerment</h3>
              <p className="text-muted-foreground leading-relaxed">
                We uplift Liberian developers, innovators, and entrepreneurs by giving them the visibility, confidence,
                and support they need to lead.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 mb-4">
                <Heart className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Collaboration</h3>
              <p className="text-muted-foreground leading-relaxed">
                We foster open engagement across builders, startups, corporates, academia, and government to accelerate
                meaningful innovation.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4">
                <Lightbulb className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">Innovation</h3>
              <p className="text-muted-foreground leading-relaxed">
                We champion bold ideas, challenge outdated systems, and encourage creativity that advances Liberia's
                digital future.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Local-first Solutions</h3>
              <p className="text-muted-foreground leading-relaxed">
                We prioritize products, tools, and solutions built by Liberians for Liberia—rooted in local insight,
                culture, and impact.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 mb-4">
                <Calendar className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Integrity</h3>
              <p className="text-muted-foreground leading-relaxed">
                We promote transparency, responsibility, and ethical leadership within the growing tech community.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4">
                <Globe className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">Inclusion</h3>
              <p className="text-muted-foreground leading-relaxed">
                We ensure that opportunities, knowledge, and platforms are accessible to all—regardless of background,
                gender, or experience level.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-6">About KoloKwa DevFest</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            KoloKwa DevFest is an annual celebration of Liberia's builders—developers, innovators, and entrepreneurs
            shaping the country's digital future. Designed to spotlight local talent and elevate voices that often go
            unheard, the festival brings together creators, startups, corporates, and government for days of learning,
            collaboration, and bold innovation.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Our goal is simple: break through outdated structures, unite the ecosystem, and empower solutions sourced
            and built locally. KoloKwa DevFest stands as a platform where ideas grow, partnerships form, and Liberians
            take the lead in defining the technology and businesses of tomorrow.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Start With Code & Cocktails</h2>
          <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
            Join us for our pilot event—an intimate tech mixer launching the movement
          </p>
          <Link href="/register">
            <Button size="lg">Join Code & Cocktails</Button>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
