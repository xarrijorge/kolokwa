import { NextRequest, NextResponse } from "next/server";
import { createPendingSignup, getEventById } from "@/lib/db/client";
import { Resend } from "resend";
import { randomUUID } from "crypto";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function POST(
  request: NextRequest,
  { params }: { params: { eventId: string } },
) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email required" },
        { status: 400 },
      );
    }

    const eventId = params.eventId;

    // Check if event exists
    const event = await getEventById(eventId);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Generate invite token
    const inviteToken = randomUUID();

    // Create pending signup
    await createPendingSignup({
      email,
      event_id: eventId,
      invite_token: inviteToken,
    });

    // Send invite email
    if (!resend) {
      console.error("RESEND_API_KEY not configured");
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 },
      );
    }

    const inviteUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/verify/${inviteToken}`;

    await resend.emails.send({
      from: "noreply@kolokwa.tech",
      to: email,
      subject: `You're invited to ${event.title}`,
      html: `
        <h1>Welcome to KoloKwa!</h1>
        <p>You've been invited to join the event: <strong>${event.title}</strong></p>
        <p>Click the link below to complete your registration:</p>
        <a href="${inviteUrl}">Complete Registration</a>
        <p>This link will expire in 7 days.</p>
      `,
    });

    return NextResponse.json({ message: "Invite sent successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
