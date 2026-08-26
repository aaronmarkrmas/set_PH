import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Run from "@/models/run";
import Join from "@/models/join";
import User from "@/models/user";
import { getTokenFromRequest, verifyToken, unauthorized } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
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
    const { id } = await params;
    const { name } = await req.json();
    const userId = (decoded as any).userId;

    // Find the run by ID
    const run = await Run.findById(new ObjectId(id));
    if (!run) return NextResponse.json({ error: "Run not found" }, { status: 404 });

    // Check if user is the host
    if (run.hostId.toString() === userId) {
      return NextResponse.json({ error: "User already joined" }, { status: 400 });
    }

    // Check if user is already in the run
    const existingJoin = await Join.findOne({ runId: run._id, userId, status: "going" });
    if (existingJoin) {
      return NextResponse.json({ error: "User already joined" }, { status: 400 });
    }

    const count = await Join.countDocuments({ runId: run._id, status: "going" });
    if (count >= run.numOfPlayers) return NextResponse.json({ error: "Run is full" }, { status: 400 });

    const join = await Join.create({ runId: run._id, userId, name });

    return NextResponse.json(join);
  } catch (error) {
    console.error("Error joining run:", error);
    return NextResponse.json(
      { error: "Failed to join run" },
      { status: 500 }
    );
  }
}
  