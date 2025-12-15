import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Users, Lightbulb } from "lucide-react"

export function Events() {
  return (
    <section id="events" className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-balance">Our Events</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            From intimate mixers to annual conferences, we create platforms for Liberian innovators to connect, learn,
            and showcase their work.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Code & Cocktails */}
          <Card className="overflow-hidden border-2 hover:border-secondary transition-all">
            <div className="p-8">
              <div className="mb-6">
                <img src="/images/cocktails.png" alt="Code & Cocktails" className="w-full h-auto max-w-md mx-auto" />
              </div>

              <div className="inline-block bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm font-medium mb-4">
                Pilot Event
              </div>

              <h3 className="text-2xl font-bold mb-4">Code & Cocktails: The Launch Mix</h3>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                An intimate evening of networking, showcasing local tech talent, and building community. Signature
                cocktails, rapid-fire demos, and meaningful connections.
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Relaxed networking to build community directory</span>
                </div>
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">"Built in Liberia" showcase with local demos</span>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Launching the movement toward DevFest</span>
                </div>
              </div>

              <Button className="w-full bg-secondary hover:bg-secondary/90">Register for Code & Cocktails</Button>
            </div>
          </Card>

          {/* DevFest */}
          <Card className="overflow-hidden border-2 hover:border-accent transition-all">
            <div className="p-8">
              <div className="mb-6">
                <img src="/images/devfest.png" alt="KoloKwa DevFest" className="w-full h-auto max-w-md mx-auto" />
              </div>

              <div className="inline-block bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium mb-4">
                Annual Conference
              </div>

              <h3 className="text-2xl font-bold mb-4">KoloKwa DevFest</h3>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                Liberia's premier annual celebration of developers, innovators, and entrepreneurs. Days of learning,
                collaboration, and showcasing bold innovation.
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Uniting builders, startups, corporates, and government</span>
                </div>
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Showcasing local solutions and innovation</span>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Creating partnerships and ecosystem growth</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground bg-transparent"
              >
                Stay Updated on DevFest
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
