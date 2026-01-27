"use client";

import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "next-themes";

const SEPARATION = 30; // Distance between dots
const AMOUNTX = 100; // Number of dots on X axis
const AMOUNTY = 100; // Number of dots on Y axis

function Dots() {
    const meshRef = useRef<THREE.Points>(null!);
    const { theme } = useTheme();

    // Jellyfish parameters
    const BELL_PARTICLES = 800; // Reduced density
    const TENTACLES = 12;
    const PARTICLES_PER_TENTACLE = 30; // Reduced density
    const TOTAL_PARTICLES = BELL_PARTICLES + (TENTACLES * PARTICLES_PER_TENTACLE);

    // Current position for smooth lerping
    const currentPos = useRef(new THREE.Vector3(-50, 0, 0));
    const lastMousePos = useRef(new THREE.Vector3(-50, 0, 0));
    const mouseSpeed = useRef(0);

    // Generate particles
    const { particles, particleData } = useMemo(() => {
        const positions = new Float32Array(TOTAL_PARTICLES * 3);
        const scales = new Float32Array(TOTAL_PARTICLES);
        const data = new Float32Array(TOTAL_PARTICLES * 4); // type (0=bell, 1=tentacle), angle, radius/offset, height/index

        let i = 0;
        let j = 0;
        let k = 0;

        // Generate Bell
        for (let b = 0; b < BELL_PARTICLES; b++) {
            // Random point on a hemisphere surface
            const theta = Math.random() * Math.PI * 2; // Azimuthal angle
            const phi = Math.acos(Math.random()); // Polar angle (0 to PI/2 for hemisphere)

            // Increased radius for "half screen" size (approx 40-50 units)
            const radius = 40;

            // Store initial data
            positions[i] = 0;
            positions[i + 1] = 0;
            positions[i + 2] = 0;

            scales[j] = 1.5;

            // Type 0: Bell
            data[k] = 0;
            data[k + 1] = theta;
            data[k + 2] = phi;
            data[k + 3] = radius;

            i += 3;
            j++;
            k += 4;
        }

        // Generate Tentacles
        for (let t = 0; t < TENTACLES; t++) {
            const tentacleAngle = (t / TENTACLES) * Math.PI * 2;
            const tentacleRadius = 25; // Start radius from center (wider bell)

            for (let p = 0; p < PARTICLES_PER_TENTACLE; p++) {
                positions[i] = 0;
                positions[i + 1] = 0;
                positions[i + 2] = 0;

                scales[j] = 1;

                // Type 1: Tentacle
                data[k] = 1;
                data[k + 1] = tentacleAngle;
                data[k + 2] = tentacleRadius;
                data[k + 3] = p; // Index in tentacle

                i += 3;
                j++;
                k += 4;
            }
        }

        return { particles: { positions, scales }, particleData: data };
    }, []);

    useFrame((state) => {
        if (!meshRef.current) return;

        const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
        const scales = meshRef.current.geometry.attributes.scale.array as Float32Array;
        const time = state.clock.getElapsedTime();

        // Mouse following logic
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(state.pointer, state.camera);

        const target = new THREE.Vector3();
        raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), target);

        if (target) {
            // Calculate mouse speed
            const dist = target.distanceTo(lastMousePos.current);
            // Decay speed (Very slow transition)
            mouseSpeed.current = THREE.MathUtils.lerp(mouseSpeed.current, dist, 0.01);
            lastMousePos.current.copy(target);

            // Lerp current position to target (Very slow follow)
            currentPos.current.lerp(target, 0.005);
        } else {
            mouseSpeed.current = THREE.MathUtils.lerp(mouseSpeed.current, 0, 0.01);
        }

        // Determine chaos level based on speed
        // If speed is high, chaos is 1. If speed is low, chaos is 0.
        // Threshold for "moving"
        const isMoving = mouseSpeed.current > 0.1;
        const chaosLevel = isMoving ? 1 : 0;

        // We want a smooth transition for the "shape" factor
        // 1 = full shape, 0 = full chaos
        // If moving, shape factor goes to 0. If still, goes to 1.
        // We can store this in a ref to lerp it
        // Let's use a local variable for now, but we need state persistence for smooth transition
        // Actually, let's just use mouseSpeed directly to modulate the offset.

        // Let's define a "shapeStrength" that lerps.
        // We can't easily use a ref for a simple variable in the loop without it being a member.
        // But we can just use the mouseSpeed.current as a driver.
        // Let's say max speed for chaos is 2.0.
        const chaosFactor = Math.min(mouseSpeed.current * 2, 1); // 0 to 1
        const shapeStrength = 1 - chaosFactor; // 1 (still) to 0 (moving fast)

        // Animate particles
        for (let i = 0; i < TOTAL_PARTICLES; i++) {
            const i3 = i * 3;
            const i4 = i * 4;

            const type = particleData[i4];

            // Target local position (relative to center)
            let tx = 0, ty = 0, tz = 0;

            if (type === 0) { // Bell
                const theta = particleData[i4 + 1];
                const phi = particleData[i4 + 2];
                const baseRadius = particleData[i4 + 3];

                // Pulsing effect (Slower)
                const pulse = Math.sin(time * 0.2) * 0.05 + 1; // Slower pulse
                const r = baseRadius * pulse;

                // Add some noise/wobble
                const wobble = Math.sin(theta * 3 + time * 0.2) * 0.5;

                tx = r * Math.sin(phi) * Math.cos(theta);
                tz = r * Math.sin(phi) * Math.sin(theta);
                ty = r * Math.cos(phi) + wobble; // Hemisphere top

            } else { // Tentacle
                const angle = particleData[i4 + 1];
                const radius = particleData[i4 + 2];
                const index = particleData[i4 + 3];

                // Base position at the rim of the bell
                const rimX = radius * Math.cos(angle);
                const rimZ = radius * Math.sin(angle);
                const rimY = 0; // Bottom of bell roughly

                // Tentacle extends downwards (negative Y)
                // Add sine wave motion (Slower)
                const depth = index * 2.0; // Longer tentacles
                const waveX = Math.sin(index * 0.1 + time * 0.5) * 5;
                const waveZ = Math.cos(index * 0.1 + time * 0.4) * 5;

                tx = rimX + waveX;
                ty = rimY - depth;
                tz = rimZ + waveZ;
            }

            // Apply chaos/swarm behavior
            // If chaos is high, particles should be randomly around the target, not in shape
            // We can use a pseudo-random offset based on index
            const randomX = (Math.sin(i * 12.34) * 100);
            const randomY = (Math.cos(i * 43.21) * 100);
            const randomZ = (Math.sin(i * 56.78) * 100);

            // Interpolate between Shape Position and Random Position
            // Actually, "randomly follow the cursor" means they are loosely attracted to currentPos
            // So target is currentPos + (ShapePos * shapeStrength) + (RandomPos * chaosFactor)

            // But we want them to "follow".
            // If chaos is high, they should just be a cloud around currentPos.

            const localX = (tx * shapeStrength) + (randomX * chaosFactor);
            const localY = (ty * shapeStrength) + (randomY * chaosFactor);
            const localZ = (tz * shapeStrength) + (randomZ * chaosFactor);

            positions[i3] = currentPos.current.x + localX;
            positions[i3 + 1] = currentPos.current.y + localY;
            positions[i3 + 2] = currentPos.current.z + localZ;
        }

        meshRef.current.geometry.attributes.position.needsUpdate = true;
        meshRef.current.geometry.attributes.scale.needsUpdate = true;
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
            context.arc(16, 16, 16, 0, 2 * Math.PI);
            context.fillStyle = 'white';
            context.fill();
        }
        return new THREE.CanvasTexture(canvas);
    }, []);

    const color = theme === "dark" ? "#ffffff" : "#000000";

    return (
        <points ref={meshRef}>
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
                size={1.5}
                sizeAttenuation={true}
                transparent={true}
                opacity={0.8}
                map={circleTexture}
                alphaTest={0.5}
            />
        </points>
    );
}

export function WaterDotsBackground({ className }: { className?: string }) {
    return (
        <div className={`absolute inset-0 w-full h-full ${className}`}>
            <Canvas
                camera={{ position: [0, 0, 100], fov: 75 }}
                gl={{ antialias: true, alpha: true }}
            >
                <Dots />
            </Canvas>
        </div>
    );
}
