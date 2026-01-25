import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserIdWithFallback } from "@/lib/auth";
import { generatePreview } from "@/lib/ai-service";
import Project from "@/models/Project";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const userId = await getUserIdWithFallback();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { projectId } = await req.json();
        if (!projectId) {
            return NextResponse.json(
                { error: "projectId required" },
                { status: 400 }
            );
        }

        const project = await Project.findOne({ _id: projectId, userId });
        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        if (!project.latexCode) {
            return NextResponse.json(
                { error: "No LaTeX code to preview" },
                { status: 400 }
            );
        }

        // Generate HTML preview from LaTeX
        const html = await generatePreview(project.latexCode);

        // Cache the preview
        project.previewHtml = html;
        project.lastModified = new Date();
        await project.save();

        return NextResponse.json({ html });
    } catch (error) {
        console.error("Preview error:", error);
        return NextResponse.json(
            { error: "Failed to generate preview" },
            { status: 500 }
        );
    }
}
