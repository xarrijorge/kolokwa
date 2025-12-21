import Dashboard from "@/components/admin/Dashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard - KoloKwa",
  description: "Manage events, partners, and staff for KoloKwa.",
};

export default function AdminPage() {
  return <Dashboard />;
}
