import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserIdWithFallback } from "@/lib/auth";
import { editResume } from "@/lib/ai-service";
import Project from "@/models/Project";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const userId = await getUserIdWithFallback();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId, message } = await req.json();
    if (!projectId || !message) {
      return NextResponse.json(
        { error: "projectId and message required" },
        { status: 400 }
      );
    }

    // Load project
    const project = await Project.findOne({ _id: projectId, userId });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Edit LaTeX using Groq (Llama 3.3)
    const { latex: updatedLatex, summary } = await editResume(
      project.latexCode || "",
      message
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
