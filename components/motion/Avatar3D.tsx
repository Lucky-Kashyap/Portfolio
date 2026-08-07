"use client";

import { Suspense, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { cn } from "@/lib/utils";
import { Avatar3DScene } from "@/components/motion/Avatar3DScene";

type Avatar3DProps = {
  faceUrl: string;
  speaking?: boolean;
  className?: string;
  onActivate?: () => void;
};

/**
 * Transparent Three.js canvas — floating modern AI avatar.
 */
export function Avatar3D({
  faceUrl,
  speaking = false,
  className,
  onActivate,
}: Avatar3DProps) {
  const [ready, setReady] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={wrapRef}
      className={cn("absolute inset-0 size-full", className)}
      onClick={onActivate}
      role={onActivate ? "button" : undefined}
      tabIndex={onActivate ? 0 : undefined}
      onKeyDown={
        onActivate
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onActivate();
              }
            }
          : undefined
      }
      aria-label={
        onActivate
          ? speaking
            ? "Stop AI introduction"
            : "Play AI introduction"
          : undefined
      }
    >
      {!ready ? (
        <div
          className="absolute inset-0 flex items-center justify-center"
          aria-hidden
        >
          <p className="animate-pulse text-[10px] tracking-[0.22em] text-accent-cyan/80 uppercase">
            Optimizing 3D mesh…
          </p>
        </div>
      ) : null}
      <Canvas
        className="absolute inset-0 !bg-transparent"
        dpr={[1, 1.85]}
        gl={{
          antialias: true,
          alpha: true,
          premultipliedAlpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        camera={{ position: [0, 0.15, 5.6], fov: 32, near: 0.1, far: 40 }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          setReady(true);
        }}
        aria-hidden
      >
        <Suspense fallback={null}>
          <Avatar3DScene faceUrl={faceUrl} speaking={speaking} />
        </Suspense>
      </Canvas>
    </div>
  );
}
