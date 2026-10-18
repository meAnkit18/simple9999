import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import { isAdmin, getCurrentUser } from "@/lib/admin";
import { slugify } from "@/lib/slug";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    const posts = await BlogPost.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({
      posts: posts.map((p) => ({
        id: p._id.toString(),
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        status: p.status,
        tags: p.tags,
        authorName: p.authorName,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      })),
    });
  } catch (error) {
    console.error("Admin fetch blog posts error:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    const user = await getCurrentUser();
    const body = await req.json();
    const title = String(body.title || "").trim();
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    const baseSlug = slugify(body.slug || title);
    let slug = baseSlug;
    let i = 1;
    while (await BlogPost.exists({ slug })) {
      slug = `${baseSlug}-${i++}`;
    }
    const post = await BlogPost.create({
      title,
      slug,
      excerpt: String(body.excerpt || "").trim(),
      content: String(body.content || ""),
      coverImage: String(body.coverImage || "").trim(),
      tags: Array.isArray(body.tags)
        ? body.tags.map((t: unknown) => String(t).trim()).filter(Boolean)
        : String(body.tags || "")
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
      status: body.status === "published" ? "published" : "draft",
      authorName: user?.name || "Admin",
    });
    return NextResponse.json(
      {
        post: {
          id: post._id.toString(),
          title: post.title,
          slug: post.slug,
          status: post.status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create blog post error:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}