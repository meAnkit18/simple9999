import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Simple9999.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="min-h-screen bg-background pt-20">
        <div className="container mx-auto max-w-4xl px-6 py-12 md:py-24">
          <div className="mb-12 space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">Contact</h1>
            <p className="text-lg text-muted-foreground">
              We welcome feedback, bug reports, and feature requests.
            </p>
          </div>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Support</h2>
              <p className="text-muted-foreground leading-relaxed">
                The best way to reach us is through our public GitHub repository. Please open an
                issue for bugs, questions, or suggestions.
              </p>
              <p className="mt-4">
                <Link
                  href="https://github.com/meAnkit18/simple9999/issues"
                  className="text-primary font-medium hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open a GitHub issue
                </Link>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Source code</h2>
              <p className="text-muted-foreground leading-relaxed">
                Simple9999 is open source. You can review the code, report issues, or contribute
                on GitHub.
              </p>
              <p className="mt-4">
                <Link
                  href="https://github.com/meAnkit18/simple9999"
                  className="text-primary font-medium hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on GitHub
                </Link>
              </p>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}