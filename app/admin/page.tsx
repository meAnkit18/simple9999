import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Admin</h1>
      <p className="mt-2 text-muted-foreground">Manage site content.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Link
          href="/admin/blog"
          className="rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <h2 className="text-lg font-semibold">Blog posts</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Create, edit, publish, and delete blog posts.
          </p>
        </Link>
      </div>
    </div>
  );
}