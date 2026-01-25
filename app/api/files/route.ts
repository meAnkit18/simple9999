import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserIdWithFallback } from "@/lib/auth";
import File from "@/models/File";

export async function GET() {
  try {
    await connectDB();

    const userId = await getUserIdWithFallback();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const files = await File.find({ userId })
      .select("originalName fileType cloudinaryUrl createdAt chunks")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      files: files.map((f: {
        _id: { toString(): string };
        originalName: string;
        fileType: string;
        cloudinaryUrl: string;
        createdAt: Date;
        chunks?: { text: string }[];
      }) => ({
        id: f._id.toString(),
        name: f.originalName,
        type: f.fileType,
        url: f.cloudinaryUrl,
        createdAt: f.createdAt,
        chunksCount: f.chunks?.length || 0,
      })),
    });
  } catch (error) {
    console.error("Files API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch files" },
      { status: 500 }
    );
  }
}
