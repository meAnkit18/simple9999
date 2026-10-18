import { connectDB } from "@/lib/db";

export const dynamic = "force-dynamic";
import BlogPost from "@/models/BlogPost";
import { AdminBlogManager } from "@/components/AdminBlogManager";

export default async function AdminBlogPage() {
  await connectDB();
  const posts = await BlogPost.find().sort({ createdAt: -1 }).lean();
  const initial = posts.map((p) => ({
    id: p._id.toString(),
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt || "",
    content: p.content || "",
    coverImage: p.coverImage || "",
    tags: p.tags || [],
    status: p.status as "draft" | "published",
  }));
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Manage Blog Posts</h1>
      <p className="mt-2 text-muted-foreground">
        Create and manage blog posts. Published posts appear on the public blog.
      </p>
      <div className="mt-8">
        <AdminBlogManager initialPosts={initial} />
      </div>
    </div>
  );
}