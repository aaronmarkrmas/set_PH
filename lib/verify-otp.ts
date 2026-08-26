import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import PendingUser from "@/models/pendingUser";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email, otp } = await req.json();

    if (!email?.trim() || !otp?.trim()) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Find pending registration
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

    // Check expiration
    if (new Date() > new Date(pendingUser.otpExpiresAt)) {
      await PendingUser.deleteOne({
        _id: pendingUser._id,
      });

      return NextResponse.json(
        {
          error:
            "OTP has expired. Please sign up again.",
        },
        { status: 400 }
      );
    }

    // Verify OTP
    const isValidOtp = await bcrypt.compare(
      otp.trim(),
      pendingUser.hashedOtp
    );

    if (!isValidOtp) {
      return NextResponse.json(
        { error: "Invalid OTP" },
        { status: 400 }
      );
    }

    // OTP is correct → create REAL user
    await User.create({
      name: pendingUser.name,
      email: pendingUser.email,
      password: pendingUser.password,
    });

    // Remove pending registration
    await PendingUser.deleteOne({
      _id: pendingUser._id,
    });

    return NextResponse.json(
      {
        message: "Account verified successfully!",
      },
      { status: 200 }
    );

  } catch (error) {
    console.error(
      "OTP verification error:",
      error
    );

    return NextResponse.json(
      { error: "OTP verification failed" },
      { status: 500 }
    );
  }
}