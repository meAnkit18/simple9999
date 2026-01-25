import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserIdWithFallback } from "@/lib/auth";
import { generateResume } from "@/lib/ai-service";
import { getUserContextFromPrompt } from "@/lib/user-context";
import Project from "@/models/Project";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const userId = await getUserIdWithFallback();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message } = await req.json();
    if (!message) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    // Get relevant context from user's uploaded documents
    let userContext = "";
    try {
      userContext = await getUserContextFromPrompt(userId, message);
    } catch (err) {
      console.warn("Context retrieval failed, proceeding without:", err);
    }

    // Generate LaTeX resume using Groq (Llama 3.3)
    const latexCode = await generateResume(message, userContext);

    // Create project with the generated resume
    const project = await Project.create({
      userId,
      name: `Resume: ${message.slice(0, 50)}...`,
      latexCode,
      previewHtml: "",
      chatHistory: [{ role: "user", content: message }],
      createdAt: new Date(),
      lastModified: new Date(),
    });

    return NextResponse.json({
      projectId: project._id.toString(),
      latexCode,
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
