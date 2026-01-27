import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserFromToken } from "@/lib/auth";
import User from "@/models/User";

export async function GET() {
    try {
        await connectDB();

        const userId = await getUserFromToken();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        console.log("[Profile API] Extracting profile for user:", userId);

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const profile = user.profileData;

        // Optimization: We no longer extract on read. Extraction happens on upload/delete.
        // If profile is missing but user has uploads, it might be processing or failed.
        if (!profile && user.hasNewUploads) {
            console.log("[Profile API] Profile missing but marked as having new uploads. Triggering background update.");
            // Fire and forget update if needed, but ideally this is handled by upload/delete
            // updateUserProfile(userId); 
        }

        console.log("[Profile API] Returning cached profile.");

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
