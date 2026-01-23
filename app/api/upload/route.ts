import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { extractText } from "@/lib/text-extract";
import { embeddings } from "@/lib/embeddings";
import { chunkText } from "@/lib/chunk-text";
import File from "@/models/File";
import { connectDB } from "@/lib/db";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  await connectDB();

  // Auth
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
  const userId = decoded.id;

  // File
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // Upload to Cloudinary
  const upload = await new Promise<any>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ resource_type: "auto" }, (err, result) =>
        err ? reject(err) : resolve(result)
      )
      .end(buffer);
  });

  // SAFE text extraction ( never crash)
  let text = "";

  try {
    text = await extractText(buffer, file.type);
  } catch (err) {
    console.error("Text extraction failed:", err);
    text = "";
  }

  //  Chunk + Embed ONLY if text is usable
  let embeddedChunks: { text: string; embedding: number[] }[] = [];

  if (text && text.trim().length > 50) {
    const chunks = chunkText(text);

    embeddedChunks = await Promise.all(
      chunks.map(async (chunk) => ({
        text: chunk,
        embedding: await embeddings.embedQuery(chunk),
      }))
    );
  }

  // Save to MongoDB
  const savedFile = await File.create({
    userId,
    originalName: file.name,
    fileType: file.type,
    cloudinaryUrl: upload.secure_url,
    chunks: embeddedChunks,
  });

  return NextResponse.json({
    success: true,
    file: savedFile,
    chunksStored: embeddedChunks.length,
  });
}
