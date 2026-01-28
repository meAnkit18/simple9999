"use client";

import { useEffect, useState, useRef } from "react";

interface TypewriterTextProps {
    text: string;
    className?: string;
    speed?: number;
    delay?: number;
    showCursor?: boolean;
    children?: React.ReactNode;
}

export function TypewriterText({
    text,
    className = "",
    speed = 50,
    delay = 0,
    showCursor = false,
    children,
}: TypewriterTextProps) {
    const [displayedText, setDisplayedText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const elementRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasStarted) {
                    setHasStarted(true);
                }
            },
            { threshold: 0.1 }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => observer.disconnect();
    }, [hasStarted]);

    useEffect(() => {
        if (!hasStarted) return;

        const startTimeout = setTimeout(() => {
            setIsTyping(true);
            let currentIndex = 0;

            const intervalId = setInterval(() => {
                if (currentIndex < text.length) {
                    setDisplayedText(text.slice(0, currentIndex + 1));
                    currentIndex++;
                } else {
                    setIsTyping(false);
                    setIsComplete(true);
                    clearInterval(intervalId);
                }
            }, speed);

            return () => clearInterval(intervalId);
        }, delay);

        return () => clearTimeout(startTimeout);
    }, [hasStarted, text, speed, delay]);

    return (
        <span ref={elementRef} className={className}>
            {displayedText}
            {showCursor && (
                <span
                    className={`inline-block w-[3px] h-[1em] bg-current ml-0.5 align-middle transition-opacity ${isComplete ? "animate-blink" : isTyping ? "opacity-100" : "opacity-0"
                        }`}
                />
            )}
            {!isTyping && hasStarted && displayedText === text && children}
        </span>
    );
}
