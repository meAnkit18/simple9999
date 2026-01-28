"use client";

import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "next-themes";

function MultipleResumes() {
    const groupRef = useRef<THREE.Group>(null!);
    const { theme } = useTheme();

    // Multiple documents stacked/scattered
    const DOCS = 4;
    const PARTICLES_PER_DOC = 60;
    const FLOATING_CIRCLES = 20;
    const TOTAL_PARTICLES = DOCS * PARTICLES_PER_DOC + FLOATING_CIRCLES;

    const { particles, particleData } = useMemo(() => {
        const positions = new Float32Array(TOTAL_PARTICLES * 3);
        const scales = new Float32Array(TOTAL_PARTICLES);
        const data = new Float32Array(TOTAL_PARTICLES * 4);

        let i = 0;
        let j = 0;
        let k = 0;

        const docWidth = 18;
        const docHeight = 24;

        // Generate multiple document outlines at different positions/rotations
        const docOffsets = [
            { x: -12, y: 8, z: 0, rot: 0.15 },
            { x: 8, y: 5, z: 2, rot: -0.1 },
            { x: -5, y: -8, z: 4, rot: 0.08 },
            { x: 10, y: -10, z: 6, rot: -0.2 },
        ];

        for (let doc = 0; doc < DOCS; doc++) {
            const offset = docOffsets[doc];

            for (let d = 0; d < PARTICLES_PER_DOC; d++) {
                let px = 0, py = 0;
                const t = d / PARTICLES_PER_DOC;
                const perimeter = (docWidth + docHeight) * 2;
                const pos = t * perimeter;

                if (pos < docHeight) {
                    px = -docWidth / 2;
                    py = -docHeight / 2 + pos;
                } else if (pos < docHeight + docWidth) {
                    px = -docWidth / 2 + (pos - docHeight);
                    py = docHeight / 2;
                } else if (pos < docHeight * 2 + docWidth) {
                    px = docWidth / 2;
                    py = docHeight / 2 - (pos - docHeight - docWidth);
                } else {
                    px = docWidth / 2 - (pos - docHeight * 2 - docWidth);
                    py = -docHeight / 2;
                }

                // Apply rotation
                const cos = Math.cos(offset.rot);
                const sin = Math.sin(offset.rot);
                const rx = px * cos - py * sin;
                const ry = px * sin + py * cos;

                positions[i] = rx + offset.x;
                positions[i + 1] = ry + offset.y;
                positions[i + 2] = offset.z;
                scales[j] = 1.3;
                data[k] = 0;
                data[k + 1] = positions[i];
                data[k + 2] = positions[i + 1];
                data[k + 3] = Math.random() * Math.PI * 2;

                i += 3;
                j++;
                k += 4;
            }
        }

        // Floating circles
        for (let f = 0; f < FLOATING_CIRCLES; f++) {
            const angle = (f / FLOATING_CIRCLES) * Math.PI * 2;
            const radius = 28 + Math.random() * 10;

            positions[i] = Math.cos(angle) * radius;
            positions[i + 1] = Math.sin(angle) * radius;
            positions[i + 2] = Math.random() * 8;
            scales[j] = 2 + Math.random() * 2;
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

        groupRef.current.rotation.y = Math.sin(time * 0.2) * 0.1;
        groupRef.current.position.y = Math.sin(time * 0.3) * 2;

        for (let i = 0; i < TOTAL_PARTICLES; i++) {
            const i3 = i * 3;
            const i4 = i * 4;
            const type = particleData[i4];

            if (type === 0) {
                const baseX = particleData[i4 + 1];
                const baseY = particleData[i4 + 2];
                const phase = particleData[i4 + 3];
                positions[i3] = baseX + Math.sin(time * 0.4 + phase) * 0.3;
                positions[i3 + 1] = baseY + Math.cos(time * 0.3 + phase) * 0.3;
            } else {
                const baseAngle = particleData[i4 + 1];
                const baseRadius = particleData[i4 + 2];
                const phase = particleData[i4 + 3];
                const angle = baseAngle + time * 0.1;
                const radius = baseRadius + Math.sin(time * 0.3 + phase) * 3;
                positions[i3] = Math.cos(angle) * radius;
                positions[i3 + 1] = Math.sin(angle) * radius;
            }
        }

        (groupRef.current.children[0] as THREE.Points).geometry.attributes.position.needsUpdate = true;
    });

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
                    <bufferAttribute attach="attributes-position" count={particles.positions.length / 3} array={particles.positions} itemSize={3} args={[particles.positions, 3]} />
                    <bufferAttribute attach="attributes-scale" count={particles.scales.length} array={particles.scales} itemSize={1} args={[particles.scales, 1]} />
                </bufferGeometry>
                <pointsMaterial color={color} size={2} sizeAttenuation={true} transparent={true} opacity={0.85} map={circleTexture} alphaTest={0.5} />
            </points>
        </group>
    );
}

export function ResumeCustomizationVisual({ className }: { className?: string }) {
    return (
        <div className={`w-full h-full min-h-[300px] ${className}`}>
            <Canvas camera={{ position: [0, 0, 50], fov: 75 }} gl={{ antialias: true, alpha: true }}>
                <MultipleResumes />
            </Canvas>
        </div>
    );
}
