import type { ReactNode } from "react";
import type { ToolDefinition } from "@/lib/tools/types";
import { getCategoryById } from "@/lib/tools/categories";
import { ToolAccessBadge } from "./ToolAccessBadge";
import { AuthAwareToolLink } from "./AuthAwareToolLink";

export function ToolLandingLayout({
  tool,
  children,
}: {
  tool: ToolDefinition;
  children: ReactNode;
}) {
  const category = getCategoryById(tool.category);
  const Icon = tool.icon;
  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-6 w-6" />
          </div>
          <div>
            {category && (
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {category.name}
              </p>
            )}
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{tool.name}</h1>
          </div>
        </div>
        <div className="mt-4">
          <ToolAccessBadge requiresAuth={tool.requiresAuth} />
        </div>
        <p className="mt-6 text-lg text-muted-foreground">{tool.longDescription}</p>
        <div className="mt-8">
          <AuthAwareToolLink
            tool={tool}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            {tool.requiresAuth ? "Build Your Resume" : "Open tool"}
          </AuthAwareToolLink>
        </div>
      </section>
      <section className="mx-auto max-w-4xl px-6 pb-16">{children}</section>
    </div>
  );
}