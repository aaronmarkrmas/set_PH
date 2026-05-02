import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value;

  // Check if user is authenticated
  if (!token) {
    // Optional: redirect to signin for protected routes
    return NextResponse.next();
  }

  // Verify token
  try {
    jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.next();
  } catch (error) {
    // Token invalid, remove it
    const response = NextResponse.next();
    response.cookies.delete("authToken");
    return response;
  }
}

// Specify which routes need authentication
export const config = {
    matcher: ["/dashboard/:path*"],
};