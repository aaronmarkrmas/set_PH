import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Join from "@/models/join";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { runId, userId } = await req.json();

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