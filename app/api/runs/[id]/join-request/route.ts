import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Run from "@/models/run";
import GuestJoinRequest from "@/models/guestJoinRequest";
import { ObjectId } from "mongodb";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const { guestName, guestContact } = await req.json();

    if (!guestName?.trim() || !guestContact?.trim()) {
      return NextResponse.json(
        { error: "Guest name and contact are required" },
        { status: 400 }
      );
    }

    // Find the run
    const run = await Run.findById(new ObjectId(id));
    if (!run) {
      return NextResponse.json({ error: "Run not found" }, { status: 404 });
    }

    // Check if run is full
    const joinedCount = await GuestJoinRequest.countDocuments({
      runId: run._id,
      status: "approved",
    });
    if (joinedCount >= run.numOfPlayers) {
      return NextResponse.json({ error: "Run is full" }, { status: 400 });
    }

    // Check if guest already requested to join
    const existingRequest = await GuestJoinRequest.findOne({
      runId: run._id,
      guestContact,
      status: { $in: ["pending", "approved"] },
    });
    if (existingRequest) {
      return NextResponse.json(
        { error: "You already have a pending or active join request for this run" },
        { status: 400 }
      );
    }

    // Create join request with pending status
    const joinRequest = await GuestJoinRequest.create({
      runId: run._id,
      guestName: guestName.trim(),
      guestContact: guestContact.trim(),
      status: "pending",
      requestedAt: new Date(),
    });

    return NextResponse.json(
      {
        message: "Join request sent! The host will review and confirm your spot.",
        joinRequest,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating join request:", error);
    return NextResponse.json(
      { error: "Failed to send join request" },
      { status: 500 }
    );
  }
}

// GET pending join requests for a run (for host viewing)
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const pendingRequests = await GuestJoinRequest.find({
      runId: new ObjectId(id),
      status: "pending",
    }).sort({ requestedAt: 1 });

    return NextResponse.json(pendingRequests);
  } catch (error) {
    console.error("Error fetching join requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch join requests" },
      { status: 500 }
    );
  }
}
