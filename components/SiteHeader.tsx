
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { Logo } from "./Logo";
import { MobileNav } from "./mobile-nav";

export function SiteHeader() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 md:px-6 py-3 md:py-4 w-full bg-background/50 backdrop-blur-md border-b border-border/10 supports-[backdrop-filter]:bg-background/20">
            <div className="flex items-center gap-2">
                <Logo className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                <Link href="/" className="text-lg md:text-xl font-bold tracking-tight hover:opacity-80 transition-opacity">
                    Simple9999.com
                </Link>
            </div>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                <Link href="/#features" className="hover:text-foreground transition-colors">Features</Link>
                <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
                <Link href="/developer" className="hover:text-foreground transition-colors">Developer</Link>
                <Link href="/docs" className="hover:text-foreground transition-colors">Docs</Link>
            </div>

            <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-4">
                    <ThemeToggle />
                    <Link
                        href="/login"
                        className="hidden sm:block text-sm font-medium hover:text-primary transition-colors"
                    >
                        Log in
                    </Link>
                    <Link
                        href="/signup"
                        className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20"
                    >
                        Get Started
                    </Link>
                </div>
                <MobileNav />
            </div>
        </nav>
    );
}
