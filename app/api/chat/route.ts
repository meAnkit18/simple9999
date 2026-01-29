import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserIdWithFallback } from "@/lib/auth";
import { generateResume } from "@/lib/ai-service";
import { extractUserProfile, getAllUserDocumentText, updateUserProfile } from "@/lib/user-profile";
import Project from "@/models/Project";
import cloudinary from "@/lib/cloudinary";
import { extractText } from "@/lib/text-extract";
import { embeddings } from "@/lib/embeddings";
import { chunkText } from "@/lib/chunk-text";
import FileModel from "@/models/File";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const userId = await getUserIdWithFallback();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Handle both JSON and FormData
    let message = "";
    const attachedFiles: File[] = [];

    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      message = formData.get("message") as string;
      const files = formData.getAll("files");
      if (files && files.length > 0) {
        files.forEach(f => {
          if (f instanceof File) attachedFiles.push(f);
        });
      }
    } else {
      const body = await req.json();
      message = body.message;
    }

    if (!message && attachedFiles.length === 0) {
      return NextResponse.json({ error: "Message or file required" }, { status: 400 });
    }

    console.log("[Chat API] Processing resume request for user:", userId);
    console.log("[Chat API] Message:", message?.substring(0, 100));
    console.log("[Chat API] Attached files:", attachedFiles.length);

    // Step 0: Process attached files inline if any
    let inlineContext = "";
    if (attachedFiles.length > 0) {
      console.log("[Chat API] Processing attached files...");

      for (const file of attachedFiles) {
        try {
          const buffer = Buffer.from(await file.arrayBuffer());

          // 1. Upload to Cloudinary
          const upload = await new Promise<{ secure_url: string }>((resolve, reject) => {
            cloudinary.uploader
              .upload_stream({ resource_type: "auto" }, (err, result) =>
                err ? reject(err) : resolve(result as { secure_url: string })
              )
              .end(buffer);
          });

          // 2. Extract text
          let text = "";
          try {
            text = await extractText(buffer, file.type);
          } catch (err) {
            console.error("Text extraction failed:", err);
          }

          if (text) {
            inlineContext += `\n\n=== ATTACHED FILE: ${file.name} ===\n${text}\n=== END ATTACHED FILE ===\n`;

            // 3. Chunk & Embed (simplified for speed)
            let embeddedChunks: { text: string; embedding: number[] }[] = [];
            if (text.trim().length > 50) {
              const chunks = chunkText(text);
              // Try to embed, but don't block too long or fail hard
              try {
                embeddedChunks = await Promise.all(
                  chunks.map(async (chunk) => ({
                    text: chunk,
                    embedding: await embeddings.embedQuery(chunk),
                  }))
                );
              } catch (err) {
                console.warn("Embedding failed, saving text only:", err);
                embeddedChunks = chunks.map(c => ({ text: c, embedding: [] }));
              }
            }

            // 4. Save to DB
            await FileModel.create({
              userId,
              originalName: file.name,
              fileType: file.type,
              cloudinaryUrl: upload.secure_url,
              chunks: embeddedChunks,
            });
          }
        } catch (err) {
          console.error(`Failed to process file ${file.name}:`, err);
        }
      }

      // Trigger profile update in background
      updateUserProfile(userId).catch(err => console.error("Background profile update failed:", err));
    }

    console.log("[Chat API] Processing resume request for user:", userId);
    console.log("[Chat API] Company requirements:", message.substring(0, 100));

    // Step 1: Get the user's COMPLETE profile from all their uploaded documents
    let userProfile = null;
    let rawContext = "";

    try {
      console.log("[Chat API] Extracting user profile from documents...");
      userProfile = await extractUserProfile(userId);

      if (userProfile) {
        console.log("[Chat API] User profile extracted:");
        console.log("  - Name:", userProfile.fullName || "Not found");
        console.log("  - Skills count:", userProfile.skills?.length || 0);
        console.log("  - Experience count:", userProfile.experience?.length || 0);
        console.log("  - Raw text length:", userProfile.rawText?.length || 0);
      } else {
        console.log("[Chat API] No profile extracted, trying raw text...");
        rawContext = await getAllUserDocumentText(userId);
        console.log("[Chat API] Raw context length:", rawContext?.length || 0);
      }
    } catch (err) {
      console.warn("[Chat API] Profile/context extraction failed:", err);
    }

    // Step 2: Generate LaTeX resume using user's profile + company requirements + inline context
    const latexCode = await generateResume(message, userProfile, (rawContext || "") + inlineContext);

    // Step 3: Create project with the generated resume
    const projectName = userProfile?.fullName
      ? `${userProfile.fullName} - ${message.slice(0, 30)}...`
      : `Resume: ${message.slice(0, 50)}...`;

    const project = await Project.create({
      userId,
      name: projectName,
      latexCode,
      previewHtml: "",
      chatHistory: [{ role: "user", content: message }],
      createdAt: new Date(),
      lastModified: new Date(),
    });

    return NextResponse.json({
      projectId: project._id.toString(),
      latexCode,
      profileFound: !!userProfile?.fullName,
      profileName: userProfile?.fullName || null,
    });
  } catch (error: unknown) {
    console.error("Chat API error:", error);

    // Handle rate limit errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes("429") || errorMessage.includes("quota")) {
      return NextResponse.json(
        { error: "AI quota exceeded. Please try again in a minute." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate resume" },
      { status: 500 }
    );
  }
}
