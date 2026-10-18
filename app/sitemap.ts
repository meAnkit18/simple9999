import type { MetadataRoute } from "next";
import { getPublicTools } from "@/lib/tools/registry";
import { connectDB } from "@/lib/db";
import BlogPost from "@/models/BlogPost";

const SITE_URL = "https://simple9999.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const publicTools = getPublicTools();
  const entries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/tools`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, changeFrequency: "monthly", priority: 0.3 },
  ];
  for (const tool of publicTools) {
    entries.push({
      url: `${SITE_URL}${tool.canonicalPath}`,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }
  try {
    await connectDB();
    const posts = await BlogPost.find({ status: "published" }).lean();
    for (const post of posts) {
      entries.push({
        url: `${SITE_URL}/blog/${post.slug}`,
        changeFrequency: "weekly",
        priority: 0.7,
        lastModified: post.updatedAt || post.createdAt,
      });
    }
  } catch {
    // ignore sitemap DB errors
  }
  return entries;
}