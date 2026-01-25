import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserFromToken, getUserIdWithFallback } from "@/lib/auth";
import Project from "@/models/Project";

// GET - Fetch all projects for user
export async function GET() {
    try {
        await connectDB();

        const userId = await getUserIdWithFallback();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const projects = await Project.find({ userId }).sort({ lastModified: -1 });

        return NextResponse.json({
            projects: projects.map((p) => ({
                id: p._id.toString(),
                userId: p.userId.toString(),
                name: p.name,
                latexCode: p.latexCode,
                previewHtml: p.previewHtml,
                chatHistory: p.chatHistory,
                createdAt: p.createdAt,
                lastModified: p.lastModified,
            })),
        });
    } catch (error) {
        console.error("Fetch projects error:", error);
        return NextResponse.json(
            { error: "Failed to fetch projects" },
            { status: 500 }
        );
    }
}

// POST - Create new project
export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const userId = await getUserFromToken();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { name, latexCode, previewHtml } = await request.json();

        const project = await Project.create({
            userId,
            name: name || "Untitled Resume",
            latexCode: latexCode || "",
            previewHtml: previewHtml || "",
            chatHistory: [],
            createdAt: new Date(),
            lastModified: new Date(),
        });

        return NextResponse.json(
            {
                project: {
                    id: project._id.toString(),
                    userId: project.userId.toString(),
                    name: project.name,
                    latexCode: project.latexCode,
                    previewHtml: project.previewHtml,
                    chatHistory: project.chatHistory,
                    createdAt: project.createdAt,
                    lastModified: project.lastModified,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Create project error:", error);
        return NextResponse.json(
            { error: "Failed to create project" },
            { status: 500 }
        );
    }
}

// PUT - Update project
export async function PUT(request: NextRequest) {
    try {
        await connectDB();

        const userId = await getUserFromToken();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id, name, latexCode, previewHtml, chatHistory } =
            await request.json();

        const project = await Project.findOneAndUpdate(
            { _id: id, userId },
            {
                name,
                latexCode,
                previewHtml,
                chatHistory,
                lastModified: new Date(),
            },
            { new: true }
        );

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        return NextResponse.json({
            project: {
                id: project._id.toString(),
                userId: project.userId.toString(),
                name: project.name,
                latexCode: project.latexCode,
                previewHtml: project.previewHtml,
                chatHistory: project.chatHistory,
                createdAt: project.createdAt,
                lastModified: project.lastModified,
            },
        });
    } catch (error) {
        console.error("Update project error:", error);
        return NextResponse.json(
            { error: "Failed to update project" },
            { status: 500 }
        );
    }
}

// DELETE - Delete project
export async function DELETE(request: NextRequest) {
    try {
        await connectDB();

        const userId = await getUserFromToken();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { error: "Project ID required" },
                { status: 400 }
            );
        }

        const result = await Project.findOneAndDelete({ _id: id, userId });

        if (!result) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete project error:", error);
        return NextResponse.json(
            { error: "Failed to delete project" },
            { status: 500 }
        );
    }
}
