import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Run from "@/models/run";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();

  const run = await Run.create({
    ...body,
    joinCode: nanoid(8)
  });

  return NextResponse.json(run);
}