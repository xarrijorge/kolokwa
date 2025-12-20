import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { Events } from "@/components/events";

import { CallToAction } from "@/components/call-to-action";

export const metadata: Metadata = {
  title: "Kolokwa TechGuild - Building Liberia's Tech Ecosystem",
  description:
    "A Liberian-born collective of developers, innovators, and builders dedicated to shaping the nation's digital future. Join us for Code & Cocktails and the upcoming KoloKwa DevFest.",
};

export default function Home() {
  return (
    <main className="min-h-screen scroll-pt-20">
      <Hero />
      <Events />
      <CallToAction />
    </main>
  );
}
