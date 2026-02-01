"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

const pricingTiers = [
    {
        name: "Starter",
        price: "₹0",
        originalPrice: null,
        period: "/month",
        description: "Perfect for trying things out.",
        features: [
            { name: "1 Resume", included: true },
            { name: "Basic Analysis", included: true },
            { name: "Standard Templates", included: true },
            { name: "AI Suggestions", included: false },
            { name: "Priority Support", included: false },
        ],
        cta: "Get Started",
        href: "/signup",
        popular: false,
    },
    {
        name: "Pro",
        price: "₹0",
        originalPrice: "₹99",
        period: "/month",
        description: "Best for serious job seekers.",
        features: [
            { name: "Unlimited Resumes", included: true },
            { name: "Advanced AI Analysis", included: true },
            { name: "Premium Templates", included: true },
            { name: "Cover Letter Generator", included: true },
            { name: "Priority Support", included: true },
        ],
        cta: "Get Pro",
        href: "/signup?plan=pro",
        popular: true,
    },
    {
        name: "Enterprise",
        price: "₹0",
        originalPrice: "₹999",
        period: "/month",
        description: "For agencies and teams.",
        features: [
            { name: "Everything in Pro", included: true },
            { name: "Team Management", included: true },
            { name: "Custom Branding", included: true },
            { name: "API Access", included: true },
            { name: "Dedicated Account Manager", included: true },
        ],
        cta: "Contact Sales",
        href: "/contact",
        popular: false,
    },
];

export function PricingSection() {
    return (
        <section id="pricing" className="w-full px-4 py-16 md:px-6 md:py-24 relative overflow-hidden">
            <div className="max-w-[1400px] mx-auto relative z-10">
                <div className="text-center mb-16 md:mb-24">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-3xl md:text-5xl font-bold tracking-tight mb-4"
                    >
                        Simple, transparent pricing
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto"
                    >
                        Choose the plan that fits your needs. No hidden fees. Cancel anytime.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {pricingTiers.map((tier, index) => (
                        <motion.div
                            key={tier.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={cn(
                                "relative p-8 rounded-3xl border flex flex-col h-full transition-all duration-300",
                                tier.popular
                                    ? "bg-primary/5 border-primary/50 shadow-2xl shadow-primary/10 scale-105 z-10"
                                    : "bg-background/50 border-border/50 hover:bg-muted/50 hover:border-border"
                            )}
                        >
                            {tier.popular && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                    <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                                <div className="flex items-baseline gap-2 mb-2">
                                    {tier.originalPrice && (
                                        <span className="text-lg text-muted-foreground line-through decoration-red-500/50 decoration-2">
                                            {tier.originalPrice}
                                        </span>
                                    )}
                                    <span className="text-4xl font-bold">{tier.price}</span>
                                    <span className="text-muted-foreground">{tier.period}</span>
                                </div>
                                <p className="text-sm text-muted-foreground">{tier.description}</p>
                            </div>

                            <div className="flex-grow mb-8 space-y-4">
                                {tier.features.map((feature) => (
                                    <div key={feature.name} className="flex items-center gap-3">
                                        {feature.included ? (
                                            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                <Check className="w-3 h-3" />
                                            </div>
                                        ) : (
                                            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                                                <X className="w-3 h-3" />
                                            </div>
                                        )}
                                        <span className={cn("text-sm", !feature.included && "text-muted-foreground/60")}>
                                            {feature.name}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <Link
                                href={tier.href}
                                className={cn(
                                    "w-full py-3 rounded-xl font-medium transition-all text-center block",
                                    tier.popular
                                        ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 hover:scale-[1.02]"
                                        : "bg-muted text-foreground hover:bg-muted/80 hover:scale-[1.02]"
                                )}
                            >
                                {tier.cta}
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[1200px] pointer-events-none opacity-20 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]" />
            </div>
        </section>
    );
}
