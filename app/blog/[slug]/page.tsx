import type { Metadata } from "next";

export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { connectDB } from "@/lib/db";
import BlogPost from "@/models/BlogPost";

async function getPost(slug: string) {
  try {
    await connectDB();
    const post = await BlogPost.findOne({ slug, status: "published" }).lean();
    return post;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.excerpt || post.title,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      url: `/blog/${post.slug}`,
      type: "article",
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="min-h-screen bg-background pt-20">
        <article className="mx-auto max-w-3xl px-6 py-12">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{post.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {new Date(post.createdAt).toLocaleDateString()}
            {post.authorName ? ` · ${post.authorName}` : ""}
          </p>
          {post.coverImage && (
            <img
              src={post.coverImage}
              alt={post.title}
              className="mt-6 w-full rounded-2xl border border-border object-cover"
            />
          )}
          {post.tags?.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
          <div className="prose prose-neutral dark:prose-invert mt-8 max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}