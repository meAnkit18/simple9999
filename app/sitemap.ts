import type { MetadataRoute } from "next";
import { getPublicTools } from "@/lib/tools/registry";

const SITE_URL = "https://simple9999.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const publicTools = getPublicTools();
  const entries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/tools`, changeFrequency: "weekly", priority: 0.9 },
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
  return entries;
}