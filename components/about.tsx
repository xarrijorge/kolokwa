export function About() {
  return (
    <section id="about" className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-balance">Who We Are</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
              <p>
                Kolokwa TechGuild is a Liberian-born collective of creators, innovators, and builders dedicated to
                shaping the next chapter of the nation's digital future.
              </p>
              <p>
                We exist to champion local talent, strengthen community collaboration, and ignite meaningful innovation
                across Liberia's growing tech ecosystem.
              </p>
              <p className="font-medium text-foreground">
                Our mission is simple: to cultivate a strong, united, and future-ready tech community in Liberia.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 p-8 flex items-center justify-center">
              <img src="/images/techguild.png" alt="Kolokwa TechGuild" className="w-full h-auto" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
