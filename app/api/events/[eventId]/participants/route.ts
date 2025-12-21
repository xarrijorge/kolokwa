import { NextRequest, NextResponse } from "next/server";
import { getParticipantsByEvent } from "@/lib/db/client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> },
) {
  try {
    const { eventId } = await params;

    const participants = await getParticipantsByEvent(eventId);

    return NextResponse.json(participants);
  } catch (error) {
    console.error("Get participants error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
