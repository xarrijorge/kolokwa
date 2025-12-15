import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { Mission } from "@/components/mission"
import { Events } from "@/components/events"
import { Team } from "@/components/team"
import { CallToAction } from "@/components/call-to-action"
import { Footer } from "@/components/footer"
import { Navigation } from "@/components/navigation"

export default function Home() {
  return (
    <main className="min-h-screen scroll-pt-20">
      <Navigation />
      <Hero />
      <About />
      <Events />
      <Mission />
      <Team />
      <CallToAction />
      <Footer />
    </main>
  )
}