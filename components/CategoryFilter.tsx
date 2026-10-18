"use client";

export function CategoryFilter({
  categories,
  selected,
  onChange,
}: {
  categories: { id: string; name: string }[];
  selected: string | null;
  onChange: (id: string | null) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
      <button
        type="button"
        onClick={() => onChange(null)}
        className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
          selected === null
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-background text-muted-foreground hover:text-foreground"
        }`}
      >
        All
      </button>
      {categories.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => onChange(c.id)}
          className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
            selected === c.id
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-background text-muted-foreground hover:text-foreground"
          }`}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
}