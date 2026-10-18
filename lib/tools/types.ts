import type { LucideIcon } from "lucide-react";

export type ToolStatus = "draft" | "active" | "disabled";
export type ToolVisibility = "public" | "unlisted";

export interface ToolMetadata {
  title: string;
  description: string;
  /** Optional Open Graph image path. */
  image?: string;
}

export interface ToolCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface ToolDefinition {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  category: string; // category id
  icon: LucideIcon;
  status: ToolStatus;
  requiresAuth: boolean;
  visibility: ToolVisibility;
  keywords: string[];
  /** Canonical public URL for this tool's landing page. */
  canonicalPath: string;
  /** Where the tool workspace lives (may be protected). */
  entryPath: string;
  metadata: ToolMetadata;
  /** Optional capability flags for future tool-specific behavior. */
  capabilities?: string[];
}

export interface ToolSearchResult {
  tool: ToolDefinition;
  score: number;
}