import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import GuestJoinRequest from "@/models/guestJoinRequest";
import Join from "@/models/join";
import Run from "@/models/run";
import { getTokenFromRequest, verifyToken, unauthorized } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; requestId: string }> }
) {
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
    const { id, requestId } = await params;
    const { action } = await req.json();
    const userId = (decoded as any).userId;

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "Action must be 'approve' or 'reject'" },
        { status: 400 }
      );
    }

    // Verify the user is the host of this run
    const run = await Run.findById(new ObjectId(id));
    if (!run) {
      return NextResponse.json({ error: "Run not found" }, { status: 404 });
    }

    if (run.hostId.toString() !== userId) {
      return NextResponse.json(
        { error: "Only the host can approve requests" },
        { status: 403 }
      );
    }

    // Find the guest join request
    const guestRequest = await GuestJoinRequest.findById(new ObjectId(requestId));
    if (!guestRequest || guestRequest.status !== "pending") {
      return NextResponse.json(
        { error: "Join request not found or already processed" },
        { status: 404 }
      );
    }

    if (action === "approve") {
      // Check if run is still not full
      const joinedCount = await Join.countDocuments({
        runId: run._id,
        status: "going",
      });
      if (joinedCount >= run.numOfPlayers) {
        return NextResponse.json(
          { error: "Run is now full, cannot approve this request" },
          { status: 400 }
        );
      }

      // Create a Join record for the approved guest
      const join = await Join.create({
        runId: run._id,
        name: guestRequest.guestName,
        status: "going",
      });

      // Update guest request status to "approved"
      guestRequest.status = "approved";
      guestRequest.approvedAt = new Date();
      await guestRequest.save();

      return NextResponse.json({
        message: `Guest ${guestRequest.guestName} has been approved to join the run`,
        guestRequest,
        join,
      });
    } else {
      // Reject the request
      guestRequest.status = "rejected";
      guestRequest.rejectedAt = new Date();
      await guestRequest.save();

      return NextResponse.json({
        message: `Guest ${guestRequest.guestName}'s request has been rejected`,
        guestRequest,
      });
    }
  } catch (error) {
    console.error("Error processing join request:", error);
    return NextResponse.json(
      { error: "Failed to process join request" },
      { status: 500 }
    );
  }
}
