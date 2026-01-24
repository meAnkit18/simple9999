import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import { getUserContextFromPrompt } from "@/lib/user-context";

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

  const userId = await getUserFromToken();

  // DEV MODE FALLBACK (keep this for now)
  const finalUserId = userId || process.env.DEV_USER_ID;
  if (!finalUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { message } = await req.json();
  if (!message) {
    return NextResponse.json({ error: "Message required" }, { status: 400 });
  }

  // 1️⃣ Get relevant user context (vector search)
  const userContext = await getUserContextFromPrompt(
    finalUserId,
    message
  );

  // 2️⃣ Generate LaTeX (TEMP logic – replace with LLM)
  const latexCode = generateLatexResume(message, userContext);

  // 3️⃣ Create Project (this IS the resume)
  const project = await Project.create({
    userId: finalUserId,
    name: "AI Generated Resume",
    latexCode,
    previewHtml: "",
    chatHistory: [
      { role: "user", content: message }
    ],
    createdAt: Date.now(),
    lastModified: Date.now(),
  });

  return NextResponse.json({
    projectId: project._id.toString(),
  });
}

function generateLatexResume(prompt: string, context: string) {
  return `
\\documentclass{article}
\\begin{document}

\\section*{Resume}
Generated for:
${prompt}

\\section*{Relevant Experience}
${context || "No relevant documents found"}

\\end{document}
`;
}
