import Link from "next/link";
import { getUserFromToken } from "@/lib/auth";
import { Logo } from "./Logo";
import { ThemeToggle } from "./theme-toggle";
import { MobileNav } from "./mobile-nav";
import { AccountMenu } from "./AccountMenu";

export async function SiteHeader() {
  const userId = await getUserFromToken();
  const isAuthed = !!userId;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between gap-4 border-b border-border/10 bg-background/50 px-4 py-3 backdrop-blur-md supports-[backdrop-filter]:bg-background/20 md:px-6">
      <div className="flex items-center gap-2">
        <Logo className="h-6 w-6 text-primary md:h-8 md:w-8" />
        <Link href="/" className="text-lg font-bold tracking-tight hover:opacity-80">
          Simple9999
        </Link>
      </div>

      <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <Link href="/tools" className="hover:text-foreground">Explore Tools</Link>
        <Link href="/tools" className="hover:text-foreground">Categories</Link>
        <form action="/tools" method="get" className="hidden lg:block">
          <input
            name="q"
            placeholder="Search tools…"
            className="rounded-full border border-border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </form>
      </nav>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        {isAuthed ? (
          <AccountMenu />
        ) : (
          <div className="hidden items-center gap-3 sm:flex">
            <Link href="/login" className="text-sm font-medium hover:text-primary">
              Sign in
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Get started
            </Link>
          </div>
        )}
        <MobileNav isAuthenticated={isAuthed} />
      </div>
    </header>
  );
}