"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ArrowRight, Sparkles } from "lucide-react";
import { getPublicTools, searchTools } from "@/lib/tools/registry";
import { TOOL_CATEGORIES } from "@/lib/tools/categories";
import { ToolGrid } from "./ToolGrid";
import { CategoryFilter } from "./CategoryFilter";
import { EmptyState } from "./EmptyState";

export function HomeDiscovery() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const ids = new Set(getPublicTools().map((t) => t.category));
    return TOOL_CATEGORIES.filter((c) => ids.has(c.id)).map((c) => ({ id: c.id, name: c.name }));
  }, []);

  const filtered = useMemo(() => {
    let tools = query.trim() ? searchTools(query) : getPublicTools();
    if (category) tools = tools.filter((t) => t.category === category);
    return tools;
  }, [query, category]);

  return (
    <section className="relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />
      <div className="absolute inset-0 -z-10 opacity-[0.15] [background-image:linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Online tools platform
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl">
            Free Online Tools for{" "}
            <span className="bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
              Everyday Work
            </span>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground md:text-xl">
            Discover practical tools for documents, productivity, and more. Start with our
            AI-powered resume builder and explore new tools as they arrive.
          </p>

          {/* Search */}
          <div className="relative mx-auto mt-8 max-w-2xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tools by name, purpose, or keyword…"
              aria-label="Search tools"
              className="w-full rounded-2xl border border-border bg-card/80 py-4 pl-12 pr-4 text-base shadow-sm backdrop-blur transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
            >
              Explore Tools
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/tools/agentic-resume-builder"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-medium transition hover:bg-accent"
            >
              Build Your Resume
            </Link>
          </div>
        </div>

        {/* Discovery */}
        <div className="mt-16">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-xl font-semibold tracking-tight">Available tools</h2>
            <CategoryFilter categories={categories} selected={category} onChange={setCategory} />
          </div>
          <div className="mt-8">
            {filtered.length === 0 ? (
              <EmptyState
                title="No tools found"
                description="Try a different search term or clear the filters."
                action={
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setCategory(null);
                    }}
                    className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                  >
                    Clear filters
                  </button>
                }
              />
            ) : (
              <ToolGrid tools={filtered} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}