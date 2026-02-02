
import React from 'react';
import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/Footer";
import { BookOpen, Sparkles, FileText, Settings, Download, Import } from "lucide-react";

export default function DocsPage() {
    return (
        <>
            <SiteHeader />
            <main className="min-h-screen bg-background pt-24 pb-16">
                <div className="container max-w-5xl mx-auto px-6">
                    <div className="mb-12 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Documentation</h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Everything you need to know about using Simple9999 to build your perfect resume.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-12">
                        {/* Sidebar Navigation (Simple) */}
                        <aside className="hidden lg:block space-y-2 sticky top-32 h-fit">
                            <p className="font-semibold mb-4 text-foreground/80 lowercase tracking-wide">Contents</p>
                            <nav className="flex flex-col space-y-1 text-sm text-muted-foreground">
                                <a href="#introduction" className="hover:text-primary transition-colors py-1">Introduction</a>
                                <a href="#getting-started" className="hover:text-primary transition-colors py-1">Getting Started</a>
                                <a href="#importing-data" className="hover:text-primary transition-colors py-1">Importing Data</a>
                                <a href="#using-ai" className="hover:text-primary transition-colors py-1">Using the AI Agent</a>
                                <a href="#customization" className="hover:text-primary transition-colors py-1">Customization</a>
                                <a href="#exporting" className="hover:text-primary transition-colors py-1">Exporting</a>
                            </nav>
                        </aside>

                        {/* Main Content */}
                        <div className="space-y-16">

                            {/* Introduction */}
                            <section id="introduction" className="scroll-mt-32">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                        <BookOpen className="w-6 h-6" />
                                    </div>
                                    <h2 className="text-3xl font-bold">Introduction</h2>
                                </div>
                                <div className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground">
                                    <p className="leading-relaxed">
                                        Simple9999 is an <strong>agentic resume builder</strong> designed to make resume creation effortless. Unlike traditional builders where you manually fill in endless forms, Simple9999 uses advanced AI to understand your career history and generate a tailored resume for you.
                                    </p>
                                    <p className="leading-relaxed mt-4">
                                        Our goal is to help you stand out in the job market by providing formatting that beats Applicant Tracking Systems (ATS) and content that impresses human recruiters.
                                    </p>
                                </div>
                            </section>

                            {/* Getting Started */}
                            <section id="getting-started" className="scroll-mt-32">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                        <Sparkles className="w-6 h-6" />
                                    </div>
                                    <h2 className="text-3xl font-bold">Getting Started</h2>
                                </div>
                                <div className="space-y-6 text-muted-foreground">
                                    <p>Starting your journey is simple:</p>
                                    <ol className="list-decimal list-inside space-y-3 ml-4">
                                        <li>Click on the <strong>"Get Started"</strong> button on the homepage.</li>
                                        <li>Sign up for a free account to save your progress.</li>
                                        <li>You will be taken to the main editor dashboard.</li>
                                    </ol>
                                    <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 text-sm">
                                        <strong>Tip:</strong> You don't need a credit card to sign up. Detailed features are available on our Pricing page.
                                    </div>
                                </div>
                            </section>

                            {/* Importing Data */}
                            <section id="importing-data" className="scroll-mt-32">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                        <Import className="w-6 h-6" />
                                    </div>
                                    <h2 className="text-3xl font-bold">Importing Your Data</h2>
                                </div>
                                <div className="space-y-6 text-muted-foreground">
                                    <p>
                                        To get the most out of Simple9999, we highly recommend importing your existing professional data.
                                    </p>

                                    <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">Why is this important?</h3>
                                    <p>
                                        Providing your old resume, certificates, and detailed work history gives our AI agent the <strong>context</strong> it needs. The more information you provide, the better the AI can:
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>Tailor your resume vocabulary to your specific industry.</li>
                                        <li>Suggest relevant skills you might have forgotten.</li>
                                        <li>Highlight achievements that match your target job description.</li>
                                    </ul>

                                    <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">How to Download Your LinkedIn Profile PDF</h3>
                                    <p>
                                        LinkedIn is a great source of up-to-date professional history. You can easily export it to a PDF to upload here:
                                    </p>
                                    <ol className="list-decimal list-inside space-y-3 ml-4">
                                        <li>Go to your <strong>LinkedIn Profile</strong> page.</li>
                                        <li>Click on the <strong>More</strong> button (usually near your profile picture).</li>
                                        <li>Select <strong>Save to PDF</strong> from the dropdown menu.</li>
                                        <li>Upload this PDF to Simple9999 to instantly populate your profile with rich data.</li>
                                    </ol>
                                </div>
                            </section>

                            {/* Using the AI Agent */}
                            <section id="using-ai" className="scroll-mt-32">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <h2 className="text-3xl font-bold">Using the AI Agent</h2>
                                </div>
                                <div className="space-y-6 text-muted-foreground">
                                    <p>This is where the magic happens. Instead of writing bullet points from scratch, you chat with our AI agent.</p>

                                    <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">Chat-to-Create</h3>
                                    <p>
                                        Simply type "I worked as a Senior Engineer at Google from 2020 to 2024" and the agent will structure this into your resume automatically.
                                    </p>

                                    <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">Job Tailoring</h3>
                                    <p>
                                        Found a job you love? Paste the <strong>Job Description</strong> into the chat interactively. The AI will analyze the requirements and suggest keywords or phrasing adjustments to maximize your match score.
                                    </p>
                                </div>
                            </section>

                            {/* Customization */}
                            <section id="customization" className="scroll-mt-32">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                        <Settings className="w-6 h-6" />
                                    </div>
                                    <h2 className="text-3xl font-bold">Customization</h2>
                                </div>
                                <div className="space-y-4 text-muted-foreground">
                                    <p>
                                        While the AI does the heavy lifting, you have full control.
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li><strong>Manual Edits:</strong> Click on any text in the preview to edit it directly.</li>
                                        <li><strong>Reorder Sections:</strong> Drag and drop sections to highlight what matters most.</li>
                                        <li><strong>Themes:</strong> Switch between professional layouts to find one that suits your industry.</li>
                                    </ul>
                                </div>
                            </section>

                            {/* Exporting */}
                            <section id="exporting" className="scroll-mt-32">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                        <Download className="w-6 h-6" />
                                    </div>
                                    <h2 className="text-3xl font-bold">Exporting</h2>
                                </div>
                                <div className="space-y-4 text-muted-foreground">
                                    <p>
                                        Once you're happy with your resume, exporting is a breeze.
                                    </p>
                                    <p>
                                        Click the <strong>Download</strong> button in the top right corner. You can choose between:
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                        <div className="p-4 border border-border rounded-lg bg-card text-card-foreground">
                                            <span className="font-semibold block mb-2">PDF</span>
                                            Best for emailing and uploading to most portals. Keeps formatting exact.
                                        </div>
                                        <div className="p-4 border border-border rounded-lg bg-card text-card-foreground">
                                            <span className="font-semibold block mb-2">DOCX</span>
                                            Best if you need to make final tweaks in Word or if an ATS specifically requests it.
                                        </div>
                                    </div>
                                </div>
                            </section>

                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
