import EventsAdmin from "@/components/admin/EventsAdmin";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events Admin - KoloKwa",
  description: "Manage events for KoloKwa.",
};

export default function EventsPage() {
  return <EventsAdmin />;
}
