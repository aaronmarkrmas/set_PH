import { connectDB } from "@/lib/mongodb";
import Run from "@/models/run";
import { NextResponse } from "next/server";

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