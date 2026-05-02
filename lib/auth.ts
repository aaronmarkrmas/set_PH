import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export function getTokenFromRequest(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader) {
    const parts = authHeader.split(" ");
    if (parts.length === 2) return parts[1];
  }

  // Fallback: check cookies for authToken (cookie format: "authToken=...; other=..")
  const cookieHeader = req.headers.get("cookie");
  if (cookieHeader) {
    const cookies = cookieHeader.split(";").map((c) => c.trim());
    const authCookie = cookies.find((c) => c.startsWith("authToken="));
    if (authCookie) {
      const token = authCookie.split("=").slice(1).join("=");
      return decodeURIComponent(token);
    }
  }

  return null;
}

export function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return { valid: true, decoded };
  } catch {
    return { valid: false, decoded: null };
  }
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}