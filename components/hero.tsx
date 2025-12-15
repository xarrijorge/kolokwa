import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20">
      <div className="container mx-auto max-w-6xl text-center">
        {/* Tagline */}
        <p className="text-primary text-sm sm:text-base font-medium mb-6 tracking-wide uppercase">
          The Defiance of Ordinary Brought Us Here
        </p>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-balance">
          Building Liberia's Tech Ecosystem
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed text-pretty">
          A collective of developers, innovators, and builders championing locally sourced solutions and celebrating
          Liberian talent.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button size="lg" className="w-full sm:w-auto text-base">
            Join Code & Cocktails
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto text-base bg-transparent">
            Learn About DevFest
          </Button>
        </div>

        {/* Event Info Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="bg-card border border-border rounded-lg p-6 text-left hover:border-secondary transition-colors">
            <div className="text-secondary font-bold text-sm mb-2 uppercase tracking-wide">Starting Now</div>
            <h3 className="text-2xl font-bold mb-2">Code & Cocktails</h3>
            <p className="text-muted-foreground leading-relaxed">
              An intimate tech mixer and project showcase launching the movement. Network, connect, and celebrate local
              innovation.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 text-left hover:border-accent transition-colors">
            <div className="text-accent font-bold text-sm mb-2 uppercase tracking-wide">Coming Soon</div>
            <h3 className="text-2xl font-bold mb-2">KoloKwa DevFest</h3>
            <p className="text-muted-foreground leading-relaxed">
              Liberia's annual developer and innovation conference. Days of learning, collaboration, and bold
              innovation.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}