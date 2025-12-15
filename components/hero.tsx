import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/heroHead.jpg')" // replace with your image
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />

      {/* Content */}
      <div className="relative z-10 container mx-auto max-w-6xl text-center px-4 sm:px-6 lg:px-8 pt-24">
        {/* Tagline */}
        <p className="text-primary text-sm sm:text-base font-medium mb-6 tracking-wide uppercase">
          The Defiance of Ordinary Brought Us Here
        </p>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-balance text-white">
          Building Liberia&apos;s Tech Ecosystem
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-12 leading-relaxed text-pretty">
          A collective of developers, innovators, and builders championing locally sourced solutions and celebrating
          Liberian talent.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link href="/register">
            <Button size="lg" className="w-full sm:w-auto text-base">
              Join Code & Cocktails
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/devfest">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto text-base bg-transparent text-white border-white/30 hover:bg-white/10"
            >
              Learn About DevFest
            </Button>
          </Link>
        </div>

        {/* Event Info Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="bg-black/50 border border-white/10 rounded-xl p-6 text-left hover:border-secondary transition-colors backdrop-blur">
            <div className="text-secondary font-bold text-sm mb-2 uppercase tracking-wide">
              Starting Now
            </div>
            <h3 className="text-2xl font-bold mb-2 text-white">Code & Cocktails</h3>
            <p className="text-white/70 leading-relaxed">
              An intimate tech mixer and project showcase launching the movement. Network, connect, and celebrate local
              innovation.
            </p>
          </div>

          <div className="bg-black/50 border border-white/10 rounded-xl p-6 text-left hover:border-accent transition-colors backdrop-blur">
            <div className="text-accent font-bold text-sm mb-2 uppercase tracking-wide">
              Coming Soon
            </div>
            <h3 className="text-2xl font-bold mb-2 text-white">KoloKwa DevFest</h3>
            <p className="text-white/70 leading-relaxed">
              Liberia&apos;s annual developer and innovation conference. Days of learning, collaboration, and bold
              innovation.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}