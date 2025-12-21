"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface User {
  id: string;
  email: string;
  name?: string | null;
  username?: string | null;
  role: string;
}

interface ParticipantNavProps {
  user: User;
}

export default function ParticipantNav({ user }: ParticipantNavProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/participant", { method: "DELETE" });
      router.push("/participant/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const displayName = user.name || user.username || user.email.split("@")[0];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-900">KoloKwa</h1>
            <span className="text-sm text-gray-500">Participant Portal</span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <p className="font-medium">{displayName}</p>
                <p className="text-gray-500">{user.email}</p>
              </div>
            </div>

            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
