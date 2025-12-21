import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { getUserEvents } from "@/lib/db/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

interface User {
  id: string;
  email: string;
  name?: string | null;
  username?: string | null;
}

export default async function ParticipantDashboard() {
  const cookieStore = cookies();
  const token = cookieStore.get("participant_token")?.value;

  let user: User | null = null;

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      user = {
        id: decoded.id,
        email: decoded.email,
        name: decoded.name,
        username: decoded.username,
      };
    } catch (error) {
      // Invalid token
    }
  }

  if (!user) {
    return <div>Please log in</div>;
  }

  const events = await getUserEvents(user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Welcome, {user.name || user.email}
        </h1>
        <p className="text-gray-600">Your event dashboard</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <Card key={event.event_id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {event.title}
                <Badge variant="secondary">{event.status}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <strong>Date:</strong>{" "}
                  {event.date
                    ? new Date(event.date).toLocaleDateString()
                    : "TBD"}
                </p>
                {event.venue && (
                  <p className="text-sm text-gray-600">
                    <strong>Venue:</strong> {event.venue}
                  </p>
                )}
                {event.description && (
                  <p className="text-sm text-gray-600">{event.description}</p>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Check-In Status</h4>
                {event.checked_in ? (
                  <div className="text-center">
                    <Badge
                      variant="default"
                      className="bg-green-100 text-green-800"
                    >
                      ✓ Checked In
                    </Badge>
                    <p className="text-xs text-center text-gray-500 mt-2">
                      You have successfully checked in to this event
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-center">
                      <Image
                        src={event.qr_code}
                        alt="Event QR Code"
                        width={150}
                        height={150}
                        className="border rounded"
                      />
                    </div>
                    <p className="text-xs text-center text-gray-500">
                      Show this at the event for check-in
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {events.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No events found. Check back later!</p>
        </div>
      )}
    </div>
  );
}
