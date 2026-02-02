
import React from 'react';
import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/Footer";
import { Github, Linkedin, Mail, Twitter, Code2, Layout } from "lucide-react";
import Link from 'next/link';

export default function DeveloperPage() {
    return (
        <>
            <SiteHeader />
            <main className="min-h-screen bg-background pt-24 pb-16">
                <div className="container max-w-4xl mx-auto px-6">

                    {/* Hero Section */}
                    <div className="flex flex-col items-center gap-8 mb-16 text-center">
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Ankit Kumar</h1>
                            <p className="text-xl text-muted-foreground font-medium">Building Simple9999.com | ML/DL Enthusiast | Full Stack Developer</p>
                            <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
                                <span>Ghaziabad, Uttar Pradesh, India</span>
                            </div>
                            <div className="flex items-center justify-center gap-4 pt-4">
                                <Link href="https://github.com/meankit18" className="p-2 rounded-full hover:bg-secondary transition-colors" aria-label="Github" target="_blank">
                                    <Github className="w-5 h-5" />
                                </Link>
                                <Link href="https://x.com/meankit18" className="p-2 rounded-full hover:bg-secondary transition-colors" aria-label="X (Twitter)" target="_blank">
                                    <Twitter className="w-5 h-5" />
                                </Link>
                                <Link href="https://www.linkedin.com/in/meankit18" className="p-2 rounded-full hover:bg-secondary transition-colors" aria-label="LinkedIn" target="_blank">
                                    <Linkedin className="w-5 h-5" />
                                </Link>
                                <Link href="mailto:ankit1872kumar@gmail.com" className="p-2 rounded-full hover:bg-secondary transition-colors" aria-label="Email">
                                    <Mail className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="prose prose-neutral dark:prose-invert max-w-none mb-16">
                        <h2 className="text-2xl font-bold mb-4">About Me</h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Embarking on my journey in the tech world as a <strong>B.Tech Computer Science student at KIET</strong> (2024-2028), I'm diving deep into the fascinating realms of Java and Data Structures & Algorithms (DSA). These tools aren't just academic concepts to me—they’re the keys to unlocking innovative solutions and building the future.
                        </p>
                        <p className="text-lg text-muted-foreground leading-relaxed mt-4">
                            With a passion for coding and a hunger to explore cutting-edge technologies, I'm eager to turn my knowledge into impactful projects. I'm all about connecting with fellow tech enthusiasts, industry professionals, and anyone who shares the excitement of shaping the digital landscape.
                        </p>
                    </div>

                    {/* Technical Skills */}
                    <div className="mb-16">
                        <h2 className="text-2xl font-bold mb-8">Technical Stack</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                                        <Layout className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-semibold text-lg">Languages & Frameworks</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {["Java", "Python", "C", "SQL", "Next.js", "React (MERN)", "Tailwind", "Electronjs", "Flask", "Unity"].map((skill) => (
                                        <span key={skill} className="px-3 py-1 rounded-full bg-secondary text-sm font-medium">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
                                        <Code2 className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-semibold text-lg">Cloud & Tools</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {["AWS", "Elastic Beanstalk", "AWS CLI", "Linux", "Git", "DSA"].map((skill) => (
                                        <span key={skill} className="px-3 py-1 rounded-full bg-secondary text-sm font-medium">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Certifications */}
                    <div className="mb-16">
                        <h2 className="text-2xl font-bold mb-8">Certifications</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                "AWS Cloud Practitioner",
                                "Database Programming with SQL (Oracle)",
                                "Red Hat Training: Linux Fundamentals (RH104)",
                                "AWS Elastic Beanstalk & CLI"
                            ].map((cert, i) => (
                                <div key={i} className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card/50">
                                    <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                                    <span className="font-medium">{cert}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Experience */}
                    <div className="mb-16">
                        <h2 className="text-2xl font-bold mb-8">Experience</h2>
                        <div className="space-y-8">

                            <div className="relative pl-8 border-l-2 border-primary/20">
                                <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-primary" />
                                <h3 className="text-xl font-semibold">Astradev</h3>
                                <p className="text-muted-foreground font-medium">Full-stack Developer (Intern)</p>
                                <p className="text-sm text-muted-foreground mb-4">October 2025 - Present • Mumbai, India</p>
                                <p className="text-muted-foreground">
                                    Working on full-stack development using MERN stack and Next.js. Contributing to open source projects and building scalable web applications.
                                </p>
                            </div>

                        </div>
                    </div>

                </div>
            </main>
            <Footer />
        </>
    );
}
