
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import mongoose from "mongoose";
import User from "@/models/User";

// Ensure database connection
const connectDB = async () => {
    if (mongoose.connections[0].readyState) {
        return;
    }
    await mongoose.connect(process.env.MONGODB_URI as string);
};

// Debug logging helper
const log = (message: string, data?: any) => {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp}: ${message} ${data ? JSON.stringify(data) : ""}\n`;
    console.log(logMessage);
    try {
        const fs = require('fs');
        const path = require('path');
        const logPath = path.join(process.cwd(), 'auth-debug.log');
        fs.appendFileSync(logPath, logMessage);
    } catch (e) {
        console.error("Failed to write to log file:", e);
    }
};

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            log("SignIn callback started", { user_email: user.email, provider: account?.provider });
            if (account?.provider === "google") {
                try {
                    await connectDB();
                    const { name, email, image } = user;

                    log("Google User Data:", { name, email, image });

                    if (!email) {
                        log("Error: No email provided by Google");
                        return false;
                    }

                    // Check if user exists
                    let existingUser = await User.findOne({ email });

                    if (!existingUser) {
                        log("Creating new user for:", email);
                        // Create new user
                        // Note: Password is not required for OAuth users (schema updated)
                        existingUser = await User.create({
                            name: name || email.split("@")[0] || "User",
                            email,
                            profileData: { image }, // Store image if convenient, or in separate field
                            hasNewUploads: true,
                        });
                        log("User created successfully");
                    } else {
                        log("User already exists:", email);
                    }

                    // Create custom JWT token
                    // We need to dynamically import to avoid circular dependencies if any, though allow here is fine
                    const { createToken } = await import("@/lib/auth");
                    const token = await createToken(existingUser._id.toString());

                    log("Setting custom token cookie for user:", existingUser._id);

                    const { cookies } = await import("next/headers");
                    const cookieStore = await cookies();
                    cookieStore.set("token", token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        maxAge: 60 * 60 * 24 * 7, // 7 days
                        path: "/",
                    });

                    return true;
                } catch (error) {
                    log("Error signing in with Google:", error);
                    return false;
                }
            }
            return true;
        },
        async session({ session, token }) {
            // You can extend the session here if needed, e.g. adding user ID
            // For now, default session is fine.
            // But if we want to use the DB user ID, we should fetch it.
            try {
                await connectDB();
                const dbUser = await User.findOne({ email: session.user?.email });
                if (dbUser && session.user) {
                    // @ts-ignore
                    session.user.id = dbUser._id.toString();
                }
            } catch (error) {
                log("Error fetching session user:", error);
            }
            return session;
        },
        async redirect({ url, baseUrl }) {
            log("Redirect callback:", { url, baseUrl });
            // Allows relative callback URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`
            // Allows callback URLs on the same origin
            else if (new URL(url).origin === baseUrl) return url
            return baseUrl
        }
    },
    session: {
        strategy: "jwt",
    },
    debug: true,
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
