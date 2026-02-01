
import React from 'react';
import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/Footer";

export default function DisclaimerPage() {
    return (
        <>
            <SiteHeader />
            <main className="min-h-screen bg-background pt-20">
                <div className="container max-w-4xl mx-auto py-12 px-6 md:py-24">
                    <div className="space-y-4 mb-12">
                        <h1 className="text-4xl font-bold tracking-tight">Disclaimer</h1>
                        <p className="text-muted-foreground text-lg">Last updated: {new Date().toLocaleDateString()}</p>
                    </div>

                    <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
                        <section>
                            <h2 className="text-2xl font-semibold mb-4">1. General Information</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                The information provided by Simple9999 ("we," "us," or "our") on simple9999.com (the "Site") is for general informational purposes only. All information on the Site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">2. AI-Generated Content</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Our Service utilizes Artificial Intelligence (AI) to generate resume content and suggestions. While we strive for high-quality outputs, AI systems can make errors. The generated content should be reviewed and verified by you before use. We do not guarantee that the generated resumes will result in job interviews, offers, or employment.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">3. No Professional Advice</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                The Site regarding career and resume building does not contain professional career counseling or legal advice. The information is provided for general educational and informational purposes only and is not a substitute for professional advice. Accordingly, before taking any actions based upon such information, we encourage you to consult with the appropriate professionals.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">4. External Links Disclaimer</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                The Site may contain (or you may be sent through the Site) links to other websites or content belonging to or originating from third parties. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">5. Errors and Omissions</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                While we have made every attempt to ensure that the information contained in this site has been obtained from reliable sources, Simple9999 is not responsible for any errors or omissions, or for the results obtained from the use of this information.
                            </p>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
