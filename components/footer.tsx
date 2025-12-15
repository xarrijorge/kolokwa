import { Mail, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-muted/30 py-12 px-4 sm:px-6 lg:px-8 border-t border-border">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-center gap-6 mb-8 opacity-40">
          <img src="/images/pattern-1.png" alt="" className="h-8 w-8" />
          <img src="/images/pattern-2.png" alt="" className="h-8 w-8" />
          <img src="/images/pattern-3.png" alt="" className="h-8 w-8" />
          <img src="/images/pattern-4.png" alt="" className="h-8 w-8" />
          <img src="/images/pattern-5.png" alt="" className="h-8 w-8" />
        </div>

        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Tagline */}
          <div className="md:col-span-2">
            <img src="/images/kolokwa.png" alt="Kolokwa" className="h-10 w-auto mb-4" />
            <p className="text-sm text-muted-foreground mb-2 font-medium">Where Innovation Meets Community</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Building Liberia's tech ecosystem, one connection at a time.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#events" className="text-muted-foreground hover:text-primary transition-colors">
                  Events
                </a>
              </li>
              <li>
                <a href="#mission" className="text-muted-foreground hover:text-primary transition-colors">
                  Mission & Values
                </a>
              </li>
              <li>
                <a href="#team" className="text-muted-foreground hover:text-primary transition-colors">
                  Our Team
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <a
                  href="mailto:hello@kolokwa.tech"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  hello@kolokwa.tech
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">Monrovia, Liberia</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Kolokwa TechGuild. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
