import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  // Clear cookie by setting maxAge to 0
  res.cookies.set("authToken", "", { maxAge: 0, path: "/" });
  return res;
}
