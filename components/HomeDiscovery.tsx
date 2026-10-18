"use client";

import { useMemo, useState } from "react";
import { getPublicTools, searchTools } from "@/lib/tools/registry";
import { TOOL_CATEGORIES } from "@/lib/tools/categories";
import { ToolGrid } from "./ToolGrid";
import { ToolSearch } from "./ToolSearch";
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
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Explore tools</h2>
        <p className="mt-2 text-muted-foreground">
          Find a tool by name, purpose, or keyword.
        </p>
      </div>
      <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex-1">
          <ToolSearch value={query} onChange={setQuery} />
        </div>
        <CategoryFilter categories={categories} selected={category} onChange={setCategory} />
      </div>
      <div className="mt-10">
        {filtered.length === 0 ? (
          <EmptyState
            title="No tools found"
            description="Try a different search term or browse all available tools."
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
    </section>
  );
}