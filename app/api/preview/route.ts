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

        const { projectId, latexCode: directLatex } = await req.json();

        let latexToPreview = directLatex;
        let project = null;

        // If latexCode is provided directly, use it (live preview mode)
        // Otherwise, fetch from the project (legacy mode)
        if (!latexToPreview) {
            if (!projectId) {
                return NextResponse.json(
                    { error: "projectId or latexCode required" },
                    { status: 400 }
                );
            }

            project = await Project.findOne({ _id: projectId, userId });
            if (!project) {
                return NextResponse.json({ error: "Project not found" }, { status: 404 });
            }

            latexToPreview = project.latexCode;
        }

        if (!latexToPreview) {
            return NextResponse.json(
                { error: "No LaTeX code to preview" },
                { status: 400 }
            );
        }

        // Generate HTML preview from LaTeX
        const html = await generatePreview(latexToPreview);

        // Optionally cache the preview if we have a project
        if (project && projectId) {
            project.previewHtml = html;
            project.lastModified = new Date();
            await project.save();
        }

        return NextResponse.json({ html });
    } catch (error) {
        console.error("Preview error:", error);
        return NextResponse.json(
            { error: "Failed to generate preview" },
            { status: 500 }
        );
    }
}
