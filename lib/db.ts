import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("Please define MONGODB_URI in .env.local");
}

interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    // eslint-disable-next-line no-var
    var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
    global.mongoose = cached;
}

export async function connectDB() {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        const opts = {
            serverSelectionTimeoutMS: 10000, // 10 seconds
            socketTimeoutMS: 45000, // 45 seconds
            family: 4, // Force IPv4
        };

        console.log("Connecting to MongoDB...");
        cached.promise = mongoose.connect(MONGODB_URI!, opts)
            .then((mongoose) => {
                console.log("MongoDB connected successfully");
                return mongoose;
            })
            .catch((err) => {
                console.error("MongoDB connection error:", err);
                cached.promise = null; // Reset on error so we can retry
                throw err;
            });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}