"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getPublicTools, searchTools } from "@/lib/tools/registry";
import { TOOL_CATEGORIES } from "@/lib/tools/categories";
import { ToolGrid } from "./ToolGrid";
import { ToolSearch } from "./ToolSearch";
import { CategoryFilter } from "./CategoryFilter";
import { EmptyState } from "./EmptyState";

function ToolsDirectoryInner() {
  const params = useSearchParams();
  const initialQuery = params.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
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
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Explore Tools</h1>
      <p className="mt-2 text-muted-foreground">
        Browse and search all available tools.
      </p>
      <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex-1">
          <ToolSearch value={query} onChange={setQuery} />
        </div>
        <CategoryFilter categories={categories} selected={category} onChange={setCategory} />
      </div>
      <div className="mt-10">
        {filtered.length === 0 ? (
          <EmptyState
            title="No tools match your search"
            description="Try a different keyword or clear the filters to see all tools."
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
  );
}

export function ToolsDirectory() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-6xl px-6 py-12">Loading…</div>}>
      <ToolsDirectoryInner />
    </Suspense>
  );
}