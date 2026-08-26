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

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id: runId } = await params;
    const { userId, name, status } = await req.json();

    if (!name || !status) {
      return NextResponse.json(
        { error: "Name and status are required" },
        { status: 400 }
      );
    }

    const participant = await Join.create({
      runId,
      userId: userId || null,
      name,
      status,
    });

    return NextResponse.json(participant, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add participant" },
      { status: 500 }
    );
  }
}