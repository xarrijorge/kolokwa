import { Card } from "@/components/ui/card"

const team = [
  {
    name: "Xarri George",
    role: "Co-Organizer",
    description: "A visionary builder and organizer, Xarri leads the Guild with a focus on community, structure, and long‑term ecosystem impact. With experience in software development and product strategy, he drives the Guild’s mission and ensures its initiatives move with purpose.",
    logo: "/images/pattern-1.png",
  },
  {
    name: "Carlos Nah",
    role: "Co-Organizer",
    description: "An experienced software engineer with a passion for problem‑solving and clean engineering. He contributes to the Guild’s technical direction, project builds, and developer‑focused initiatives.",
    logo: "/images/pattern-2.png",
  },
  {
    name: "Shemiah Jones",
    role: "Co-Organizer",
    description: "Leads brand communication, outreach, and event awareness. With deep understanding of digital engagement, she ensures the Guild’s message resonates with the communities and partners we aim to reach.",
    logo: "/images/pattern-3.png",
  },
  {
    name: "Kate Hunder",
    role: "Co-Organizer",
    description: "Bridges technology and people. She supports the Guild’s development projects while driving community involvement, partnerships, and member experiences.",
    logo: "/images/pattern-4.png",
  },
]

export function Team() {
  return (
    <section id="team" className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-balance">Meet The Organizers</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            A multidisciplinary team committed to creating platforms, experiences, and opportunities that empower
            Liberian developers and innovators.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {team.map((member, index) => (
            <Card key={index} className="p-6 hover:border-primary transition-colors">
              <div >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center4 p-3">
                  <img
                    src={member.logo || "/placeholder.svg"}
                    alt={`${member.name} pattern`}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <h3 className="text-xl font-bold">{member.name}</h3>
              <div className="text-sm font-medium text-primary">{member.role}</div>
              <p className="text-sm text-muted-foreground leading-relaxed">{member.description}</p>
            </Card>
          ))}

          {/* Join Us Card */}
          <Card className="p-6 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border-2 border-dashed flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="text-2xl">👋</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Join Our Team</h3>
            <p className="text-sm text-muted-foreground mb-4">Want to help build Liberia's tech ecosystem?</p>
            <a href="/contact" className="text-sm font-medium text-primary hover:underline">
              Get in touch →
            </a>
          </Card>
        </div>
      </div>
    </section>
  )
}