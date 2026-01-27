"use client";

import React, { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface InteractiveGridPatternProps {
    className?: string;
    width?: number;
    height?: number;
    squares?: [number, number]; // [columns, rows]
}

export function InteractiveGridPattern({
    className,
    width = 40,
    height = 40,
    squares = [24, 24],
}: InteractiveGridPatternProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const { theme, systemTheme } = useTheme();
    const mouseRef = useRef({ x: -1000, y: -1000 });
    const frameRef = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Handle Resize
        const resizeObserver = new ResizeObserver(() => {
            const { width, height } = container.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.scale(dpr, dpr);
        });

        resizeObserver.observe(container);

        // Handle Mouse Move
        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            };
        };

        // Handle Mouse Leave
        const handleMouseLeave = () => {
            mouseRef.current = { x: -1000, y: -1000 };
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseleave", handleMouseLeave);

        // Animation Loop
        const render = () => {
            const { width: rectWidth, height: rectHeight } = container.getBoundingClientRect();

            // Clear canvas
            ctx.clearRect(0, 0, rectWidth, rectHeight);

            // Grid properties
            const gapX = width;
            const gapY = height;
            const cols = Math.ceil(rectWidth / gapX);
            const rows = Math.ceil(rectHeight / gapY);

            for (let i = 0; i <= cols; i++) {
                for (let j = 0; j <= rows; j++) {
                    const x = i * gapX;
                    const y = j * gapY;

                    // Calculate distance to mouse
                    const dx = mouseRef.current.x - x;
                    const dy = mouseRef.current.y - y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    // Interaction radius
                    const radius = 200;

                    let size = 2; // Increased base size
                    // DEBUG: Force red color
                    let color = "rgba(255, 0, 0, 0.5)";

                    if (dist < radius) {
                        const scale = 1 + (radius - dist) / radius; // Scale up closer to mouse
                        size = size * scale * 2;
                        color = "rgba(0, 0, 255, 0.8)"; // Blue when active
                    }

                    ctx.fillStyle = color;
                    ctx.beginPath();
                    ctx.arc(x, y, size, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            frameRef.current = requestAnimationFrame(render);
        };

        render();

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseleave", handleMouseLeave);
            cancelAnimationFrame(frameRef.current);
        };
    }, [theme, systemTheme, width, height]);

    return (
        <div
            ref={containerRef}
            className={cn("absolute inset-0 w-full h-full pointer-events-none", className)}
        >
            <canvas ref={canvasRef} className="block w-full h-full" />
        </div>
    );
}
