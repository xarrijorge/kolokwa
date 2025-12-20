import type { Metadata } from "next";
import { DevFestClient } from "@/components/devfest-client";

export const metadata: Metadata = {
  title: "KoloKwa DevFest - Liberia's Premier Tech Festival",
  description:
    "Join KoloKwa DevFest, Liberia's premier tech & innovation festival. Celebrate local talent, learn from experts, and build the future.",
};

export default function DevFestPage() {
  return <DevFestClient />;
}
