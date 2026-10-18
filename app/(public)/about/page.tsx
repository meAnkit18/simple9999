import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Simple9999, a growing platform of practical online tools.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="min-h-screen bg-background pt-20">
        <div className="container mx-auto max-w-4xl px-6 py-12 md:py-24">
          <div className="mb-12 space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">About Simple9999</h1>
            <p className="text-lg text-muted-foreground">
              Simple9999 is a growing collection of practical online tools designed to help you
              get everyday work done faster.
            </p>
          </div>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Our mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                We believe useful tools should be simple, fast, and accessible. Simple9999 brings
                focused utilities into one place so you can discover what you need without
                installing software or creating accounts for every task.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">What we offer</h2>
              <p className="text-muted-foreground leading-relaxed">
                Today, Simple9999 includes the Agentic Resume Builder, an AI-powered tool that
                helps you create job-specific, ATS-optimized resumes from your documents and a
                target job description. More tools across documents, productivity, text, and
                developer utilities are on the way.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">How it works</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Browse the tool directory or search by name, purpose, or keyword.</li>
                <li>Open a tool to see what it does and any account requirements.</li>
                <li>Use the tool directly, or sign in where an account is required.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Privacy and your data</h2>
              <p className="text-muted-foreground leading-relaxed">
                We take your privacy seriously. Tools that require an account keep your documents
                and generated content scoped to your account. See our Privacy Policy for details.
              </p>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}