import type { ToolCategory } from "./types";

export const TOOL_CATEGORIES: ToolCategory[] = [
  {
    id: "career-documents",
    name: "Career & Documents",
    slug: "career-documents",
    description: "Tools for resumes, cover letters, and career documents.",
  },
  {
    id: "document-utilities",
    name: "Document Utilities",
    slug: "document-utilities",
    description: "Convert, extract, and manage documents.",
  },
  {
    id: "productivity",
    name: "Productivity",
    slug: "productivity",
    description: "Tools that help you get work done faster.",
  },
  {
    id: "text-processing",
    name: "Text Processing",
    slug: "text-processing",
    description: "Format, transform, and analyze text.",
  },
  {
    id: "developer-utilities",
    name: "Developer Utilities",
    slug: "developer-utilities",
    description: "Utilities for developers and engineers.",
  },
  {
    id: "image-tools",
    name: "Image Tools",
    slug: "image-tools",
    description: "Edit and optimize images.",
  },
  {
    id: "calculators",
    name: "Calculators",
    slug: "calculators",
    description: "Quick calculations and conversions.",
  },
  {
    id: "ai-tools",
    name: "AI Tools",
    slug: "ai-tools",
    description: "AI-powered assistants and generators.",
  },
];

export function getCategoryById(id: string): ToolCategory | undefined {
  return TOOL_CATEGORIES.find((c) => c.id === id);
}