import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ToolLandingLayout } from "@/components/ToolLandingLayout";
import { getToolBySlug } from "@/lib/tools/registry";

const tool = getToolBySlug("agentic-resume-builder");

export const metadata: Metadata = {
  title: "Agentic Resume Builder",
  description: tool?.metadata.description ?? "",
  alternates: { canonical: "/tools/agentic-resume-builder" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Agentic Resume Builder",
    description: tool?.metadata.description ?? "",
    url: "/tools/agentic-resume-builder",
    type: "website",
  },
};

export default function AgenticResumeBuilderLandingPage() {
  if (!tool) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.longDescription,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    url: "https://simple9999.com/tools/agentic-resume-builder",
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="pt-20">
        <ToolLandingLayout tool={tool}>
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold">What it does</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                <li>Ingests PDFs and documents to build your professional profile.</li>
                <li>Analyzes a target job description.</li>
                <li>Generates a tailored, ATS-optimized resume.</li>
                <li>Exports a professional PDF.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-semibold">How it works</h2>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
                <li>Create a free account and sign in.</li>
                <li>Upload your resume or supporting documents.</li>
                <li>Paste a job description and generate a tailored resume.</li>
                <li>Review, edit, and download your PDF.</li>
              </ol>
            </section>
            <section>
              <h2 className="text-xl font-semibold">Requirements</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                An account is required. Your documents and generated resumes are private to your account.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold">Frequently asked questions</h2>
              <div className="mt-3 space-y-4">
                <div>
                  <h3 className="font-medium">Can I use it without an account?</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    No. The resume builder requires a signed-in account to protect your documents.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">What file types are supported?</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    PDF uploads are supported for document ingestion.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </ToolLandingLayout>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </main>
      <SiteFooter />
    </div>
  );
}