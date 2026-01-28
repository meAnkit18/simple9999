"use client";

import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "next-themes";

function ATSScanner() {
    const groupRef = useRef<THREE.Group>(null!);
    const { theme } = useTheme();

    // Reduced particle counts for less density and better spacing
    const DOC_BORDER_ROWS = 2;
    const PARTICLES_PER_ROW = 40;
    const DOC_PARTICLES = DOC_BORDER_ROWS * PARTICLES_PER_ROW;
    const TEXT_LINE_PARTICLES = 24;
    const SCAN_LINE_PARTICLES = 25;
    const SCORE_CIRCLE_OUTER = 45;
    const SCORE_CIRCLE_INNER = 30;
    const SCORE_FILL_PARTICLES = 35;
    const CHECKMARK_PARTICLES = 12;
    const FLOATING_CIRCLES = 14;
    const SPARKLE_PARTICLES = 16;
    const TOTAL_PARTICLES = DOC_PARTICLES + TEXT_LINE_PARTICLES + SCAN_LINE_PARTICLES +
        SCORE_CIRCLE_OUTER + SCORE_CIRCLE_INNER + SCORE_FILL_PARTICLES +
        CHECKMARK_PARTICLES + FLOATING_CIRCLES + SPARKLE_PARTICLES;

    const { particles, particleData } = useMemo(() => {
        const positions = new Float32Array(TOTAL_PARTICLES * 3);
        const scales = new Float32Array(TOTAL_PARTICLES);
        const data = new Float32Array(TOTAL_PARTICLES * 4);

        let i = 0;
        let j = 0;
        let k = 0;

        const docWidth = 28;
        const docHeight = 36;
        const docOffsetX = -18;
        const rowSpacing = 1.8;

        // Document outline with multiple rows for thickness
        for (let row = 0; row < DOC_BORDER_ROWS; row++) {
            const inset = row * rowSpacing;
            const w = docWidth - inset * 2;
            const h = docHeight - inset * 2;

            for (let d = 0; d < PARTICLES_PER_ROW; d++) {
                let px = 0, py = 0;
                const t = d / PARTICLES_PER_ROW;
                const perimeter = (w + h) * 2;
                const pos = t * perimeter;

                if (pos < h) {
                    px = -w / 2;
                    py = -h / 2 + pos;
                } else if (pos < h + w) {
                    px = -w / 2 + (pos - h);
                    py = h / 2;
                } else if (pos < h * 2 + w) {
                    px = w / 2;
                    py = h / 2 - (pos - h - w);
                } else {
                    px = w / 2 - (pos - h * 2 - w);
                    py = -h / 2;
                }

                positions[i] = px + docOffsetX;
                positions[i + 1] = py;
                positions[i + 2] = 0;
                scales[j] = 1.2 + row * 0.15;
                data[k] = 0; // Type: document border
                data[k + 1] = positions[i];
                data[k + 2] = positions[i + 1];
                data[k + 3] = d + row * PARTICLES_PER_ROW;

                i += 3;
                j++;
                k += 4;
            }
        }

        // Text line particles inside document
        const textLineCount = 8;
        const particlesPerLine = Math.floor(TEXT_LINE_PARTICLES / textLineCount);
        for (let line = 0; line < textLineCount; line++) {
            const lineY = docHeight / 2 - 5 - line * 3.5;
            const lineWidth = 8 + Math.random() * 10;
            const lineStartX = -docWidth / 2 + 3;

            for (let p = 0; p < particlesPerLine; p++) {
                const t = p / particlesPerLine;
                positions[i] = docOffsetX + lineStartX + t * lineWidth;
                positions[i + 1] = lineY;
                positions[i + 2] = 0;
                scales[j] = 0.8;
                data[k] = 1; // Type: text line
                data[k + 1] = positions[i];
                data[k + 2] = lineY;
                data[k + 3] = line;

                i += 3;
                j++;
                k += 4;
            }
        }

        // Scanning line particles (horizontal beam)
        for (let s = 0; s < SCAN_LINE_PARTICLES; s++) {
            const t = s / SCAN_LINE_PARTICLES;
            positions[i] = docOffsetX - docWidth / 2 + 2 + t * (docWidth - 4);
            positions[i + 1] = 0;
            positions[i + 2] = 0.5;
            scales[j] = 1.8 - Math.abs(t - 0.5) * 1.2; // Thicker in middle
            data[k] = 2; // Type: scan line
            data[k + 1] = t;
            data[k + 2] = 0;
            data[k + 3] = 0;

            i += 3;
            j++;
            k += 4;
        }

        // Score gauge - outer ring
        const scoreOffsetX = 20;
        const outerRadius = 14;
        for (let c = 0; c < SCORE_CIRCLE_OUTER; c++) {
            const t = c / SCORE_CIRCLE_OUTER;
            const angle = -Math.PI * 0.75 + t * Math.PI * 1.5;
            positions[i] = scoreOffsetX + Math.cos(angle) * outerRadius;
            positions[i + 1] = Math.sin(angle) * outerRadius;
            positions[i + 2] = 0;
            scales[j] = 1.4;
            data[k] = 3; // Type: outer score ring
            data[k + 1] = angle;
            data[k + 2] = outerRadius;
            data[k + 3] = t;

            i += 3;
            j++;
            k += 4;
        }

        // Score gauge - inner ring
        const innerRadius = 10;
        for (let c = 0; c < SCORE_CIRCLE_INNER; c++) {
            const t = c / SCORE_CIRCLE_INNER;
            const angle = -Math.PI * 0.75 + t * Math.PI * 1.5;
            positions[i] = scoreOffsetX + Math.cos(angle) * innerRadius;
            positions[i + 1] = Math.sin(angle) * innerRadius;
            positions[i + 2] = 0;
            scales[j] = 1.0;
            data[k] = 4; // Type: inner score ring
            data[k + 1] = angle;
            data[k + 2] = innerRadius;
            data[k + 3] = t;

            i += 3;
            j++;
            k += 4;
        }

        // Score fill particles (animated fill effect)
        const fillRadius = 12;
        for (let c = 0; c < SCORE_FILL_PARTICLES; c++) {
            const t = c / SCORE_FILL_PARTICLES;
            const angle = -Math.PI * 0.75 + t * Math.PI * 1.5;
            positions[i] = scoreOffsetX + Math.cos(angle) * fillRadius;
            positions[i + 1] = Math.sin(angle) * fillRadius;
            positions[i + 2] = 0.2;
            scales[j] = 2.0;
            data[k] = 5; // Type: score fill
            data[k + 1] = angle;
            data[k + 2] = fillRadius;
            data[k + 3] = t;

            i += 3;
            j++;
            k += 4;
        }

        // Checkmark particles (appear when scanning)
        const checkmarkPoints = [
            // Left part of check
            [-4, 0], [-3, -1], [-2, -2], [-1, -1], [0, 0],
            // Right part of check (going up)
            [1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7],
        ];
        for (let c = 0; c < CHECKMARK_PARTICLES; c++) {
            const idx = c % checkmarkPoints.length;
            const pt = checkmarkPoints[idx];
            positions[i] = docOffsetX + docWidth / 2 - 8 + pt[0] * 0.8;
            positions[i + 1] = -docHeight / 2 + 8 + pt[1] * 0.8;
            positions[i + 2] = 1;
            scales[j] = c < checkmarkPoints.length ? 1.5 : 0;
            data[k] = 6; // Type: checkmark
            data[k + 1] = c;
            data[k + 2] = 0;
            data[k + 3] = 0;

            i += 3;
            j++;
            k += 4;
        }

        // Floating orbit particles
        for (let f = 0; f < FLOATING_CIRCLES; f++) {
            const angle = (f / FLOATING_CIRCLES) * Math.PI * 2;
            const radius = 35 + Math.random() * 12;
            positions[i] = Math.cos(angle) * radius;
            positions[i + 1] = Math.sin(angle) * radius;
            positions[i + 2] = (Math.random() - 0.5) * 10;
            scales[j] = 2 + Math.random() * 2.5;
            data[k] = 7; // Type: floating
            data[k + 1] = angle;
            data[k + 2] = radius;
            data[k + 3] = Math.random() * Math.PI * 2;

            i += 3;
            j++;
            k += 4;
        }

        // Sparkle particles around the score
        for (let s = 0; s < SPARKLE_PARTICLES; s++) {
            const angle = (s / SPARKLE_PARTICLES) * Math.PI * 2;
            const radius = 18 + Math.random() * 6;
            positions[i] = scoreOffsetX + Math.cos(angle) * radius;
            positions[i + 1] = Math.sin(angle) * radius;
            positions[i + 2] = Math.random() * 3;
            scales[j] = 0.8 + Math.random() * 1.2;
            data[k] = 8; // Type: sparkle
            data[k + 1] = angle;
            data[k + 2] = radius;
            data[k + 3] = Math.random() * Math.PI * 2;

            i += 3;
            j++;
            k += 4;
        }

        return { particles: { positions, scales }, particleData: data };
    }, []);

    useFrame((state) => {
        if (!groupRef.current) return;

        const positions = (groupRef.current.children[0] as THREE.Points).geometry.attributes.position.array as Float32Array;
        const scalesArray = (groupRef.current.children[0] as THREE.Points).geometry.attributes.scale.array as Float32Array;
        const time = state.clock.getElapsedTime();

        // Gentle floating motion
        groupRef.current.position.y = Math.sin(time * 0.3) * 1.5;
        groupRef.current.rotation.y = Math.sin(time * 0.2) * 0.05;

        const docHeight = 36;
        const scoreOffsetX = 20;

        // Scanning animation (slower, smoother)
        const scanCycle = (time * 0.4) % (Math.PI * 2);
        const scanY = Math.sin(scanCycle) * (docHeight / 2 - 3);
        const scanProgress = (Math.sin(scanCycle) + 1) / 2; // 0 to 1

        // Animated score (fills based on scan progress)
        const scoreValue = 0.85 + Math.sin(time * 0.5) * 0.1; // 75-95% oscillation
        const displayScore = scoreValue * scanProgress;

        let idx = 0;

        // Document border particles
        for (let p = 0; p < DOC_PARTICLES; p++) {
            const i3 = idx * 3;
            const i4 = idx * 4;
            const baseX = particleData[i4 + 1];
            const baseY = particleData[i4 + 2];
            const phase = particleData[i4 + 3];

            positions[i3] = baseX + Math.sin(time * 0.4 + phase * 0.05) * 0.25;
            positions[i3 + 1] = baseY + Math.cos(time * 0.35 + phase * 0.05) * 0.25;
            idx++;
        }

        // Text line particles (highlighted when scan passes)
        for (let p = 0; p < TEXT_LINE_PARTICLES; p++) {
            const i3 = idx * 3;
            const i4 = idx * 4;
            const baseX = particleData[i4 + 1];
            const lineY = particleData[i4 + 2];
            const lineIdx = particleData[i4 + 3];

            // Highlight effect when scan line passes
            const distToScan = Math.abs(lineY - scanY);
            const highlight = Math.max(0, 1 - distToScan / 3);

            positions[i3] = baseX + Math.sin(time * 0.3 + lineIdx) * 0.15;
            positions[i3 + 1] = lineY;
            scalesArray[idx] = 0.8 + highlight * 0.8;
            idx++;
        }

        // Scan line particles
        for (let p = 0; p < SCAN_LINE_PARTICLES; p++) {
            const i3 = idx * 3;
            const i4 = idx * 4;
            const t = particleData[i4 + 1];

            // Wave effect on scan line
            positions[i3 + 1] = scanY + Math.sin(time * 3 + t * Math.PI * 4) * 0.3;
            scalesArray[idx] = 1.8 - Math.abs(t - 0.5) * 1.2 + Math.sin(time * 4 + t * 10) * 0.2;
            idx++;
        }

        // Outer score ring
        for (let p = 0; p < SCORE_CIRCLE_OUTER; p++) {
            const i3 = idx * 3;
            const i4 = idx * 4;
            const angle = particleData[i4 + 1];
            const radius = particleData[i4 + 2];
            const t = particleData[i4 + 3];

            const pulse = 1 + Math.sin(time * 2 - t * 4) * 0.03;
            positions[i3] = scoreOffsetX + Math.cos(angle) * radius * pulse;
            positions[i3 + 1] = Math.sin(angle) * radius * pulse;
            idx++;
        }

        // Inner score ring
        for (let p = 0; p < SCORE_CIRCLE_INNER; p++) {
            const i3 = idx * 3;
            const i4 = idx * 4;
            const angle = particleData[i4 + 1];
            const radius = particleData[i4 + 2];
            const t = particleData[i4 + 3];

            const pulse = 1 + Math.sin(time * 2.5 + t * 3) * 0.04;
            positions[i3] = scoreOffsetX + Math.cos(angle) * radius * pulse;
            positions[i3 + 1] = Math.sin(angle) * radius * pulse;
            idx++;
        }

        // Score fill particles (animated based on score)
        for (let p = 0; p < SCORE_FILL_PARTICLES; p++) {
            const i3 = idx * 3;
            const i4 = idx * 4;
            const angle = particleData[i4 + 1];
            const radius = particleData[i4 + 2];
            const t = particleData[i4 + 3];

            const isVisible = t <= displayScore;
            const pulse = 1 + Math.sin(time * 3 - t * 6) * 0.08;

            positions[i3] = scoreOffsetX + Math.cos(angle) * radius * pulse;
            positions[i3 + 1] = Math.sin(angle) * radius * pulse;
            scalesArray[idx] = isVisible ? 2.2 + Math.sin(time * 4 + t * 10) * 0.4 : 0;
            idx++;
        }

        // Checkmark particles (appear when scan is high)
        for (let p = 0; p < CHECKMARK_PARTICLES; p++) {
            const i4 = idx * 4;
            const checkIdx = particleData[i4 + 1];

            // Fade in checkmark when scan is near complete
            const checkVisible = scanProgress > 0.7;
            const fadeIn = checkVisible ? Math.min(1, (scanProgress - 0.7) / 0.3) : 0;
            scalesArray[idx] = fadeIn * (1.5 + Math.sin(time * 5 + checkIdx * 0.5) * 0.3);
            idx++;
        }

        // Floating orbit particles
        for (let p = 0; p < FLOATING_CIRCLES; p++) {
            const i3 = idx * 3;
            const i4 = idx * 4;
            const baseAngle = particleData[i4 + 1];
            const baseRadius = particleData[i4 + 2];
            const phase = particleData[i4 + 3];

            const angle = baseAngle + time * 0.1;
            const radius = baseRadius + Math.sin(time * 0.3 + phase) * 4;

            positions[i3] = Math.cos(angle) * radius;
            positions[i3 + 1] = Math.sin(angle) * radius + Math.sin(time * 0.25 + phase) * 2;
            positions[i3 + 2] = Math.sin(time * 0.2 + phase) * 5;
            idx++;
        }

        // Sparkle particles
        for (let p = 0; p < SPARKLE_PARTICLES; p++) {
            const i3 = idx * 3;
            const i4 = idx * 4;
            const baseAngle = particleData[i4 + 1];
            const baseRadius = particleData[i4 + 2];
            const phase = particleData[i4 + 3];

            const angle = baseAngle + Math.sin(time * 0.5 + phase) * 0.3;
            const radius = baseRadius + Math.sin(time * 2 + phase) * 2;

            positions[i3] = scoreOffsetX + Math.cos(angle) * radius;
            positions[i3 + 1] = Math.sin(angle) * radius;

            // Twinkle effect
            scalesArray[idx] = (0.8 + Math.sin(time * 6 + phase * 10) * 0.6) * (displayScore > 0.3 ? 1 : 0);
            idx++;
        }

        (groupRef.current.children[0] as THREE.Points).geometry.attributes.position.needsUpdate = true;
        (groupRef.current.children[0] as THREE.Points).geometry.attributes.scale.needsUpdate = true;
    });

    const circleTexture = useMemo(() => {
        if (typeof document === 'undefined') return null;
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const context = canvas.getContext('2d');
        if (context) {
            // Solid filled circle for consistent intensity
            context.beginPath();
            context.arc(16, 16, 14, 0, 2 * Math.PI);
            context.fillStyle = 'white';
            context.fill();
        }
        return new THREE.CanvasTexture(canvas);
    }, []);

    const color = theme === "dark" ? "#ffffff" : "#000000";

    return (
        <group ref={groupRef}>
            <points>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" count={particles.positions.length / 3} array={particles.positions} itemSize={3} args={[particles.positions, 3]} />
                    <bufferAttribute attach="attributes-scale" count={particles.scales.length} array={particles.scales} itemSize={1} args={[particles.scales, 1]} />
                </bufferGeometry>
                <pointsMaterial color={color} size={2.5} sizeAttenuation={true} transparent={true} opacity={0.9} map={circleTexture} alphaTest={0.1} depthWrite={false} />
            </points>
        </group>
    );
}

export function ATSScoreVisual({ className }: { className?: string }) {
    return (
        <div className={`w-full h-full min-h-[300px] ${className}`}>
            <Canvas camera={{ position: [0, 0, 60], fov: 75 }} gl={{ antialias: true, alpha: true }}>
                <ATSScanner />
            </Canvas>
        </div>
    );
}
