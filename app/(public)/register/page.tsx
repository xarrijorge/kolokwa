import type { Metadata } from "next";
import { RegisterClient } from "@/components/register-client";

export const metadata: Metadata = {
  title: "Register for Code & Cocktails - Kolokwa TechGuild",
  description:
    "Register for our launch event, Code & Cocktails. Join the movement to build Liberia's tech ecosystem.",
};

export default function RegisterPage() {
  return <RegisterClient />;
}
