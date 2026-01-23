import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import File from "@/models/File";
import { connectDB } from "@/lib/db";

export async function GET(req: NextRequest) {
  await connectDB();

  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json([], { status: 401 });

  const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

  const files = await File.find({ userId: decoded.id })
    .select("originalName createdAt")
    .sort({ createdAt: -1 });

  return NextResponse.json(files);
}
