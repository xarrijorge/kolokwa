import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar, MapPin, Clock } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20">
      <div className="absolute inset-0 z-0">
        <img src="/minimalist-modern-tech-event-space-with-subtle-lig.jpg" alt="" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/90 to-background" />
      </div>

      <div className="container mx-auto max-w-6xl text-center relative z-10">
        <p className="text-primary text-sm sm:text-base font-medium mb-6 tracking-wide uppercase">
          Where Innovation Meets Community
        </p>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-balance">
          Code & Cocktails: The Launch Mix
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed text-pretty">
          Join us for an evening of networking, tech showcases, and celebration as we launch Liberia's premier tech
          community.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span className="font-medium">TBA</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-secondary" />
            <span className="font-medium">6:30 PM - 9:30 PM</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-accent" />
            <span className="font-medium">Monrovia, Liberia</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button size="lg" className="w-full sm:w-auto text-base">
            Register for Code & Cocktails
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto text-base bg-transparent">
            Learn More About DevFest
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-card border border-border rounded-lg p-6 text-left hover:border-primary transition-colors">
            <div className="text-primary font-bold text-sm mb-2 uppercase tracking-wide">Showcase</div>
            <h3 className="text-xl font-bold mb-2">"Built in Liberia"</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">
              Watch rapid-fire demos of innovative local apps and products by Liberian tech talent.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 text-left hover:border-secondary transition-colors">
            <div className="text-secondary font-bold text-sm mb-2 uppercase tracking-wide">Network</div>
            <h3 className="text-xl font-bold mb-2">Connect & Collaborate</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">
              Mix with developers, entrepreneurs, and innovators. Build your network in an intimate setting.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 text-left hover:border-accent transition-colors">
            <div className="text-accent font-bold text-sm mb-2 uppercase tracking-wide">Celebrate</div>
            <h3 className="text-xl font-bold mb-2">Signature Cocktails</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">
              Enjoy creative cocktails and mocktails while celebrating the launch of our tech community.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
