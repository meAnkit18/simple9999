import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import { isAdmin } from "@/lib/admin";
import { slugify } from "@/lib/slug";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    await connectDB();
    const post = await BlogPost.findById(id).lean();
    if (!post) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({
      post: {
        id: post._id.toString(),
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        coverImage: post.coverImage,
        tags: post.tags,
        status: post.status,
      },
    });
  } catch (error) {
    console.error("Admin fetch blog post error:", error);
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    await connectDB();
    const body = await req.json();
    const update: Record<string, unknown> = {};
    if (body.title !== undefined) update.title = String(body.title).trim();
    if (body.slug !== undefined) update.slug = slugify(String(body.slug));
    if (body.excerpt !== undefined) update.excerpt = String(body.excerpt).trim();
    if (body.content !== undefined) update.content = String(body.content);
    if (body.coverImage !== undefined) update.coverImage = String(body.coverImage).trim();
    if (body.tags !== undefined) {
      update.tags = Array.isArray(body.tags)
        ? body.tags.map((t: unknown) => String(t).trim()).filter(Boolean)
        : String(body.tags)
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);
    }
    if (body.status !== undefined) {
      update.status = body.status === "published" ? "published" : "draft";
    }
    const post = await BlogPost.findByIdAndUpdate(id, update, { new: true }).lean();
    if (!post) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update blog post error:", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    await connectDB();
    const result = await BlogPost.findByIdAndDelete(id);
    if (!result) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete blog post error:", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}