import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key");

async function getUserFromToken() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload.userId as string;
    } catch {
        return null;
    }
}

// GET - Fetch user profile
export async function GET() {
    const userId = await getUserFromToken();

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectDB();
        const user = await User.findById(userId).select("-password");

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                profileData: user.profileData || "",
            }
        });
    } catch (error) {
        console.error("Fetch profile error:", error);
        return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
    }
}

// PUT - Update user profile data
export async function PUT(request: NextRequest) {
    const userId = await getUserFromToken();

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectDB();
        const { profileData } = await request.json();

        const user = await User.findByIdAndUpdate(
            userId,
            { profileData },
            { new: true }
        ).select("-password");

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                profileData: user.profileData || "",
            }
        });
    } catch (error) {
        console.error("Update profile error:", error);
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }
}
