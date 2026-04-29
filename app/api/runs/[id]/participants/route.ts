import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Join from "@/models/join";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const runId = searchParams.get("id");

    const players = await Join.find({
      runId,
      status: "going"
    });

    return NextResponse.json(players);

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get participants" },
      { status: 500 }
    );
  }
}