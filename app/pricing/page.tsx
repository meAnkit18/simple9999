
import React from 'react';
import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/Footer";
import { Check } from "lucide-react";

export default function PricingPage() {
    return (
        <>
            <SiteHeader />
            <main className="min-h-screen bg-background pt-20">
                <div className="container px-4 py-16 md:py-32 mx-auto">
                    <div className="flex flex-col items-center justify-center text-center space-y-8 max-w-3xl mx-auto">

                        <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary backdrop-blur-sm">
                            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                            Beta
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
                            Simple, Transparent Pricing
                        </h1>

                        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl">
                            We are currently in beta. Enjoy all features for free while we refine the experience.
                        </p>

                        <div className="w-full max-w-md mt-12 p-8 rounded-3xl border border-primary/20 bg-card/50 backdrop-blur-sm relative overflow-hidden group hover:border-primary/50 transition-colors">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative z-10">
                                <h3 className="text-2xl font-semibold mb-2">Early Adopter</h3>
                                <div className="flex items-baseline justify-center gap-1 mb-6">
                                    <span className="text-5xl font-bold">$0</span>
                                    <span className="text-muted-foreground">/ forever</span>
                                </div>

                                <div className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-8">
                                    For now Totally free under testing
                                </div>

                                <ul className="space-y-4 text-left mb-8">
                                    {[
                                        "Unlimited AI Resume Generations",
                                        "All Templates Included",
                                        "ATS Optimization",
                                        "Docx & PDF Downloads",
                                        "Priority Support"
                                    ].map((feature, i) => (
                                        <li key={i} className="flex items-center gap-3">
                                            <div className="flex-shrink-0 h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center">
                                                <Check className="h-3 w-3 text-primary" />
                                            </div>
                                            <span className="text-sm font-medium text-muted-foreground">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button className="w-full py-3 px-6 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98]">
                                    Get Started For Free
                                </button>
                            </div>
                        </div>

                        <p className="text-sm text-muted-foreground">
                            No credit card required. No hidden fees.
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
