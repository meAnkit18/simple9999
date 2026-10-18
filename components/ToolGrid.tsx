import { ToolCard } from "./ToolCard";
import type { ToolDefinition } from "@/lib/tools/types";

export function ToolGrid({ tools }: { tools: ToolDefinition[] }) {
  if (tools.length === 0) return null;
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {tools.map((tool) => (
        <ToolCard key={tool.id} tool={tool} />
      ))}
    </div>
  );
}