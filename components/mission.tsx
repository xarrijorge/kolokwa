import { Card } from "@/components/ui/card"

const values = [
  {
    iconSrc: "/images/pattern-1.png",
    title: "Innovation",
    description: "We champion bold ideas and challenge outdated systems to advance Liberia's digital future.",
  },
  {
    iconSrc: "/images/pattern-2.png",
    title: "Collaboration",
    description: "We foster open engagement across builders, startups, corporates, and government.",
  },
  {
    iconSrc: "/images/pattern-3.png",
    title: "Local-first Solutions",
    description: "We prioritize products built by Liberians for Liberia—rooted in local insight and culture.",
  },
  {
    iconSrc: "/images/pattern-4.png",
    title: "Empowerment",
    description: "We uplift developers and entrepreneurs by giving them visibility and support to lead.",
  },
  {
    iconSrc: "/images/pattern-5.png",
    title: "Progress",
    description: "We believe in continuous learning and the unstoppable drive to move forward.",
  },
  {
    iconSrc: "/images/pattern-1.png",
    title: "Integrity",
    description: "We promote transparency, responsibility, and ethical leadership in the tech community.",
  },
]

export function Mission() {
  return (
    <section id="mission" className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-balance">Our Mission & Values</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed text-pretty">
            To spotlight and celebrate Liberia's developers, innovators, and entrepreneurs—champions who are building
            impact but often lack the platform to be seen or heard.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <img src={value.iconSrc || "/placeholder.svg"} alt="" className="h-20 w-20 mb-4 opacity-80" />
              <h3 className="text-xl font-bold mb-2">{value.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{value.description}</p>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-block bg-card border-2 border-primary/20 rounded-2xl p-8 max-w-2xl">
            <h3 className="text-2xl font-bold mb-3">Our Vision</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              A thriving, collaborative, and globally recognized Liberian tech ecosystem powered by homegrown talent and
              ideas.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
