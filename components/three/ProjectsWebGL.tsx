"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { usePrefersReducedMotion } from "@/hooks/useMotionPrefs";

function DriftMesh() {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime;
    mesh.current.rotation.x = t * 0.12;
    mesh.current.rotation.y = t * 0.18;
  });

  return (
    <Float speed={1.1} floatIntensity={0.4} rotationIntensity={0.2}>
      <mesh ref={mesh}>
        <torusKnotGeometry args={[0.85, 0.22, 96, 16]} />
        <meshStandardMaterial
          color="#0b1524"
          emissive="#0ea5e9"
          emissiveIntensity={0.35}
          metalness={0.9}
          roughness={0.25}
          wireframe
        />
      </mesh>
    </Float>
  );
}

function Dust({ count = 220 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 5;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.03;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#7dd3fc"
        size={0.03}
        sizeAttenuation
        depthWrite={false}
        opacity={0.5}
      />
    </Points>
  );
}

/** Subtle Three.js knot + dust for Projects atmosphere (desktop). */
export function ProjectsWebGL({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion();
  if (reduced) return null;

  return (
    <div className={className} aria-hidden>
      <Canvas
        dpr={[1, 1.35]}
        camera={{ position: [0, 0, 4.2], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <pointLight position={[2, 2, 3]} intensity={1.2} color="#38bdf8" />
          <DriftMesh />
          <Dust />
        </Suspense>
      </Canvas>
    </div>
  );
}
