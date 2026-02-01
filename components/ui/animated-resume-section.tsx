"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import ResumeImage1 from "@/components/assets/ResumeImage1.webp";
import ResumeImage2 from "@/components/assets/ResumeImage2.webp";

export function AnimatedResumeSection() {
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
        <section ref={sectionRef} className="w-full px-6 py-16">
            <div className="max-w-[1400px] mx-auto">
                <div
                    className="flex flex-col md:flex-row gap-8 items-center justify-center transition-transform duration-100 ease-out"
                    style={{ transform: `scale(${scale})` }}
                >
                    {/* Resume Box 1 */}
                    <div className="w-full md:w-[500px] aspect-[210/297] rounded-lg bg-muted/90 shadow-lg border border-border/10 overflow-hidden relative">
                        <Image
                            src={ResumeImage1}
                            alt="Resume Template 1"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 500px"
                            placeholder="blur"
                        />
                    </div>

                    {/* Resume Box 2 */}
                    <div className="w-full md:w-[500px] aspect-[210/297] rounded-lg bg-muted/90 shadow-lg border border-border/10 overflow-hidden relative">
                        <Image
                            src={ResumeImage2}
                            alt="Resume Template 2"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 500px"
                            placeholder="blur"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
