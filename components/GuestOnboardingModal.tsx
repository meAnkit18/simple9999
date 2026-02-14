"use client";

import { X, User, ArrowRight, UserPlus, LogIn } from "lucide-react";

interface GuestOnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onContinueAsGuest: () => void;
    onSignUp: () => void;
    onLogin: () => void;
}

export default function GuestOnboardingModal({
    isOpen,
    onClose,
    onContinueAsGuest,
    onSignUp,
    onLogin,
}: GuestOnboardingModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-6 text-center border-b border-border/50 bg-gradient-to-b from-primary/5 to-transparent">
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <UserPlus className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold">Ready to build?</h2>
                    <p className="text-muted-foreground mt-2">
                        Create an account to save your progress, or try it out as a guest.
                    </p>

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-accent rounded-lg transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Options */}
                <div className="p-6 space-y-3">
                    <button
                        onClick={onSignUp}
                        className="w-full group flex items-center justify-between p-4 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all font-medium"
                    >
                        <div className="flex items-center gap-3">
                            <span className="p-1 bg-white/20 rounded-lg">
                                <UserPlus className="w-4 h-4" />
                            </span>
                            Sign Up (Recommended)
                        </div>
                        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button
                        onClick={onLogin}
                        className="w-full group flex items-center justify-between p-4 bg-accent/50 border border-border rounded-xl hover:bg-accent hover:border-primary/20 transition-all font-medium"
                    >
                        <div className="flex items-center gap-3">
                            <span className="p-1 bg-primary/10 rounded-lg text-primary">
                                <LogIn className="w-4 h-4" />
                            </span>
                            Log In
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground transform group-hover:translate-x-1 transition-transform" />
                    </button>

                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">Or</span>
                        </div>
                    </div>

                    <button
                        onClick={onContinueAsGuest}
                        className="w-full group flex items-center justify-between p-4 bg-transparent border border-border/50 rounded-xl hover:bg-accent/30 text-muted-foreground hover:text-foreground transition-all"
                    >
                        <div className="flex items-center gap-3">
                            <span className="p-1 bg-muted/20 rounded-lg">
                                <User className="w-4 h-4" />
                            </span>
                            Continue as Guest
                        </div>
                        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </button>

                    <p className="text-xs text-center text-muted-foreground mt-4 px-4">
                        Guest accounts are temporary. You can sign up later to save your resume permanently.
                    </p>
                </div>
            </div>
        </div>
    );
}
