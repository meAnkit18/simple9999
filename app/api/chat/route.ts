import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserIdWithFallback } from "@/lib/auth";
import { generateResume } from "@/lib/ai-service";
import { extractUserProfile, getAllUserDocumentText } from "@/lib/user-profile";
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

    // Step 2: Generate LaTeX resume using user's profile + company requirements
    const latexCode = await generateResume(message, userProfile, rawContext);

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
