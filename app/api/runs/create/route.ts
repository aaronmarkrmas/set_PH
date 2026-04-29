import { connectDB } from "@/lib/mongodb";
import Run from "@/models/run";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const run = await Run.create({
      title: body.title,
      location: body.location,
      date: body.date,
      numOfPlayers: body.numOfPlayers,
      hostId: body.hostId,
      joinCode: nanoid(6)
    });

    return NextResponse.json(run);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create run" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();

    const runs = await Run.find().sort({ date: 1 });

    return NextResponse.json(runs);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch runs" }, { status: 500 });
  }
}