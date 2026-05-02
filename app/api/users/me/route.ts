import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import { getTokenFromRequest, verifyToken, unauthorized } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await connectDB();

    const token = getTokenFromRequest(req);

    if (!token) {
      return unauthorized();
    }

    const { valid, decoded } = verifyToken(token);

    if (!valid) {
      return unauthorized();
    }

    const user = await User.findById((decoded as any).userId).select("-password");

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);

  } catch (error) {
    return unauthorized();
  }
} 