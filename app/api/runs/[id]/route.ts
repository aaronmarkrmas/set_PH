import { connectDB } from "@/lib/mongodb";
import Run from "@/models/run";
import Join from "@/models/join";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const run = await Run.findById(params.id);

    if (!run) {
      return NextResponse.json({ error: "Run not found" }, { status: 404 });
    }

    return NextResponse.json(run);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch run" }, { status: 500 });
  }
}


export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const body = await req.json();

    const updatedRun = await Run.findByIdAndUpdate(
      params.id,
      body,
      { new: true }
    );

    return NextResponse.json(updatedRun);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update run" }, { status: 500 });
  }
}


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
