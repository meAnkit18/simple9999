import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { HomeDiscovery } from "@/components/HomeDiscovery";

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
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="pt-20">
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