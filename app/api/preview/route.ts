import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserIdWithFallback } from "@/lib/auth";
import { compileLatex } from "@/lib/tectonic-client"; // Use the new client
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

        // Compile LaTeX to PDF using Tectonic service
        const pdfBuffer = await compileLatex(latexToPreview);

        // Optionally update the timestamp if we have a project
        // Note: We are NO LONGER saving previewHtml as it is now a PDF generated on demand
        if (project && projectId) {
            project.lastModified = new Date();
            await project.save();
        }

        // Return the PDF
        return new NextResponse(new Uint8Array(pdfBuffer), {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": "inline; filename=preview.pdf",
            },
        });

    } catch (error) {
        console.error("Preview error:", error);
        // If it's a compilation error, it might be useful to return the details
        const errorMessage = error instanceof Error ? error.message : "Failed to generate preview";

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
