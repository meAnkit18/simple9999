import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/editor", "/email-editor", "/api"],
      },
    ],
    sitemap: "https://simple9999.com/sitemap.xml",
    host: "https://simple9999.com",
  };
}