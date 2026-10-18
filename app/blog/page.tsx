import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { connectDB } from "@/lib/db";
import BlogPost from "@/models/BlogPost";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles, updates, and guides from Simple9999.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  let posts: any[] = [];
  try {
    await connectDB();
    posts = await BlogPost.find({ status: "published" }).sort({ createdAt: -1 }).lean();
  } catch {
    posts = [];
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="min-h-screen bg-background pt-20">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
          <p className="mt-2 text-muted-foreground">
            Articles, updates, and guides from Simple9999.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.length === 0 && (
              <p className="text-muted-foreground">No posts yet. Check back soon.</p>
            )}
            {posts.map((post) => (
              <article
                key={post._id.toString()}
                className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <h2 className="text-lg font-semibold tracking-tight">
                  <Link href={`/blog/${post.slug}`} className="hover:text-primary">
                    {post.title}
                  </Link>
                </h2>
                {post.excerpt && (
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">{post.excerpt}</p>
                )}
                <p className="mt-4 text-xs text-muted-foreground">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </article>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}