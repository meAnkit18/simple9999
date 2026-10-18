import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ToolsDirectory } from "@/components/ToolsDirectory";

export const metadata: Metadata = {
  title: "Explore Tools",
  description: "Browse and search all available Simple9999 online tools.",
  alternates: { canonical: "/tools" },
  openGraph: {
    title: "Explore Tools — Simple9999",
    description: "Browse and search all available Simple9999 online tools.",
    url: "/tools",
    type: "website",
  },
};

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="pt-20">
        <ToolsDirectory />
      </main>
      <SiteFooter />
    </div>
  );
}