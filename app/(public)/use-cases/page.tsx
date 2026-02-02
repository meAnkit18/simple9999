
import { UseCasesSection } from "@/components/UseCasesSection";
import React from 'react';
import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/Footer";

export default function UseCasesPage() {
    return (
        <>
            <SiteHeader />
            <main className="min-h-screen bg-background pt-20">
                <UseCasesSection />
            </main>
            <Footer />
        </>
    );
}
