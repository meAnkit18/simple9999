import React from 'react';
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export default function PrivacyPage() {
    return (
        <>
            <SiteHeader />
            <main className="min-h-screen bg-background pt-20">
                <div className="container max-w-4xl mx-auto py-12 px-6 md:py-24">
                    <div className="space-y-4 mb-12">
                        <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
                        <p className="text-muted-foreground text-lg">Last updated: {new Date().toLocaleDateString()}</p>
                    </div>

                    <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
                        <section>
                            <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We collect information you provide directly to us, such as when you create an account, upload a resume, or communicate with us. This may include:
                            </p>
                            <ul className="list-disc pl-6 mt-2 space-y-2 text-muted-foreground">
                                <li>Personal identification information (Name, email address, phone number).</li>
                                <li>Resume data (Education, work history, skills, etc.).</li>
                                <li>Usage data (How you interact with our website).</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We use the information we collect to:
                            </p>
                            <ul className="list-disc pl-6 mt-2 space-y-2 text-muted-foreground">
                                <li>Provide, maintain, and improve our Service.</li>
                                <li>Generate and format your resume using our AI algorithms.</li>
                                <li>Send you technical notices, updates, and support messages.</li>
                                <li>Respond to your comments and questions.</li>
                                <li>Monitor and analyze trends, usage, and activities in connection with our Service.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">3. Data Security</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction. However, no internet transmission is completely secure, and we cannot guarantee the absolute security of your data.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">4. Sharing of Information</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We do not share your personal information with third parties except as described in this policy:
                            </p>
                            <ul className="list-disc pl-6 mt-2 space-y-2 text-muted-foreground">
                                <li>With vendors and service providers who need access to such information to carry out work on our behalf.</li>
                                <li>In response to a request for information if we believe disclosure is in accordance with any applicable law, regulation, or legal process.</li>
                                <li>With your consent or at your direction.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Depending on your location, you may have rights regarding your personal data, including the right to access, correct, delete, or restrict the processing of your data. To exercise these rights, please contact us.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">6. Advertising and Third-Party Cookies</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We may display advertisements provided by Google AdSense and other advertising partners. These third parties may use cookies and similar technologies to serve ads based on your prior visits to this or other websites. Google's use of advertising cookies enables it and its partners to serve ads based on your visit to our site and/or other sites on the Internet. You may opt out of personalized advertising by visiting Google's Ads Settings, or by visiting www.aboutads.info.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">7. Cookies</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">7. Changes to This Policy</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                If you have any questions about this Privacy Policy, please open an issue in our public GitHub repository.
                            </p>
                        </section>
                    </div>
                </div>
            </main>
            <SiteFooter />
        </>
    );
}
