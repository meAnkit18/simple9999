import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCategoryById } from "@/lib/tools/categories";
import { ToolAccessBadge } from "./ToolAccessBadge";
import type { ToolDefinition } from "@/lib/tools/types";

export function ToolCard({ tool }: { tool: ToolDefinition }) {
  const category = getCategoryById(tool.category);
  const Icon = tool.icon;
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <ToolAccessBadge requiresAuth={tool.requiresAuth} />
      </div>
      <h3 className="mt-4 text-lg font-semibold tracking-tight">
        <Link
          href={tool.canonicalPath}
          className="hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
        >
          {tool.name}
        </Link>
      </h3>
      {category && (
        <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {category.name}
        </p>
      )}
      <p className="mt-3 flex-1 text-sm text-muted-foreground">
        {tool.shortDescription}
      </p>
      <Link
        href={tool.canonicalPath}
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:gap-2.5 transition-all"
      >
        Open tool
        <ArrowRight className="h-4 w-4" />
      </Link>
    </article>
  );
}