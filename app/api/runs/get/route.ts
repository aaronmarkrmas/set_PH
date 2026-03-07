import { connectDB } from "@/lib/mongodb";
import Run from "@/models/run";
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