"use client";

import { X, UserPlus, LogIn } from "lucide-react";
import { signIn } from "next-auth/react";

interface GuestOnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSignUp: () => void;
    onLogin: () => void;
    isLoading?: boolean;
}

export default function GuestOnboardingModal({
    isOpen,
    onClose,
    onSignUp,
    onLogin,
    isLoading = false,
}: GuestOnboardingModalProps) {
    if (!isOpen) return null;

    const handleGoogleSignIn = () => {
        signIn("google", { callbackUrl: "/dashboard" });
    };

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
                    <h2 className="text-2xl font-bold">Get started in seconds</h2>
                    <p className="text-muted-foreground mt-2">
                        Create an account to save your progress and access all features.
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
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                        className="w-full group flex items-center justify-between p-4 bg-white text-black border border-border/50 rounded-xl hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <div className="flex items-center gap-3">
                            <span className="p-1">
                                {/* Google Icon SVG */}
                                <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.79l7.97-6.2z" />
                                    <path fill="#34A853" d="M24 48c6.48 0 12.01-2.19 15.97-5.85l-7.73-6c-2.15 1.45-4.92 2.3-8.24 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                                </svg>
                            </span>
                            Continue with Google
                        </div>
                    </button>

                    <button
                        onClick={onSignUp}
                        className="w-full group flex items-center justify-between p-4 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all font-medium"
                    >
                        <div className="flex items-center gap-3">
                            <span className="p-1 bg-white/20 rounded-lg">
                                <UserPlus className="w-4 h-4" />
                            </span>
                            Sign Up with Email
                        </div>
                    </button>

                    <button
                        onClick={onLogin}
                        className="w-full group flex items-center justify-between p-4 bg-transparent border border-border rounded-xl hover:bg-accent/50 transition-all font-medium text-muted-foreground hover:text-foreground"
                    >
                        <div className="flex items-center gap-3">
                            <span className="p-1 bg-primary/10 rounded-lg text-primary">
                                <LogIn className="w-4 h-4" />
                            </span>
                            Log In
                        </div>
                    </button>

                    <p className="text-xs text-center text-muted-foreground mt-4 px-4">
                        By continuing, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </div>
            </div>
        </div>
    );
}
