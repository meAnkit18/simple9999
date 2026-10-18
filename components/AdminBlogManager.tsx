"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string[];
  status: "draft" | "published";
}

const emptyForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  tags: "",
  status: "draft" as "draft" | "published",
};

export function AdminBlogManager({ initialPosts }: { initialPosts: Post[] }) {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function startNew() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  }

  async function startEdit(post: Post) {
    setEditingId(post.id);
    setError("");
    // Fetch full post (list may omit content)
    try {
      const res = await fetch(`/api/admin/blog/${post.id}`);
      const data = await res.json();
      const p = data.post || post;
      setForm({
        title: p.title || post.title,
        slug: p.slug || post.slug,
        excerpt: p.excerpt || "",
        content: p.content || "",
        coverImage: p.coverImage || "",
        tags: (p.tags || []).join(", "),
        status: p.status || post.status,
      });
    } catch {
      setForm({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        coverImage: post.coverImage,
        tags: post.tags.join(", "),
        status: post.status,
      });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt,
        content: form.content,
        coverImage: form.coverImage,
        tags: form.tags,
        status: form.status,
      };
      const url = editingId ? `/api/admin/blog/${editingId}` : "/api/admin/blog";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      // Refresh list
      const listRes = await fetch("/api/admin/blog");
      const listData = await listRes.json();
      if (listData.posts) {
        setPosts(
          listData.posts.map((p: any) => ({
            id: p.id,
            title: p.title,
            slug: p.slug,
            excerpt: p.excerpt || "",
            content: "",
            coverImage: "",
            tags: p.tags || [],
            status: p.status,
          }))
        );
      }
      startNew();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this post?")) return;
    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setPosts((prev) => prev.filter((p) => p.id !== id));
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed");
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">
          {editingId ? "Edit post" : "New post"}
        </h2>
        {error && (
          <div className="rounded bg-destructive/15 p-3 text-sm text-destructive">{error}</div>
        )}
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            className="w-full rounded border border-input bg-background p-2"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Slug (optional)</label>
          <input
            className="w-full rounded border border-input bg-background p-2"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Excerpt</label>
          <textarea
            className="w-full rounded border border-input bg-background p-2"
            rows={2}
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Cover image URL</label>
          <input
            className="w-full rounded border border-input bg-background p-2"
            value={form.coverImage}
            onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
          <input
            className="w-full rounded border border-input bg-background p-2"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Content (Markdown)</label>
          <textarea
            className="w-full rounded border border-input bg-background p-2 font-mono text-sm"
            rows={12}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            className="w-full rounded border border-input bg-background p-2"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as "draft" | "published" })}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            {loading ? "Saving…" : editingId ? "Update" : "Create"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={startNew}
              className="rounded border border-border px-4 py-2 text-sm"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* List */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">All posts</h2>
        {posts.length === 0 && <p className="text-muted-foreground">No posts yet.</p>}
        {posts.map((post) => (
          <div
            key={post.id}
            className="flex items-center justify-between rounded-xl border border-border bg-card p-4"
          >
            <div>
              <p className="font-medium">{post.title}</p>
              <p className="text-xs text-muted-foreground">
                {post.slug} · {post.status}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => startEdit(post)}
                className="rounded border border-border px-3 py-1 text-sm"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(post.id)}
                className="rounded border border-destructive/50 px-3 py-1 text-sm text-destructive"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}