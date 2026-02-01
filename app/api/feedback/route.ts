
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Feedback from "@/lib/models/Feedback";

export async function POST(req: Request) {
    try {
        await connectDB();
        const { email, message } = await req.json();

        if (!email || !message) {
            return NextResponse.json(
                { error: "Email and message are required" },
                { status: 400 }
            );
        }

        const feedback = await Feedback.create({ email, message });

        return NextResponse.json(
            { message: "Feedback submitted successfully", feedback },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error submitting feedback:", error);
        return NextResponse.json(
            { error: "Failed to submit feedback" },
            { status: 500 }
        );
    }
}
