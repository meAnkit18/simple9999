import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserIdWithFallback } from "@/lib/auth";
import File from "@/models/File";
import cloudinary from "@/lib/cloudinary";
import { updateUserProfile } from "@/lib/user-profile";

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ fileId: string }> }
) {
    try {
        await connectDB();

        const userId = await getUserIdWithFallback();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { fileId } = await params;

        // Find the file and verify ownership
        const file = await File.findOne({ _id: fileId, userId });

        if (!file) {
            return NextResponse.json({ error: "File not found" }, { status: 404 });
        }

        // Delete from Cloudinary
        if (file.cloudinaryUrl) {
            try {
                // Extract public_id from URL
                // Example: https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg
                // public_id: sample
                const urlParts = file.cloudinaryUrl.split("/");
                const filenameWithExtension = urlParts[urlParts.length - 1];
                const publicId = filenameWithExtension.split(".")[0];

                // We might need to handle folders if they are used, but for now assuming root or simple structure
                // If the upload was done without specifying a folder/public_id, it's usually just the random string

                await cloudinary.uploader.destroy(publicId);
            } catch (cloudinaryError) {
                console.error("Cloudinary deletion error:", cloudinaryError);
                // Continue to delete from DB even if Cloudinary fails, to keep DB clean
            }
        }

        // Delete from MongoDB
        await File.deleteOne({ _id: fileId });

        // Update User profile to indicate potential change in data
        // await User.findByIdAndUpdate(userId, { hasNewUploads: true });

        // Trigger profile update immediately
        await updateUserProfile(userId);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete file error:", error);
        return NextResponse.json(
            { error: "Failed to delete file" },
            { status: 500 }
        );
    }
}
