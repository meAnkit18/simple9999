
import React from 'react';
import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/Footer";

export default function TermsPage() {
    return (
        <>
            <SiteHeader />
            <main className="min-h-screen bg-background pt-20">
                <div className="container max-w-4xl mx-auto py-12 px-6 md:py-24">
                    <div className="space-y-4 mb-12">
                        <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
                        <p className="text-muted-foreground text-lg">Last updated: {new Date().toLocaleDateString()}</p>
                    </div>

                    <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
                        <section>
                            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                By accessing and using Simple9999 ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service. These Terms constitute a legally binding agreement between you and Simple9999.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Simple9999 provides an AI-powered resume generation and optimization platform. We offer tools to help users create, format, and improve their resumes using artificial intelligence suitable for various job applications. We reserve the right to modify, suspend, or discontinue any part of the Service at any time.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                To access certain features, you may be required to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate and complete information during registration.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">4. User Content</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                You retain ownership of the content you submit to the Service, including your personal information and resume details ("User Content"). By submitting User Content, you grant Simple9999 a worldwide, non-exclusive license to use, reproduce, and modify such content solely for the purpose of providing the Service to you.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">5. Prohibited Conduct</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                You agree not to engage in any of the following prohibited activities:
                            </p>
                            <ul className="list-disc pl-6 mt-2 space-y-2 text-muted-foreground">
                                <li>Using the Service for any illegal purpose or in violation of any local, state, national, or international law.</li>
                                <li>Harassing, threatening, or defrauding other users.</li>
                                <li>Interfering with or damaging the operation of the Service.</li>
                                <li>Attempting to access any data not intended for you.</li>
                                <li>Reverse engineering or attempting to extract the source code of the Service.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">6. Disclaimer of Warranties</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                The Service is provided on an "as is" and "as available" basis. Simple9999 makes no warranties, expressed or implied, regarding the accuracy, reliability, or completeness of the content or the Service's availability. We do not guarantee that your resume will result in job offers or interviews.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                In no event shall Simple9999 be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                If you have any questions about these Terms, please contact us at support@simple9999.com.
                            </p>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
