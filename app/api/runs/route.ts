import { connectDB } from "@/lib/mongodb";
import Run from "@/models/run";
import Join from "@/models/join";
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
      joinCode: nanoid(6),
      participants: [body.hostId]  // Add host as first participant
    });

    return NextResponse.json(run);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create run" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    
    const query = status ? { status } : {};
    const runs = await Run.find(query).sort({ date: 1 });

    // Fetch participants for each run
    const runsWithParticipants = await Promise.all(
      runs.map(async (run) => {
        try {
          const participants = await Join.find({ runId: run._id });
          const runObj = run.toObject();
          return {
            ...runObj,
            participants,
          };
        } catch (err) {
          console.error(`Error fetching participants for run ${run._id}:`, err);
          return {
            ...run.toObject(),
            participants: [],
          };
        }
      })
    );

    return NextResponse.json(runsWithParticipants);
  } catch (error) {
    console.error("Failed to fetch runs:", error);
    return NextResponse.json({ error: "Failed to fetch runs" }, { status: 500 });
  }
}