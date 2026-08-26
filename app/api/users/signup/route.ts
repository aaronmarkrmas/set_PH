import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import PendingUser from "@/models/pendingUser";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { NextResponse } from "next/server";
import { sendOTPEmail } from "@/lib/brevo";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { name, email, password } = await req.json();

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if a verified account already exists
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Generate OTP
    const otp = crypto
      .randomInt(100000, 1000000)
      .toString();

    const otpExpiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    );

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // Hash OTP
    const hashedOtp = await bcrypt.hash(
      otp,
      10
    );

    // Remove any previous pending registration
    await PendingUser.deleteOne({
      email: normalizedEmail,
    });

    // Store as pending ONLY
    await PendingUser.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      hashedOtp,
      otpExpiresAt,
      otpLastSentAt: new Date(),

    });

    // Send OTP
    await sendOTPEmail(
      normalizedEmail,
      otp
    );

    return NextResponse.json(
      {
        message: "OTP sent to your email.",
        email: normalizedEmail,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Signup error:", error);

    return NextResponse.json(
      { error: "Signup failed" },
      { status: 500 }
    );
  }
}