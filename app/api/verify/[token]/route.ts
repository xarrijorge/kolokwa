import { NextRequest, NextResponse } from "next/server";
import {
  getPendingSignupByToken,
  deletePendingSignup,
  createUser,
  createParticipant,
  getEventById,
} from "@/lib/db/client";
import { randomUUID } from "crypto";
import QRCode from "qrcode";

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } },
) {
  try {
    const token = params.token;

    const pending = await getPendingSignupByToken(token);
    if (!pending) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 404 },
      );
    }

    // Check if token is expired (7 days)
    const createdAt = new Date(pending.created_at);
    const now = new Date();
    const diffDays =
      (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays > 7) {
      await deletePendingSignup(token);
      return NextResponse.json({ error: "Token expired" }, { status: 410 });
    }

    return NextResponse.json({
      email: pending.email,
      event_id: pending.event_id,
    });
  } catch (error) {
    console.error("Verify GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { token: string } },
) {
  try {
    const { password, name, username } = await request.json();

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 },
      );
    }

    const token = params.token;

    const pending = await getPendingSignupByToken(token);
    if (!pending) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 404 },
      );
    }

    // Check if token is expired
    const createdAt = new Date(pending.created_at);
    const now = new Date();
    const diffDays =
      (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays > 7) {
      await deletePendingSignup(token);
      return NextResponse.json({ error: "Token expired" }, { status: 410 });
    }

    // Create user
    const user = await createUser({
      email: pending.email,
      password,
      name: name || null,
      username: username || null,
    });

    // Generate QR code
    const qrData = JSON.stringify({
      user_id: user.id,
      event_id: pending.event_id,
      email: user.email,
      timestamp: Date.now(),
    });
    const qrCode = await QRCode.toDataURL(qrData);

    // Create participant
    await createParticipant({
      user_id: user.id,
      event_id: pending.event_id,
      qr_code: qrCode,
    });

    // Delete pending signup
    await deletePendingSignup(token);

    return NextResponse.json({
      message: "Account created successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Verify POST error:", error);
    if (error.message?.includes("UNIQUE constraint failed")) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
