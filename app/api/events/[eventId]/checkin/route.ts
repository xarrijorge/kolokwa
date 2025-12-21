import { NextRequest, NextResponse } from "next/server";
import { checkInParticipant, getEventById } from "@/lib/db/client";

export async function POST(
  request: NextRequest,
  { params }: { params: { eventId: string } },
) {
  try {
    const { qr_data } = await request.json();

    if (!qr_data) {
      return NextResponse.json({ error: "QR data required" }, { status: 400 });
    }

    const eventId = params.eventId;

    // Verify event exists
    const event = await getEventById(eventId);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Parse QR data
    let qrData;
    try {
      qrData = JSON.parse(qr_data);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid QR code data" },
        { status: 400 },
      );
    }

    // Verify QR data contains required fields
    if (!qrData.user_id || !qrData.event_id || !qrData.email) {
      return NextResponse.json(
        { error: "Invalid QR code format" },
        { status: 400 },
      );
    }

    // Verify the QR code is for this event
    if (qrData.event_id !== eventId) {
      return NextResponse.json(
        { error: "QR code is for a different event" },
        { status: 400 },
      );
    }

    // Check in the participant
    const result = await checkInParticipant(qr_data);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      message: "Check-in successful",
      participant: {
        name: result.participant.name,
        email: result.participant.email,
        username: result.participant.username,
      },
    });
  } catch (error) {
    console.error("Check-in error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
