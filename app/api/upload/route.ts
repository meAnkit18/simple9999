import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { extractText } from "@/lib/text-extract";
import { embeddings } from "@/lib/embeddings";
import { chunkText } from "@/lib/chunk-text";
import { updateUserProfile } from "@/lib/user-profile";
import File from "@/models/File";
import { connectDB } from "@/lib/db";
import { getUserFromToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const userId = await getUserFromToken();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Cloudinary
    const upload = await new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ resource_type: "auto" }, (err, result) =>
          err ? reject(err) : resolve(result as { secure_url: string })
        )
        .end(buffer);
    });

    // Safe text extraction
    let text = "";
    try {
      text = await extractText(buffer, file.type);
    } catch (err) {
      console.error("Text extraction failed:", err);
    }

    // Chunk + Embed only if text is usable
    let embeddedChunks: { text: string; embedding: number[] }[] = [];
    let embeddingError = false;

    if (text && text.trim().length > 50) {
      const chunks = chunkText(text);

      try {
        embeddedChunks = await Promise.all(
          chunks.map(async (chunk) => ({
            text: chunk,
            embedding: await embeddings.embedQuery(chunk),
          }))
        );
      } catch (err) {
        console.warn("Embedding generation failed (quota?), saving text only:", err);
        embeddingError = true;
        // Store chunks without embeddings so text is still searchable
        embeddedChunks = chunks.map((chunk) => ({
          text: chunk,
          embedding: [],
        }));
      }
    }

    // Save to MongoDB
    const savedFile = await File.create({
      userId,
      originalName: file.name,
      fileType: file.type,
      cloudinaryUrl: upload.secure_url,
      chunks: embeddedChunks,
    });

    // Invalidate profile cache
    // await User.findByIdAndUpdate(userId, { hasNewUploads: true });

    // Trigger profile update immediately
    await updateUserProfile(userId);

    return NextResponse.json({
      success: true,
      file: {
        id: savedFile._id.toString(),
        name: savedFile.originalName,
        type: savedFile.fileType,
        url: savedFile.cloudinaryUrl,
      },
      chunksStored: embeddedChunks.length,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
