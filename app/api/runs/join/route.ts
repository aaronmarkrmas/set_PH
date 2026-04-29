import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Run from "@/models/run";
import Join from "@/models/join";

export async function POST(req: Request, { params }: any) {
  await connectDB();
  const { joinCode } = params;
  const { name, userId } = await req.json();

  const run = await Run.findOne({ joinCode });
  if (!run) return NextResponse.json({ error: "Run not found" }, { status: 404 });

  const count = await Join.countDocuments({ runId: run._id, status: "going" });
  if (count >= run.numOfPlayers) return NextResponse.json({ error: "Run is full" }, { status: 400 });

  const join = await Join.create({ runId: run._id, userId, name });

  return NextResponse.json(join);
}