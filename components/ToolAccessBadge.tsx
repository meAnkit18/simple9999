import { Lock, Globe } from "lucide-react";

export function ToolAccessBadge({ requiresAuth }: { requiresAuth: boolean }) {
  if (requiresAuth) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
        <Lock className="h-3 w-3" />
        Account required
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
      <Globe className="h-3 w-3" />
      Free to use
    </span>
  );
}