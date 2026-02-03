"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function ATSScoreGauge({ score, className }: { score: number, className?: string }) {
    const { theme } = useTheme();
    const [animatedScore, setAnimatedScore] = useState(0);

    // Animate the score on mount or change
    useEffect(() => {
        // Simple lerp animation
        let startTimestamp: number | null = null;
        const duration = 1500; // ms

        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);

            // Easing function: easeOutQuart
            const ease = 1 - Math.pow(1 - progress, 4);

            setAnimatedScore(score * ease);

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };

        window.requestAnimationFrame(step);
    }, [score]);

    // Gauge configuration
    const radius = 80;
    const stroke = 12;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;

    // We want a semi-circle (180 degrees) or slightly more (e.g., 220 degrees)
    // Symmetric around top (12 o'clock).
    // If 0 is bottom (6 o'clock), top is 180.
    // Range 220 deg -> +/- 110 from 180.
    const startAngle = 70;  // 180 - 110
    const endAngle = 290;   // 180 + 110
    const totalAngle = endAngle - startAngle;

    // Calculate stroke dash based on arc length
    // Arc length = (angle/360) * circumference
    const arcLength = (totalAngle / 360) * circumference;

    // Color configuration based on score
    const getColor = (s: number) => {
        if (s >= 80) return "#22c55e"; // Green
        if (s >= 60) return "#eab308"; // Yellow
        return "#ef4444";             // Red
    };

    const currentColor = getColor(animatedScore);

    // Needle rotation calculation
    // 0 score = startAngle + 90 (SVG start is 3 o'clock)
    // But strictly: mapped 0-100 to startAngle-endAngle
    // Note: SVG rotation origin
    const rotation = startAngle + (animatedScore / 100) * totalAngle;

    return (
        <div className={`relative flex flex-col items-center justify-center ${className}`}>
            <div className="relative w-[260px] h-[260px] flex items-center justify-center">
                {/* Glow Effect behind */}
                <div
                    className="absolute inset-0 rounded-full blur-3xl opacity-20 transition-colors duration-500"
                    style={{ backgroundColor: currentColor }}
                />

                <svg
                    height="100%"
                    width="100%"
                    viewBox="0 0 200 200"
                    className="transform rotate-90" // Rotate so 0 is at bottom
                >
                    {/* Definitions for gradients */}
                    <defs>
                        <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#ef4444" />
                            <stop offset="50%" stopColor="#eab308" />
                            <stop offset="100%" stopColor="#22c55e" />
                        </linearGradient>
                    </defs>

                    {/* Background Track */}
                    <circle
                        stroke={theme === "dark" ? "#333" : "#e5e7eb"}
                        strokeWidth={stroke}
                        strokeLinecap="round"
                        fill="transparent"
                        r={normalizedRadius}
                        cx="100"
                        cy="100"
                        strokeDasharray={`${arcLength} ${circumference}`}
                        // Rotate to align opening at bottom
                        transform={`rotate(${startAngle} 100 100)`}
                        className="transition-all duration-300"
                    />

                    {/* Active Progress */}
                    <circle
                        stroke="url(#gaugeGradient)"
                        strokeWidth={stroke}
                        strokeLinecap="round"
                        fill="transparent"
                        r={normalizedRadius}
                        cx="100"
                        cy="100"
                        strokeDasharray={`${arcLength} ${circumference}`}
                        // We use stroke-dashoffset to mask it? No, for full gradient we just show it all
                        // Actually, for a speedometer we usually want the gradient to be static and the needle to move.
                        // OR we want the bar to fill up.
                        // Let's make the bar fill up to the score.
                        strokeDashoffset={arcLength - (animatedScore / 100) * arcLength} // Reverse dash logic
                        transform={`rotate(${startAngle} 100 100)`}
                        className="transition-all duration-75" // Fast update for smooth anim
                    />
                </svg>

                {/* Needle (CSS rotation) - Center based */}
                <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    style={{ transform: `rotate(${rotation - 180}deg)`, transition: 'transform 1.0s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                >
                    {/* Needle from center pointing UP */}
                    <div className="absolute top-1/2 left-1/2 w-0 h-0 -ml-1 -mt-1">
                        <div className="w-2 h-[80px] bg-foreground rounded-full absolute bottom-0 left-1/2 -translate-x-1/2 origin-bottom shadow-md" />
                        <div className="w-4 h-4 bg-background border-4 border-foreground rounded-full absolute top-[-2px] left-1/2 -translate-x-1/2" />
                    </div>
                </div>

                {/* Center Text */}
                <div className="absolute flex flex-col items-center justify-center pt-16 z-30">
                    <span className="text-6xl font-bold tracking-tighter tabular-nums transition-colors duration-300" style={{ color: currentColor }}>
                        {Math.round(animatedScore)}
                    </span>
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
                        ATS Score
                    </span>
                </div>

            </div>

            {/* Ticks/Labels (Optional, below) */}
            <div className="flex justify-between w-[200px] -mt-8 text-xs font-medium text-muted-foreground px-4">
                <span>0</span>
                <span>50</span>
                <span>100</span>
            </div>
        </div>
    );
}
