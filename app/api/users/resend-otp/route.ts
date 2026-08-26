import { connectDB } from "@/lib/mongodb";
import PendingUser from "@/models/pendingUser";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { NextResponse } from "next/server";
import { sendOTPEmail } from "@/lib/brevo";

const RESEND_COOLDOWN = 2 * 60 * 1000; // 2 minutes

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email } = await req.json();

    if (!email?.trim()) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const pendingUser = await PendingUser.findOne({
      email: normalizedEmail,
    });

    if (!pendingUser) {
      return NextResponse.json(
        {
          error:
            "No pending registration found. Please sign up again.",
        },
        { status: 404 }
      );
    }

    // Check the actual server-side cooldown
    const now = Date.now();

    const lastSentAt = new Date(
      pendingUser.otpLastSentAt
    ).getTime();

    const elapsed = now - lastSentAt;

    if (elapsed < RESEND_COOLDOWN) {
      const remainingSeconds = Math.ceil(
        (RESEND_COOLDOWN - elapsed) / 1000
      );

      return NextResponse.json(
        {
          error: "Please wait before requesting another OTP.",
          remainingSeconds,
        },
        { status: 429 }
      );
    }

    // Generate new OTP
    const otp = crypto
      .randomInt(100000, 1000000)
      .toString();

    // New OTP expires in 10 minutes
    const otpExpiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    );

    // Hash new OTP
    const hashedOtp = await bcrypt.hash(
      otp,
      10
    );

    // Update pending user
    pendingUser.hashedOtp = hashedOtp;
    pendingUser.otpExpiresAt = otpExpiresAt;
    pendingUser.otpLastSentAt = new Date();

    await pendingUser.save();

    // Send new OTP through Brevo
    await sendOTPEmail(
      normalizedEmail,
      otp
    );

    return NextResponse.json(
      {
        message: "A new OTP has been sent.",
        remainingSeconds: 120,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Resend OTP error:", error);

    return NextResponse.json(
      { error: "Failed to resend OTP" },
      { status: 500 }
    );
  }
}