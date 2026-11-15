"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PointMaterial, Points } from "@react-three/drei";
import * as THREE from "three";

const POINT_COUNT = 2400;
const RADIUS = 2.2;

/**
 * Deterministic, evenly distributed sphere of points (Fibonacci lattice) —
 * no Math.random, so every visit renders the identical globe.
 */
function fibonacciSphere(count: number, radius: number): Float32Array {
  const positions = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i += 1) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    positions[i * 3] = Math.cos(theta) * r * radius;
    positions[i * 3 + 1] = y * radius;
    positions[i * 3 + 2] = Math.sin(theta) * r * radius;
  }
  return positions;
}

function Globe({ animate }: { animate: boolean }) {
  const group = useRef<THREE.Group>(null);
  const positions = useMemo(() => fibonacciSphere(POINT_COUNT, RADIUS), []);

  useFrame((state, delta) => {
    if (!animate || !group.current) return;
    group.current.rotation.y += delta * 0.055;
    // Gentle parallax toward the pointer; lerp keeps it weighty, not jittery.
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      state.pointer.y * -0.18,
      0.03,
    );
    group.current.rotation.z = THREE.MathUtils.lerp(
      group.current.rotation.z,
      state.pointer.x * 0.08,
      0.03,
    );
  });

  return (
    <group ref={group} rotation={[-0.3, 0, 0.12]}>
      <Points positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#22d3ae"
          size={0.022}
          sizeAttenuation
          depthWrite={false}
          opacity={0.85}
        />
      </Points>
      <mesh>
        <icosahedronGeometry args={[RADIUS * 0.72, 1]} />
        <meshBasicMaterial
          color="#67e8f9"
          wireframe
          transparent
          opacity={0.1}
        />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[RADIUS * 0.34, 2]} />
        <meshBasicMaterial
          color="#22d3ae"
          wireframe
          transparent
          opacity={0.22}
        />
      </mesh>
    </group>
  );
}

export interface HeroSceneProps {
  /** false = respect prefers-reduced-motion: render one static frame */
  animate: boolean;
}

/**
 * The hero's 3D backdrop: a slowly rotating point-cloud globe with a
 * wireframe core. Imported with next/dynamic (ssr: false) by the Hero.
 */
export default function HeroScene({ animate }: HeroSceneProps) {
  return (
    <Canvas
      // "demand" renders a single frame and stops — the reduced-motion path
      // costs one draw, not a running loop.
      frameloop={animate ? "always" : "demand"}
      dpr={[1, 2]}
      camera={{ position: [0, 0, 5.4], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      className="pointer-events-none"
      aria-hidden
    >
      <Globe animate={animate} />
    </Canvas>
  );
}
