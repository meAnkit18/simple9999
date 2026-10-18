import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { HomeDiscovery } from "@/components/HomeDiscovery";
import { getPublicTools } from "@/lib/tools/registry";

export const metadata: Metadata = {
  title: "Simple9999 — Free Online Tools for Everyday Work",
  description:
    "Discover practical online tools for documents, productivity, and more. Start with the AI-powered Agentic Resume Builder.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Simple9999 — Free Online Tools for Everyday Work",
    description:
      "Discover practical online tools for documents, productivity, and more. Start with the AI-powered Agentic Resume Builder.",
    url: "/",
    type: "website",
  },
};

export default function HomePage() {
  const tools = getPublicTools();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="pt-20">
        {/* Compact hero */}
        <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              Free Online Tools for Everyday Work
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Discover practical tools for documents, productivity, and more. Start with our
              AI-powered resume builder and explore new tools as they arrive.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/tools"
                className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Explore Tools
              </Link>
              <Link
                href="/tools/agentic-resume-builder"
                className="rounded-full border border-border px-6 py-3 text-sm font-medium hover:bg-accent"
              >
                Build Your Resume
              </Link>
            </div>
          </div>
        </section>

        {/* Platform intro */}
        <section className="mx-auto max-w-6xl px-6 pb-8">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xl font-semibold">A growing tools platform</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Simple9999 brings together focused, useful utilities. Each tool has its own page,
              clear requirements, and a simple workflow. New tools are added as they become ready.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Currently {tools.length} tool is available. More categories and tools are on the way.
            </p>
          </div>
        </section>

        <HomeDiscovery />

        {/* How it works */}
        <section className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-2xl font-bold tracking-tight">How it works</h2>
          <ol className="mt-6 grid gap-6 md:grid-cols-3">
            <li className="rounded-2xl border border-border bg-card p-6">
              <span className="text-sm font-semibold text-primary">1. Discover</span>
              <p className="mt-2 text-sm text-muted-foreground">
                Browse the tool directory or search by name, purpose, or keyword.
              </p>
            </li>
            <li className="rounded-2xl border border-border bg-card p-6">
              <span className="text-sm font-semibold text-primary">2. Open</span>
              <p className="mt-2 text-sm text-muted-foreground">
                Open a tool and review what it does and any account requirements.
              </p>
            </li>
            <li className="rounded-2xl border border-border bg-card p-6">
              <span className="text-sm font-semibold text-primary">3. Use</span>
              <p className="mt-2 text-sm text-muted-foreground">
                Some tools work instantly; others, like the resume builder, require a free account.
              </p>
            </li>
          </ol>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-6xl px-6 pb-16">
          <h2 className="text-2xl font-bold tracking-tight">Frequently asked questions</h2>
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-semibold">Is Simple9999 free to use?</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                The available tools are free. Creating an account is required for the Agentic Resume Builder.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-semibold">How many tools are available?</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                One tool is available today. The platform is built to support many more over time.
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}