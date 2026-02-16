
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

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "google") {
                try {
                    await connectDB();
                    const { name, email, image } = user;

                    // Check if user exists
                    let existingUser = await User.findOne({ email });

                    if (!existingUser) {
                        // Create new user
                        // Note: Password is not required for OAuth users (schema updated)
                        await User.create({
                            name,
                            email,
                            profileData: { image }, // Store image if convenient, or in separate field
                            hasNewUploads: true,
                        });
                    }
                    return true;
                } catch (error) {
                    console.error("Error signing in with Google:", error);
                    return false;
                }
            }
            return true;
        },
        async session({ session }) {
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
                console.error("Error fetching session user:", error);
            }
            return session;
        },
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
