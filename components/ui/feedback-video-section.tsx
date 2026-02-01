"use client";

import { useState } from "react";
import { X, Send, Play, MessageSquarePlus } from "lucide-react";
import { cn } from "@/lib/utils";

export function FeedbackVideoSection() {
    const [isFeedbackMode, setIsFeedbackMode] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!feedback.trim()) return;

        // Simulate submission
        setTimeout(() => {
            setIsSubmitted(true);
            setFeedback("");

            // Reset after showing thank you message
            setTimeout(() => {
                setIsSubmitted(false);
                setIsFeedbackMode(false);
            }, 3000);
        }, 1000);
    };

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center text-center p-8 overflow-hidden group">
            {/* Abstract Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808030_1px,transparent_1px),linear-gradient(to_bottom,#80808030_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-2xl mx-auto transition-all duration-500 ease-in-out">

                {/* VIEW: MAIN PROMO */}
                <div
                    className={cn(
                        "flex flex-col items-center space-y-6 transition-all duration-500",
                        isFeedbackMode ? "opacity-0 translate-y-10 pointer-events-none absolute inset-0" : "opacity-100 translate-y-0 relative"
                    )}
                >
                    <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary backdrop-blur-sm animate-pulse">
                        <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
                        Seek Opportunity
                    </div>

                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-2">
                        The Future of Hiring is <span className="text-primary">Agentic</span>
                    </h2>

                    <p className="text-muted-foreground text-lg md:text-xl max-w-lg mx-auto">
                        We are building the infrastructure for the next generation of recruitment. Join us in shaping the future.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                        <button className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-primary text-primary-foreground px-8 font-medium transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25">
                            <span className="mr-2">Watch Vision</span>
                            <Play className="h-4 w-4 fill-current transition-transform group-hover:translate-x-1" />
                        </button>

                        <button
                            onClick={() => setIsFeedbackMode(true)}
                            className="group inline-flex h-12 items-center justify-center rounded-full border border-input bg-background px-8 font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                            <span className="mr-2">Give Feedback</span>
                            <MessageSquarePlus className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </button>
                    </div>
                </div>

                {/* VIEW: FEEDBACK FORM */}
                <div
                    className={cn(
                        "flex flex-col items-center justify-center w-full transition-all duration-500 p-6 rounded-3xl bg-background/40 backdrop-blur-xl border border-white/10 dark:border-white/5 shadow-2xl",
                        !isFeedbackMode ? "opacity-0 translate-y-10 pointer-events-none absolute inset-0" : "opacity-100 translate-y-0 relative"
                    )}
                >
                    {isSubmitted ? (
                        <div className="flex flex-col items-center py-12 animate-in fade-in zoom-in duration-300">
                            <div className="h-16 w-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-4">
                                <Send className="h-8 w-8" />
                            </div>
                            <h3 className="text-2xl font-bold">Thank You!</h3>
                            <p className="text-muted-foreground mt-2">Your feedback helps us build a better future.</p>
                        </div>
                    ) : (
                        <>
                            <div className="w-full flex justify-between items-center mb-6">
                                <h3 className="text-xl font-semibold">Share your thoughts</h3>
                                <button
                                    onClick={() => setIsFeedbackMode(false)}
                                    className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                                >
                                    <X className="h-5 w-5 opacity-70" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="w-full space-y-4">
                                <textarea
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    placeholder="What visuals or features would you like to see?"
                                    className="w-full min-h-[120px] p-4 rounded-xl bg-white/50 dark:bg-black/20 border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all resize-none placeholder:text-muted-foreground/60"
                                    autoFocus
                                />

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={!feedback.trim()}
                                        className="inline-flex items-center justify-center h-10 px-6 rounded-full bg-primary text-primary-foreground font-medium text-sm transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Send Feedback
                                        <Send className="ml-2 h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>

            </div>
        </div>
    );
}
