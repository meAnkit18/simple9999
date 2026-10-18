import { FileText } from "lucide-react";
import type { ToolDefinition } from "./types";
import { getCategoryById } from "./categories";

export const TOOL_REGISTRY: ToolDefinition[] = [
  {
    id: "agentic-resume-builder",
    slug: "agentic-resume-builder",
    name: "Agentic Resume Builder",
    shortDescription:
      "Create a job-specific, ATS-optimized resume with AI from your documents and a target job description.",
    longDescription:
      "Agentic Resume Builder helps you turn scattered documents into a tailored resume. Upload PDFs, paste a job description, and let the AI generate and refine an ATS-friendly resume, then export a professional PDF.",
    category: "career-documents",
    icon: FileText,
    status: "active",
    requiresAuth: true,
    visibility: "public",
    keywords: [
      "resume builder",
      "ai resume",
      "ats resume",
      "cv builder",
      "job description",
      "resume generator",
    ],
    canonicalPath: "/tools/agentic-resume-builder",
    entryPath: "/dashboard",
    metadata: {
      title: "Agentic Resume Builder — Simple9999",
      description:
        "Build a job-specific, ATS-optimized resume with AI. Upload your documents, target a job description, and download a professional PDF.",
    },
    capabilities: ["document-ingestion", "ai-generation", "ats-analysis", "pdf-export"],
  },
];

// Single source of truth helpers.

export function getAllTools(): ToolDefinition[] {
  return TOOL_REGISTRY;
}

export function getPublicTools(): ToolDefinition[] {
  return TOOL_REGISTRY.filter(
    (t) => t.status === "active" && t.visibility === "public"
  );
}

export function getToolById(id: string): ToolDefinition | undefined {
  return TOOL_REGISTRY.find((t) => t.id === id);
}

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return TOOL_REGISTRY.find((t) => t.slug === slug);
}

export function isToolPubliclyDiscoverable(tool: ToolDefinition): boolean {
  return tool.status === "active" && tool.visibility === "public";
}

export function searchTools(query: string): ToolDefinition[] {
  const q = query.trim().toLowerCase();
  if (!q) return getPublicTools();
  return getPublicTools().filter((tool) => {
    const haystack = [
      tool.name,
      tool.shortDescription,
      tool.longDescription,
      getCategoryById(tool.category)?.name ?? "",
      ...tool.keywords,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}

export function getCategoriesWithTools(): { category: ReturnType<typeof getCategoryById>; tools: ToolDefinition[] }[] {
  const publicTools = getPublicTools();
  const byCategory = new Map<string, ToolDefinition[]>();
  for (const tool of publicTools) {
    const list = byCategory.get(tool.category) ?? [];
    list.push(tool);
    byCategory.set(tool.category, list);
  }
  const result: { category: ReturnType<typeof getCategoryById>; tools: ToolDefinition[] }[] = [];
  for (const [categoryId, tools] of byCategory.entries()) {
    const category = getCategoryById(categoryId);
    if (category) result.push({ category, tools });
  }
  return result;
}

export function getAvailableCategories(): string[] {
  return Array.from(new Set(getPublicTools().map((t) => t.category)));
}