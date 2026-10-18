"use client";

import { Search } from "lucide-react";
import { useState } from "react";

export function ToolSearch({
  value,
  onChange,
  placeholder = "Search tools by name, purpose, or keyword…",
}: {
  value: string;
  onChange: (q: string) => void;
  placeholder?: string;
}) {
  const [local, setLocal] = useState(value);

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        value={local}
        onChange={(e) => {
          setLocal(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={placeholder}
        aria-label="Search tools"
        className="w-full rounded-xl border border-input bg-background py-3 pl-10 pr-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}