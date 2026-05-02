import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Join from "@/models/join";
import { getTokenFromRequest, verifyToken, unauthorized } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      return unauthorized();
    }

    const { valid, decoded } = verifyToken(token);

    if (!valid) {
      return unauthorized();
    }

    await connectDB();

    const { runId } = await req.json();
    const userId = (decoded as any).userId;

    await Join.findOneAndDelete({
      runId,
      userId
    });

    return NextResponse.json({
      message: "Left run successfully"
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to leave run" },
      { status: 500 }
    );
  }
}