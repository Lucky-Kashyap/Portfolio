"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "@/components/theme/ThemeProvider";
import { usePrefersReducedMotion } from "@/hooks/useMotionPrefs";

function ParticleField({ count = 900 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const n =
      typeof window !== "undefined" && window.innerWidth < 768
        ? Math.min(count, 420)
        : count;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const i3 = i * 3;
      arr[i3] = (Math.random() - 0.5) * 14;
      arr[i3 + 1] = (Math.random() - 0.5) * 9;
      arr[i3 + 2] = (Math.random() - 0.5) * 8;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    const pts = ref.current;
    if (!pts) return;
    const t = state.clock.elapsedTime;
    pts.rotation.y = t * 0.04;
    pts.rotation.x = Math.sin(t * 0.12) * 0.08;
    pts.position.y = Math.sin(t * 0.25) * 0.12;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#7dd3fc"
        size={0.028}
        sizeAttenuation
        depthWrite={false}
        opacity={0.72}
      />
    </Points>
  );
}

function OrbitRing({
  radius,
  speed,
  color,
  tilt,
}: {
  radius: number;
  speed: number;
  color: string;
  tilt: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = state.clock.elapsedTime * speed;
  });

  return (
    <mesh ref={ref} rotation={[tilt, 0.2, 0]}>
      <torusGeometry args={[radius, 0.012, 16, 120]} />
      <meshBasicMaterial color={color} transparent opacity={0.35} />
    </mesh>
  );
}

function HeroSculpture() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const { x, y } = state.pointer;
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      x * 0.35,
      0.04,
    );
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      -y * 0.2,
      0.04,
    );
  });

  return (
    <group ref={group} position={[1.6, 0.15, 0]}>
      <Float speed={1.4} rotationIntensity={0.35} floatIntensity={0.55}>
        <mesh>
          <icosahedronGeometry args={[1.05, 1]} />
          <meshStandardMaterial
            color="#0b1220"
            emissive="#0ea5e9"
            emissiveIntensity={0.28}
            metalness={0.85}
            roughness={0.22}
            wireframe
          />
        </mesh>
        <mesh scale={0.72}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#7dd3fc"
            emissive="#38bdf8"
            emissiveIntensity={0.45}
            metalness={0.6}
            roughness={0.18}
            transparent
            opacity={0.55}
          />
        </mesh>
      </Float>
      <OrbitRing radius={1.55} speed={0.22} color="#7dd3fc" tilt={0.7} />
      <OrbitRing radius={1.9} speed={-0.14} color="#94a3b8" tilt={-0.45} />
    </group>
  );
}

function Scene({
  bg,
  accent,
}: {
  bg: string;
  accent: string;
}) {
  return (
    <>
      <color attach="background" args={[bg]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 3, 2]} intensity={1.1} color="#e2e8f0" />
      <pointLight position={[-3, 1, 2]} intensity={1.4} color={accent} />
      <ParticleField />
      <HeroSculpture />
      <fog attach="fog" args={[bg, 6, 16]} />
    </>
  );
}

/**
 * Scroll-friendly Three.js hero atmosphere — particles + reactive sculpture.
 */
export function HeroWebGL({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion();
  const { theme } = useTheme();
  const bg = theme === "light" ? "#f4f7fb" : "#03060b";
  const accent = theme === "light" ? "#0284c7" : "#38bdf8";

  if (reduced) return null;

  return (
    <div className={className} aria-hidden>
      <Canvas
        dpr={[1, 1.6]}
        camera={{ position: [0, 0, 5.2], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ width: "100%", height: "100%" }}
      >
        <Suspense fallback={null}>
          <Scene bg={bg} accent={accent} />
        </Suspense>
      </Canvas>
    </div>
  );
}
