
import React from 'react';
import { Code, Briefcase, GraduationCap, TrendingUp, Sparkles, Zap } from "lucide-react";

export function UseCasesSection() {
    const cases = [
        {
            title: "Software Engineers",
            icon: <Code className="h-8 w-8 text-primary" />,
            description: "Tailor your resume for specific tech stacks. Highlight your GitHub contributions and projects effectively.",
            points: ["Highlight technical skills", "Project-focused templates", "GitHub integration wording"]
        },
        {
            title: "Career Switchers",
            icon: <TrendingUp className="h-8 w-8 text-primary" />,
            description: "Translate your past experiences into transferable skills relevant to your new career path.",
            points: ["Transferable skills highlight", "Focus on potential", "Rephrase past experience"]
        },
        {
            title: "Students & Grads",
            icon: <GraduationCap className="h-8 w-8 text-primary" />,
            description: "No experience? No problem. Focus on your education, internships, and coursework.",
            points: ["Education-first layout", "Internship highlighting", "Coursework showcase"]
        },
        {
            title: "Executives",
            icon: <Briefcase className="h-8 w-8 text-primary" />,
            description: "Showcase leadership, strategy, and results. concise and impactful resumes for senior roles.",
            points: ["Leadership focus", "Results-oriented metrics", "Executive summary"]
        },
        {
            title: "Creative Professionals",
            icon: <Sparkles className="h-8 w-8 text-primary" />,
            description: "Stand out with modern designs while keeping your resume ATS-friendly.",
            points: ["Modern aesthetics", "Portfolio links", "Creative layouts"]
        },
        {
            title: "Freelancers",
            icon: <Zap className="h-8 w-8 text-primary" />,
            description: "Showcase your diverse client projects and adaptable skill set in a cohesive manner.",
            points: ["Project diversity", "Client testimonials", "Skill adaptability"]
        }
    ];

    return (
        <section className="w-full px-6 py-16 md:py-32 bg-background">
            <div className="container mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                        Built for Every Career Path
                    </h2>
                    <p className="text-xl text-muted-foreground">
                        Whether you're just starting out or leading a company, Simple9999 adapts to your unique career journey.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {cases.map((item, index) => (
                        <div key={index} className="group relative p-8 rounded-3xl border border-border/50 bg-card hover:border-primary/50 transition-all hover:shadow-lg">
                            <div className="mb-6 inline-block p-4 rounded-2xl bg-primary/5 group-hover:bg-primary/10 transition-colors">
                                {item.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                            <p className="text-muted-foreground mb-6 leading-relaxed">
                                {item.description}
                            </p>
                            <ul className="space-y-2">
                                {item.points.map((point, i) => (
                                    <li key={i} className="flex items-center text-sm font-medium text-foreground/80">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary mr-3" />
                                        {point}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
