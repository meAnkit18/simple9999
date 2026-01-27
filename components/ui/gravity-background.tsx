"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    shape: "circle" | "square" | "triangle";
    rotation: number;
    rotationSpeed: number;
}

interface Star {
    x: number;
    y: number;
    size: number;
    opacity: number;
    twinkleSpeed: number;
}

export const GravityBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { resolvedTheme } = useTheme();
    const themeRef = useRef(resolvedTheme);

    // Keep theme ref in sync without triggering re-renders of the canvas effect
    useEffect(() => {
        themeRef.current = resolvedTheme;
    }, [resolvedTheme]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];
        let stars: Star[] = [];
        const particleCount = 50;
        const starCount = 100;
        const mouseDistance = 300;

        let mouse = { x: 0, y: 0 };

        const colors = [
            "#4285F4", // Google Blue
            "#EA4335", // Google Red
            "#FBBC05", // Google Yellow
            "#34A853", // Google Green
            "#A142F4", // Purple
            "#24C1E0", // Cyan
        ];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
            initStars();
        };

        const initStars = () => {
            stars = [];
            for (let i = 0; i < starCount; i++) {
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 1.5 + 0.5,
                    opacity: Math.random(),
                    twinkleSpeed: (Math.random() - 0.5) * 0.02,
                });
            }
        };

        const initParticles = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.2,
                    vy: (Math.random() - 0.5) * 0.2,
                    size: Math.random() * 8 + 4,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    shape: Math.random() > 0.6 ? "circle" : Math.random() > 0.5 ? "square" : "triangle",
                    rotation: Math.random() * Math.PI * 2,
                    rotationSpeed: (Math.random() - 0.5) * 0.02,
                });
            }
        };

        const drawParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const isDark = themeRef.current === "dark";

            // Draw Stars
            stars.forEach((star) => {
                star.opacity += star.twinkleSpeed;
                if (star.opacity > 1 || star.opacity < 0.2) {
                    star.twinkleSpeed *= -1;
                }

                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);

                // Adjust star color based on theme
                if (isDark) {
                    ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
                } else {
                    // Darker stars for light mode so they are visible
                    ctx.fillStyle = `rgba(0, 0, 0, ${star.opacity * 0.4})`;
                }

                ctx.fill();
            });

            // Draw Particles
            particles.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;
                p.rotation += p.rotationSpeed;

                // Wrap around edges
                if (p.x < -50) p.x = canvas.width + 50;
                if (p.x > canvas.width + 50) p.x = -50;
                if (p.y < -50) p.y = canvas.height + 50;
                if (p.y > canvas.height + 50) p.y = -50;

                // Mouse interaction (gentle push)
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouseDistance) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (mouseDistance - distance) / mouseDistance;
                    p.vx -= forceDirectionX * force * 0.05;
                    p.vy -= forceDirectionY * force * 0.05;
                }

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = 0.6; // Semi-transparent

                ctx.beginPath();
                if (p.shape === "circle") {
                    ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                } else if (p.shape === "square") {
                    ctx.rect(-p.size / 2, -p.size / 2, p.size, p.size);
                } else if (p.shape === "triangle") {
                    ctx.moveTo(0, -p.size / 2);
                    ctx.lineTo(p.size / 2, p.size / 2);
                    ctx.lineTo(-p.size / 2, p.size / 2);
                    ctx.closePath();
                }
                ctx.fill();
                ctx.restore();
            });

            animationFrameId = requestAnimationFrame(drawParticles);
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        window.addEventListener("resize", resize);
        window.addEventListener("mousemove", handleMouseMove);

        resize();
        drawParticles();

        return () => {
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 -z-10 w-full h-full pointer-events-none"
        />
    );
};
