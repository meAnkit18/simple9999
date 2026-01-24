import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key"
);

async function getUserFromToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.userId as string;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  await connectDB();

  const userId = (await getUserFromToken()) || process.env.DEV_USER_ID;
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

  // ✅ 1️⃣ LOAD PROJECT FIRST
  const project = await Project.findOne({ _id: projectId, userId });

  if (!project) {
    return NextResponse.json(
      { error: "Project not found" },
      { status: 404 }
    );
  }

  // ✅ 2️⃣ ENSURE chatHistory EXISTS
  if (!Array.isArray(project.chatHistory)) {
    project.chatHistory = [];
  }

  // ✅ 3️⃣ EDIT LATEX (agent logic)
  const updatedLatex = await editLatexWithAgent({
    latex: project.latexCode,
    instruction: message,
  });

  // ✅ 4️⃣ SAVE UPDATES
  project.latexCode = updatedLatex;
  project.chatHistory.push({
    role: "user",
    content: message,
  });
  project.lastModified = Date.now();

  await project.save();

  return NextResponse.json({
    latexCode: updatedLatex,
  });
}


/**
 * AGENT: edits LaTeX safely
 */
async function editLatexWithAgent({
  latex,
  instruction,
}: {
  latex: string;
  instruction: string;
}) {
  /**
   * TEMP PLACEHOLDER
   * Replace with OpenAI/Gemini later
   */
  return `
% ---- AI EDIT APPLIED ----
% Instruction: ${instruction}

${latex}
`;
}
