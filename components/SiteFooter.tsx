import Link from "next/link";
import { Logo } from "./Logo";
import { getAvailableCategories } from "@/lib/tools/registry";
import { getCategoryById } from "@/lib/tools/categories";

export function SiteFooter() {
  const categories = getAvailableCategories();
  return (
    <footer className="border-t border-border bg-background px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <Logo className="h-6 w-6 text-primary" />
              <span className="font-bold tracking-tight">Simple9999</span>
            </div>
            <p className="mt-3 max-w-md text-sm text-muted-foreground">
              A growing collection of practical online tools for documents, productivity, and everyday work. Start with the Agentic Resume Builder.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Explore</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/tools" className="hover:text-foreground">All tools</Link></li>
              <li><Link href="/blog" className="hover:text-foreground">Blog</Link></li>
              <li><Link href="/tools/agentic-resume-builder" className="hover:text-foreground">Agentic Resume Builder</Link></li>
              <li><Link href="/about" className="hover:text-foreground">About</Link></li>
              <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Categories</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {categories.map((id) => {
                const c = getCategoryById(id);
                return c ? (
                  <li key={id}>
                    <Link href="/tools" className="hover:text-foreground">{c.name}</Link>
                  </li>
                ) : null;
              })}
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-sm text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} Simple9999. All rights reserved.</p>
          <div className="flex flex-wrap gap-6">
            <Link href="/about" className="hover:text-foreground">About</Link>
            <Link href="/contact" className="hover:text-foreground">Contact</Link>
            <Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}