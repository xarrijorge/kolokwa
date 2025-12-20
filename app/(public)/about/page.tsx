import type { Metadata } from "next";
import { About } from "@/components/about";
import { Mission } from "@/components/mission";

export const metadata: Metadata = {
  title: "About Us - Kolokwa TechGuild",
  description:
    "Learn about Kolokwa TechGuild's mission, values, and vision for building Liberia's tech ecosystem.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen scroll-pt-20">
      <About />
      <Mission />
    </main>
  );
}
