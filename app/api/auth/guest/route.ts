import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { createToken } from "@/lib/auth";
import User from "@/models/User";
import { v4 as uuidv4 } from "uuid";

export async function POST() {
    try {
        await connectDB();

        const guestId = uuidv4();
        const email = `guest_${guestId}@simple9999.com`;
        const password = `guest_${guestId}`;

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create guest user
        const user = await User.create({
            name: "Guest User",
            email,
            password: hashedPassword,
        });

        // Create token
        const token = await createToken(user._id.toString());

        const response = NextResponse.json(
            { message: "Guest session created" },
            { status: 201 }
        );

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: "/",
        });

        return response;
    } catch (error) {
        console.error("Guest login error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
