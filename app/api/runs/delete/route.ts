import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Run from "@/models/run";
import Join from "@/models/join";

export async function DELETE(req: Request) {
  try {
    await connectDB();

    const { runId } = await req.json();

    await Run.findByIdAndDelete(runId);

    await Join.deleteMany({
      runId
    });

    return NextResponse.json({
      message: "Run deleted successfully"
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete run" },
      { status: 500 }
    );
  }
}