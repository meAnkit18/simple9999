"use client";

import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "next-themes";

function FloatingDocument() {
    const groupRef = useRef<THREE.Group>(null!);
    const { theme } = useTheme();

    // Balanced document parameters - more spaced out
    const BORDER_ROWS = 4;
    const PARTICLES_PER_ROW = 80;
    const OUTLINE_PARTICLES = BORDER_ROWS * PARTICLES_PER_ROW;
    const INNER_PARTICLES = 35;
    const FLOATING_CIRCLES = 18;
    const TOTAL_PARTICLES = OUTLINE_PARTICLES + INNER_PARTICLES + FLOATING_CIRCLES;

    // Generate particles
    const { particles, particleData } = useMemo(() => {
        const positions = new Float32Array(TOTAL_PARTICLES * 3);
        const scales = new Float32Array(TOTAL_PARTICLES);
        const data = new Float32Array(TOTAL_PARTICLES * 4);

        let i = 0;
        let j = 0;
        let k = 0;

        // Document dimensions
        const docWidth = 60;
        const docHeight = 66;
        const foldSize = 16;
        const rowSpacing = 2.5; // Spacing between border rows

        // Generate document outline with multiple rows
        for (let row = 0; row < BORDER_ROWS; row++) {
            const inset = row * rowSpacing;
            const w = docWidth - inset * 2;
            const h = docHeight - inset * 2;
            const f = foldSize - inset * 0.5;

            for (let d = 0; d < PARTICLES_PER_ROW; d++) {
                let px = 0, py = 0;
                const t = d / PARTICLES_PER_ROW;

                const perimeter = w * 2 + h * 2 - f * 2 + f * Math.SQRT2;
                const pos = t * perimeter;

                if (pos < h) {
                    px = -w / 2;
                    py = -h / 2 + pos;
                } else if (pos < h + (w - f)) {
                    const edgePos = pos - h;
                    px = -w / 2 + edgePos;
                    py = h / 2;
                } else if (pos < h + (w - f) + f * Math.SQRT2) {
                    const foldPos = (pos - h - (w - f)) / (f * Math.SQRT2);
                    px = w / 2 - f + foldPos * f;
                    py = h / 2 - foldPos * f;
                } else if (pos < h + (w - f) + f * Math.SQRT2 + (h - f)) {
                    const edgePos = pos - h - (w - f) - f * Math.SQRT2;
                    px = w / 2;
                    py = h / 2 - f - edgePos;
                } else {
                    const edgePos = pos - h - (w - f) - f * Math.SQRT2 - (h - f);
                    px = w / 2 - edgePos;
                    py = -h / 2;
                }

                positions[i] = px;
                positions[i + 1] = py;
                positions[i + 2] = 0;
                scales[j] = 1.2 + row * 0.1;
                data[k] = 0;
                data[k + 1] = px;
                data[k + 2] = py;
                data[k + 3] = Math.random() * Math.PI * 2;

                i += 3;
                j++;
                k += 4;
            }
        }

        // Generate inner particles (text lines and scattered dots)
        for (let d = 0; d < INNER_PARTICLES; d++) {
            let px = 0, py = 0;

            if (d < INNER_PARTICLES * 0.6) {
                // Text line representations
                const lineIndex = Math.floor(d / 10);
                const lineY = 8 - lineIndex * 4;
                const lineWidth = 12 + Math.random() * 4;
                px = -docWidth / 2 + 3 + Math.random() * lineWidth;
                py = lineY + (Math.random() - 0.5) * 0.5;
            } else {
                // Scattered inner dots
                px = (Math.random() - 0.5) * (docWidth - 6);
                py = (Math.random() - 0.5) * (docHeight - 6);
                // Exclude fold corner
                if (px > docWidth / 2 - foldSize - 3 && py > docHeight / 2 - foldSize - 3) {
                    px = -docWidth / 2 + 3 + Math.random() * 10;
                }
            }

            positions[i] = px;
            positions[i + 1] = py;
            positions[i + 2] = 0;
            scales[j] = 0.8 + Math.random() * 0.4;
            data[k] = 0;
            data[k + 1] = px;
            data[k + 2] = py;
            data[k + 3] = Math.random() * Math.PI * 2;

            i += 3;
            j++;
            k += 4;
        }

        // Generate floating circles at varying distances
        for (let f = 0; f < FLOATING_CIRCLES; f++) {
            const angle = (f / FLOATING_CIRCLES) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
            const radius = 20 + Math.random() * 15;

            positions[i] = Math.cos(angle) * radius;
            positions[i + 1] = Math.sin(angle) * radius;
            positions[i + 2] = (Math.random() - 0.5) * 8;

            scales[j] = 1.5 + Math.random() * 2.5;

            data[k] = 1;
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
        const time = state.clock.getElapsedTime();

        // Gentle floating
        groupRef.current.rotation.y = Math.sin(time * 0.3) * 0.08;
        groupRef.current.rotation.x = Math.cos(time * 0.2) * 0.04;
        groupRef.current.position.y = Math.sin(time * 0.4) * 2;

        // Animate particles
        for (let i = 0; i < TOTAL_PARTICLES; i++) {
            const i3 = i * 3;
            const i4 = i * 4;

            const type = particleData[i4];

            if (type === 0) { // Document particles
                const baseX = particleData[i4 + 1];
                const baseY = particleData[i4 + 2];
                const phase = particleData[i4 + 3];

                // Subtle floating movement
                const offsetX = Math.sin(time * 0.5 + phase) * 0.3;
                const offsetY = Math.cos(time * 0.4 + phase) * 0.3;
                const scale = 1 + Math.sin(time * 0.5) * 0.02;

                positions[i3] = baseX * scale + offsetX;
                positions[i3 + 1] = baseY * scale + offsetY;
            } else { // Floating circles
                const baseAngle = particleData[i4 + 1];
                const baseRadius = particleData[i4 + 2];
                const phase = particleData[i4 + 3];

                const angle = baseAngle + time * 0.12;
                const radiusOffset = Math.sin(time * 0.35 + phase) * 4;
                const radius = baseRadius + radiusOffset;

                positions[i3] = Math.cos(angle) * radius;
                positions[i3 + 1] = Math.sin(angle) * radius + Math.sin(time * 0.3 + phase) * 2;
                positions[i3 + 2] = Math.sin(time * 0.25 + phase) * 4;
            }
        }

        (groupRef.current.children[0] as THREE.Points).geometry.attributes.position.needsUpdate = true;
    });

    // Generate circle texture
    const circleTexture = useMemo(() => {
        if (typeof document === 'undefined') return null;
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const context = canvas.getContext('2d');
        if (context) {
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
                    <bufferAttribute
                        attach="attributes-position"
                        count={particles.positions.length / 3}
                        array={particles.positions}
                        itemSize={3}
                        args={[particles.positions, 3]}
                    />
                    <bufferAttribute
                        attach="attributes-scale"
                        count={particles.scales.length}
                        array={particles.scales}
                        itemSize={1}
                        args={[particles.scales, 1]}
                    />
                </bufferGeometry>
                <pointsMaterial
                    color={color}
                    size={2}
                    sizeAttenuation={true}
                    transparent={true}
                    opacity={0.85}
                    map={circleTexture}
                    alphaTest={0.5}
                />
            </points>
        </group>
    );
}

export function ScatteredDocumentVisual({ className }: { className?: string }) {
    return (
        <div className={`w-full h-full min-h-[300px] ${className}`}>
            <Canvas
                camera={{ position: [0, 0, 42], fov: 75 }}
                gl={{ antialias: true, alpha: true }}
            >
                <FloatingDocument />
            </Canvas>
        </div>
    );
}
