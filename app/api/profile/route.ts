import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserFromToken } from "@/lib/auth";
import { extractUserProfile } from "@/lib/user-profile";

export async function GET() {
    try {
        await connectDB();

        const userId = await getUserFromToken();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        console.log("[Profile API] Extracting profile for user:", userId);

        const profile = await extractUserProfile(userId);

        if (!profile) {
            return NextResponse.json({
                hasProfile: false,
                message: "No documents uploaded yet. Upload your LinkedIn PDF, certificates, or resume to build your profile.",
            });
        }

        // Check if we have meaningful data
        const hasData = !!(
            profile.fullName ||
            profile.skills?.length > 0 ||
            profile.experience?.length > 0 ||
            profile.education?.length > 0
        );

        return NextResponse.json({
            hasProfile: hasData,
            profile: {
                fullName: profile.fullName,
                email: profile.email,
                phone: profile.phone,
                location: profile.location,
                linkedin: profile.linkedin,
                summary: profile.summary,
                skillsCount: profile.skills?.length || 0,
                experienceCount: profile.experience?.length || 0,
                educationCount: profile.education?.length || 0,
                certificationsCount: profile.certifications?.length || 0,
                projectsCount: profile.projects?.length || 0,
                skills: profile.skills || [],
                experience: profile.experience || [],
                education: profile.education || [],
            },
        });
    } catch (error) {
        console.error("Profile API error:", error);
        return NextResponse.json(
            { error: "Failed to extract profile" },
            { status: 500 }
        );
    }
}
