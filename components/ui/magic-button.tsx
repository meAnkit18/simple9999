"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface MagicButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    icon?: React.ReactNode;
    position?: "left" | "right";
    handleClick?: () => void;
    otherClasses?: string;
    href?: string;
}

export const MagicButton = ({
    children,
    icon,
    position,
    handleClick,
    otherClasses,
    href,
    className,
    ...props
}: MagicButtonProps) => {
    const content = (
        <span className={cn("relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50", className)}>
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <span className={cn(
                "inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-8 py-1 text-sm font-medium text-white backdrop-blur-3xl transition-colors hover:bg-slate-950/90",
                otherClasses
            )}>
                {position === "left" && icon && <span className="mr-2">{icon}</span>}
                {children}
                {position === "right" && icon && <span className="ml-2">{icon}</span>}
            </span>
        </span>
    );

    if (href) {
        return (
            <Link href={href} className="inline-block">
                {content}
            </Link>
        );
    }

    return (
        <button onClick={handleClick} className="inline-block" {...props}>
            {content}
        </button>
    );
};
