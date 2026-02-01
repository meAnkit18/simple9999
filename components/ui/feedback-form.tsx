"use client";

import { useState } from "react";
import { MagicButton } from "./magic-button";
import { cn } from "@/lib/utils";

export function FeedbackForm() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        setErrorMessage("");

        try {
            const res = await fetch("/api/feedback", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, message }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Something went wrong");
            }

            setStatus("success");
            setEmail("");
            setMessage("");
        } catch (error: any) {
            setStatus("error");
            setErrorMessage(error.message);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-6 rounded-2xl bg-card/40 backdrop-blur-md border border-border/50 shadow-xl">
            {status === "success" ? (
                <div className="text-center py-8 space-y-4 animate-fade-in">
                    <div className="h-12 w-12 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">Thank you!</h3>
                    <p className="text-muted-foreground">Your feedback has been received.</p>
                    <button
                        onClick={() => setStatus("idle")}
                        className="text-sm text-primary hover:underline mt-2"
                    >
                        Send another response
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-muted-foreground">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-medium text-muted-foreground">
                            Feedback
                        </label>
                        <textarea
                            id="message"
                            required
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                            placeholder="Tell us what you think..."
                        />
                    </div>

                    {status === "error" && (
                        <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg">
                            {errorMessage}
                        </div>
                    )}

                    <MagicButton
                        type="submit"
                        disabled={status === "loading"}
                        className="w-full mt-2"
                    >
                        {status === "loading" ? "Sending..." : "Submit Feedback"}
                    </MagicButton>
                </form>
            )}
        </div>
    );
}
