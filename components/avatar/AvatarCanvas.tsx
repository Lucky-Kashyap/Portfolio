"use client";

import React, {
  Suspense,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import * as THREE from "three";
import { cn } from "@/lib/utils";
import {
  FallbackPortraitModel,
  GltfAvatarModel,
} from "@/components/avatar/AvatarModel";
import { avatarMorphState } from "@/components/avatar/morphState";

export type AvatarCanvasProps = {
  modelUrl: string;
  /** Used when GLB fails / while loading */
  posterUrl: string;
  amplitude?: number;
  /** Pause render loop when off-screen */
  visible?: boolean;
  className?: string;
  onReady?: () => void;
};

function SceneLights({ speaking }: { speaking: boolean }) {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[2.4, 3.2, 2.8]}
        intensity={1.15}
        color="#f5f7fa"
        castShadow
      />
      <directionalLight
        position={[-2.2, 1.4, -0.8]}
        intensity={0.45}
        color="#c5d4e0"
      />
      <spotLight
        position={[0, 2.8, 2.2]}
        angle={0.45}
        penumbra={0.65}
        intensity={speaking ? 0.9 : 0.55}
        color="#e8eef4"
      />
    </>
  );
}

function CameraDolly() {
  const { camera } = useThree();
  useFrame(() => {
    const progress = avatarMorphState.progress;
    const z = THREE.MathUtils.lerp(4.85, 5.35, progress);
    const y = THREE.MathUtils.lerp(0.2, 0.08, progress);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, z, 0.08);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, y, 0.08);
    camera.lookAt(0, 0.15, 0);
  });
  return null;
}

class ErrorCatch extends React.Component<
  { onError: () => void; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

function ModelSwitch({
  modelUrl,
  posterUrl,
  amplitude,
  paused,
}: {
  modelUrl: string;
  posterUrl: string;
  amplitude: number;
  paused: boolean;
}) {
  /** Default to portrait mesh; upgrade to GLTF only when the file exists. */
  const [useGltf, setUseGltf] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(modelUrl, { method: "HEAD" })
      .then((res) => {
        if (!cancelled && res.ok) setUseGltf(true);
      })
      .catch(() => {
        /* keep portrait fallback */
      });
    return () => {
      cancelled = true;
    };
  }, [modelUrl]);

  if (!useGltf) {
    return (
      <FallbackPortraitModel
        textureUrl={posterUrl}
        amplitude={amplitude}
        paused={paused}
      />
    );
  }

  return (
    <ErrorCatch onError={() => setUseGltf(false)}>
      <Suspense
        fallback={
          <FallbackPortraitModel
            textureUrl={posterUrl}
            amplitude={amplitude}
            paused={paused}
          />
        }
      >
        <GltfAvatarModel
          url={modelUrl}
          amplitude={amplitude}
          paused={paused}
        />
      </Suspense>
    </ErrorCatch>
  );
}

/**
 * Three.js canvas for the portfolio AI avatar (GLTF + poster fallback).
 * Idle muted by default; parent drives amplitude for lip sync.
 */
export function AvatarCanvas({
  modelUrl,
  posterUrl,
  amplitude = 0,
  visible = true,
  className,
  onReady,
}: AvatarCanvasProps) {
  const [ready, setReady] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={wrapRef}
      className={cn("absolute inset-0 size-full", className)}
      aria-hidden
    >
      {!ready ? (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={posterUrl}
            alt=""
            className="size-full object-cover object-[center_12%] opacity-70"
          />
        </div>
      ) : null}
      <Canvas
        className="absolute inset-0 !bg-transparent"
        dpr={[1, 1.75]}
        frameloop={visible ? "always" : "never"}
        gl={{
          antialias: true,
          alpha: true,
          premultipliedAlpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
        camera={{ position: [0, 0.2, 4.85], fov: 34, near: 0.1, far: 40 }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          setReady(true);
          onReady?.();
        }}
      >
        <SceneLights speaking={amplitude > 0.08} />
        <CameraDolly />
        <ModelSwitch
          modelUrl={modelUrl}
          posterUrl={posterUrl}
          amplitude={amplitude}
          paused={!visible}
        />
        <ContactShadows
          position={[0, -1.75, 0]}
          opacity={0.45}
          scale={5}
          blur={2.8}
          far={4}
          color="#000000"
        />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
