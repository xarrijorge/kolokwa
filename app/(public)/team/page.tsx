import type { Metadata } from "next";
import { Team } from "@/components/team";

export const metadata: Metadata = {
  title: "Meet the Team - Kolokwa TechGuild",
  description:
    "Meet the organizers and team behind Kolokwa TechGuild, dedicated to building Liberia's tech ecosystem.",
};

export default function TeamPage() {
  return (
    <main className="min-h-screen scroll-pt-20">
      <Team />
    </main>
  );
}
