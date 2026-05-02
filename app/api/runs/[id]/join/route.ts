import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Run from "@/models/run";
import Join from "@/models/join";
import { getTokenFromRequest, verifyToken, unauthorized } from "@/lib/auth";

export async function POST(req: Request, { params }: any) {
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
    const { joinCode } = params;
    const { name } = await req.json();
    const userId = (decoded as any).userId;

  const run = await Run.findOne({ joinCode });
  if (!run) return NextResponse.json({ error: "Run not found" }, { status: 404 });

  const count = await Join.countDocuments({ runId: run._id, status: "going" });
  if (count >= run.numOfPlayers) return NextResponse.json({ error: "Run is full" }, { status: 400 });

  const join = await Join.create({ runId: run._id, userId, name });

    return NextResponse.json(join);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to join run" },
      { status: 500 }
    );
  }
}