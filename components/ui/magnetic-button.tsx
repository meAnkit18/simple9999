"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface MagneticButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
    children: React.ReactNode;
    className?: string;
    variant?: "primary" | "secondary" | "outline" | "ghost";
    href?: string;
}

export const MagneticButton = ({
    children,
    className,
    variant = "primary",
    href,
    ...props
}: MagneticButtonProps) => {
    const ref = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
        const { clientX, clientY } = e;
        if (!ref.current) return;
        const { left, top, width, height } = ref.current.getBoundingClientRect();
        const x = clientX - (left + width / 2);
        const y = clientY - (top + height / 2);
        setPosition({ x, y });
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    const variants = {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
    };

    const classes = cn(
        "relative inline-flex items-center justify-center rounded-full px-8 py-4 font-semibold text-lg transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className
    );

    const motionProps = {
        ref: ref as any,
        onMouseMove: handleMouseMove,
        onMouseLeave: handleMouseLeave,
        animate: { x: position.x * 0.2, y: position.y * 0.2 },
        transition: { type: "spring", stiffness: 150, damping: 15, mass: 0.1 } as const,
        className: classes,
    };

    const MotionLink = motion.create(Link);

    if (href) {
        return (
            <MotionLink href={href} {...motionProps}>
                <span className="relative z-10">{children}</span>
            </MotionLink>
        );
    }

    return (
        <motion.button {...motionProps} {...props}>
            <span className="relative z-10">{children}</span>
        </motion.button>
    );
};
