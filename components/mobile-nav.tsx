"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/theme-toggle";

export function MobileNav() {
    const [isOpen, setIsOpen] = useState(false);

    // Prevent scrolling when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    return (
        <div className="md:hidden">
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 text-foreground hover:bg-secondary/20 rounded-md transition-colors"
                aria-label="Open menu"
            >
                <Menu className="w-6 h-6" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Menu Panel */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 20, stiffness: 300 }}
                            className="fixed right-0 top-0 bottom-0 w-3/4 max-w-sm bg-background border-l border-border shadow-xl z-50 flex flex-col"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-border/10">
                                <div className="flex items-center gap-2">
                                    <Logo className="h-6 w-6 text-primary" />
                                    <span className="font-bold tracking-tight">Menu</span>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary/20 rounded-md transition-colors"
                                    aria-label="Close menu"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto py-6 px-6 flex flex-col gap-6">
                                <nav className="flex flex-col space-y-4">
                                    <Link
                                        href="#features"
                                        className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors py-2"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Features
                                    </Link>
                                    <Link
                                        href="/pricing"
                                        className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors py-2"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Pricing
                                    </Link>
                                    <Link
                                        href="/developer"
                                        className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors py-2"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Developer
                                    </Link>
                                    <Link
                                        href="/docs"
                                        className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors py-2"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Docs
                                    </Link>
                                    <Link
                                        href="/login"
                                        className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors py-2"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Log in
                                    </Link>
                                </nav>
                            </div>

                            <div className="p-6 border-t border-border/10 flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-muted-foreground">Theme</span>
                                    <ThemeToggle />
                                </div>
                                <Link
                                    href="/signup"
                                    onClick={() => setIsOpen(false)}
                                    className="w-full py-3 rounded-full bg-primary text-primary-foreground text-center font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                                >
                                    Get Started
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
