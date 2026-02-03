
import { NextRequest, NextResponse } from "next/server";
import { checkAtsCompatibility } from "@/lib/ai-service";
// @ts-ignore
import { extractText } from "@/lib/text-extract";

// Extend the Request type to include formData()
export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const jobDescription = formData.get("jobDescription") as string;

        if (!file) {
            return NextResponse.json(
                { error: "No resume file uploaded" },
                { status: 400 }
            );
        }

        if (!jobDescription || jobDescription.trim().length === 0) {
            return NextResponse.json(
                { error: "Job description is required" },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Extract text from PDF
        let resumeText = "";
        try {
            // Use reused text extraction logic
            resumeText = await extractText(buffer, "application/pdf");
        } catch (err) {
            console.error("PDF Parsing error:", err);
            return NextResponse.json(
                { error: "Failed to parse PDF file. Ensure it is not corrupted." },
                { status: 500 }
            );
        }

        if (!resumeText || resumeText.trim().length < 50) {
            return NextResponse.json(
                { error: "Could not extract enough text from the resume. Is it an image PDF?" },
                { status: 400 }
            );
        }

        // Analyze with LLM
        const result = await checkAtsCompatibility(resumeText, jobDescription);

        return NextResponse.json({ success: true, result });

    } catch (err) {
        console.error("ATS API Error:", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
