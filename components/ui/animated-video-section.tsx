"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedVideoSectionProps {
    children?: React.ReactNode;
}

export function AnimatedVideoSection({ children }: AnimatedVideoSectionProps) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(0.8);

    useEffect(() => {
        const handleScroll = () => {
            if (!sectionRef.current) return;

            const rect = sectionRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Calculate how much of the section is visible
            const sectionTop = rect.top;
            const sectionCenter = sectionTop + rect.height / 2;

            // Progress from 0 (section just entering) to 1 (section at center or above)
            const progress = Math.max(0, Math.min(1, 1 - (sectionCenter - windowHeight / 2) / (windowHeight * 0.5)));

            // Scale from 0.8 to 1 based on scroll progress
            const newScale = 0.8 + progress * 0.2;
            setScale(newScale);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll(); // Initial check

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <section ref={sectionRef} className="w-full px-4 md:px-6 py-12 md:py-16">
            <div className="max-w-[1400px] mx-auto">
                <div
                    className="w-full aspect-video rounded-4xl bg-muted/90 flex items-center justify-center transition-transform duration-100 ease-out"
                    style={{ transform: `scale(${scale})` }}
                >
                    {children || (
                        <span className="text-muted-foreground text-lg">Video coming soon</span>
                    )}
                </div>
            </div>
        </section>
    );
}
