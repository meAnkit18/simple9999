
import React from 'react';
import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/Footer";
import { Badge } from "lucide-react"; // Using lucide-react efficiently

export default function ChangelogPage() {
    const releases = [
        {
            version: "v1.0.0-beta",
            date: "February 01, 2026",
            title: "Initial Public Beta",
            description: "Welcome to Simple9999! We're excited to launch our agentic resume builder in public beta. Here's what's included in this first release:",
            type: "Major Release",
            features: [
                "AI-Powered Resume Builder: Create professional resumes just by describing your experience.",
                "Smart Job Matching: Paste a job description to tailor your resume specifically for that role.",
                "ATS Optimization: Built-in checks to ensuring your resume parses correctly by Applicant Tracking Systems.",
                "Real-time Preview: See changes instantly as you edit your resume.",
                "Dark Mode Support: A beautiful editing experience, day or night."
            ]
        }
    ];

    return (
        <>
            <SiteHeader />
            <main className="min-h-screen bg-background pt-24 pb-16">
                <div className="container max-w-4xl mx-auto px-6">
                    <div className="mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Changelog</h1>
                        <p className="text-xl text-muted-foreground">
                            New updates and improvements to Simple9999.
                        </p>
                    </div>

                    <div className="relative border-l border-border/50 ml-3 md:ml-6 space-y-12">
                        {releases.map((release, index) => (
                            <div key={index} className="relative pl-8 md:pl-12 pb-12">
                                {/* Timeline Dot */}
                                <div className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-background" />

                                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-mono font-medium text-muted-foreground">
                                            {release.date}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-xs font-medium">
                                            {release.version}
                                        </span>
                                        {index === 0 && (
                                            <span className="bg-green-500/10 text-green-600 px-2.5 py-0.5 rounded-full text-xs font-medium">
                                                Latest
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h2 className="text-2xl font-semibold tracking-tight">{release.title}</h2>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {release.description}
                                    </p>

                                    <ul className="space-y-2 mt-4">
                                        {release.features.map((feature, i) => (
                                            <li key={i} className="flex items-start text-sm text-foreground/90 leading-relaxed">
                                                <span className="mr-3 mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
