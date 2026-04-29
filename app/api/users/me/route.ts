import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { error: "No token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET!
    );

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);

  } catch (error) {
    return NextResponse.json(
      { error: "Invalid token" },
      { status: 401 }
    );
  }
} 