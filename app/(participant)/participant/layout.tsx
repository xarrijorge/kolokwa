import { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import ParticipantNav from "@/components/participant/ParticipantNav";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

interface User {
  id: string;
  email: string;
  name?: string | null;
  username?: string | null;
  role: string;
}

export default async function ParticipantLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = cookies();
  const token = cookieStore.get("participant_token")?.value;

  let user: User | null = null;

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      if (decoded.role === "participant") {
        user = {
          id: decoded.id,
          email: decoded.email,
          name: decoded.name,
          username: decoded.username,
          role: decoded.role,
        };
      }
    } catch (error) {
      // Invalid token
    }
  }

  if (!user) {
    redirect("/participant/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ParticipantNav user={user} />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
