import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import BlogPost from "@/models/BlogPost";

export async function GET() {
  try {
    await connectDB();
    const posts = await BlogPost.find({ status: "published" })
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({
      posts: posts.map((p) => ({
        id: p._id.toString(),
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        coverImage: p.coverImage,
        tags: p.tags,
        authorName: p.authorName,
        createdAt: p.createdAt,
      })),
    });
  } catch (error) {
    console.error("Fetch blog posts error:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}