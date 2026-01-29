import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserIdWithFallback } from "@/lib/auth";
import { editResume } from "@/lib/ai-service";
import Project from "@/models/Project";
import cloudinary from "@/lib/cloudinary";
import { extractText } from "@/lib/text-extract";
import { embeddings } from "@/lib/embeddings";
import { chunkText } from "@/lib/chunk-text";
import FileModel from "@/models/File";
import { updateUserProfile } from "@/lib/user-profile";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const userId = await getUserIdWithFallback();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Handle both JSON and FormData
    let projectId = "";
    let message = "";
    const attachedFiles: File[] = [];

    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      projectId = formData.get("projectId") as string;
      message = formData.get("message") as string;
      const files = formData.getAll("files");
      if (files && files.length > 0) {
        files.forEach(f => {
          if (f instanceof File) attachedFiles.push(f);
        });
      }
    } else {
      const body = await req.json();
      projectId = body.projectId;
      message = body.message;
    }

    if (!projectId || (!message && attachedFiles.length === 0)) {
      return NextResponse.json(
        { error: "projectId and message (or file) required" },
        { status: 400 }
      );
    }

    // Step 0: Process attached files inline if any
    let inlineContext = "";
    if (attachedFiles.length > 0) {
      console.log("[Chat Edit API] Processing attached files...");

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

    // Load project
    const project = await Project.findOne({ _id: projectId, userId });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Edit LaTeX using Groq (Llama 3.3)
    const { latex: updatedLatex, summary } = await editResume(
      project.latexCode || "",
      message,
      inlineContext
    );

    // Update project
    project.latexCode = updatedLatex;
    project.chatHistory = project.chatHistory || [];
    project.chatHistory.push({ role: "user", content: message });
    project.chatHistory.push({ role: "assistant", content: summary });
    project.lastModified = new Date();

    await project.save();

    return NextResponse.json({
      latexCode: updatedLatex,
      summary,
    });
  } catch (error) {
    console.error("Chat edit error:", error);
    return NextResponse.json(
      { error: "Failed to edit resume" },
      { status: 500 }
    );
  }
}
