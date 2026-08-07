"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { avatarMorphState } from "@/components/avatar/morphState";

type ModelProps = {
  url: string;
  amplitude: number;
  paused?: boolean;
};

/** GLTF character — idle clip + jaw / morph lip sync when available. */
export function GltfAvatarModel({
  url,
  amplitude,
  paused = false,
}: ModelProps) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(url);
  const clone = useMemo(() => scene.clone(true), [scene]);
  const { actions, mixer } = useAnimations(animations, group);
  const jawRef = useRef<THREE.Object3D | null>(null);
  const morphMeshes = useRef<THREE.Mesh[]>([]);

  useLayoutEffect(() => {
    clone.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
        if (obj.morphTargetDictionary && obj.morphTargetInfluences) {
          morphMeshes.current.push(obj);
        }
      }
      const name = obj.name.toLowerCase();
      if (
        !jawRef.current &&
        (name.includes("jaw") || name.includes("mouth") || name.includes("chin"))
      ) {
        jawRef.current = obj;
      }
    });

    const idle =
      actions.idle ||
      actions.Idle ||
      actions["Armature|Idle"] ||
      Object.values(actions)[0];
    idle?.reset().fadeIn(0.4).play();

    return () => {
      idle?.fadeOut(0.2);
      morphMeshes.current = [];
      jawRef.current = null;
    };
  }, [clone, actions]);

  useFrame((state, delta) => {
    if (paused) return;
    mixer?.update(delta);

    const t = state.clock.elapsedTime;
    const breathe = Math.sin(t * 1.1) * 0.012;
    const amp = THREE.MathUtils.clamp(amplitude, 0, 1);
    const scrollProgress = avatarMorphState.progress;

    if (group.current) {
      group.current.position.y = breathe;
      group.current.rotation.y =
        Math.sin(t * 0.35) * 0.04 + (0.5 - scrollProgress) * 0.08;
      const dolly = THREE.MathUtils.lerp(1.05, 0.92, scrollProgress);
      group.current.scale.setScalar(dolly);
    }

    if (jawRef.current) {
      jawRef.current.rotation.x = amp * 0.28;
    }

    for (const mesh of morphMeshes.current) {
      const dict = mesh.morphTargetDictionary;
      const infl = mesh.morphTargetInfluences;
      if (!dict || !infl) continue;
      const keys = ["mouthOpen", "jawOpen", "viseme_aa", "A", "mouth"];
      for (const key of keys) {
        if (key in dict) {
          infl[dict[key]] = THREE.MathUtils.lerp(infl[dict[key]], amp, 0.35);
          break;
        }
      }
    }
  });

  return (
    <group ref={group} dispose={null} position={[0, -1.15, 0]}>
      <primitive object={clone} />
    </group>
  );
}

type FallbackProps = {
  textureUrl: string;
  amplitude: number;
  paused?: boolean;
};

/**
 * Portrait plane used when GLB is missing — still Three.js, with lip region displace.
 */
export function FallbackPortraitModel({
  textureUrl,
  amplitude,
  paused = false,
}: FallbackProps) {
  const mesh = useRef<THREE.Mesh>(null);
  const map = useTexture(textureUrl);

  const uniforms = useMemo(
    () => ({
      uMap: { value: map },
      uTime: { value: 0 },
      uAmp: { value: 0 },
      uProgress: { value: 0 },
    }),
    [map],
  );

  useLayoutEffect(() => {
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = 8;
    map.needsUpdate = true;
  }, [map]);

  const geometry = useMemo(
    () => new THREE.PlaneGeometry(2.55, 3.2, 64, 80),
    [],
  );

  useFrame((state) => {
    if (paused) return;
    const t = state.clock.elapsedTime;
    const scrollProgress = avatarMorphState.progress;
    uniforms.uTime.value = t;
    uniforms.uAmp.value = THREE.MathUtils.lerp(
      uniforms.uAmp.value,
      amplitude,
      0.2,
    );
    uniforms.uProgress.value = scrollProgress;

    if (mesh.current) {
      mesh.current.position.y = Math.sin(t * 1.05) * 0.03;
      mesh.current.rotation.y =
        Math.sin(t * 0.4) * 0.05 + (0.5 - scrollProgress) * 0.1;
      const s = THREE.MathUtils.lerp(1.02, 0.94, scrollProgress);
      mesh.current.scale.setScalar(s);
    }
  });

  return (
    <mesh ref={mesh} geometry={geometry} position={[0, 0.05, 0]}>
      <shaderMaterial
        transparent
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={/* glsl */ `
          uniform float uTime;
          uniform float uAmp;
          varying vec2 vUv;
          void main() {
            vUv = uv;
            vec3 pos = position;
            float face = smoothstep(0.55, 0.0, distance(uv, vec2(0.5, 0.45)));
            pos.z += face * 0.22;
            pos.z += sin(uTime * 1.15) * 0.008 * face;

            float mouth = smoothstep(0.38, 0.48, uv.y) * smoothstep(0.62, 0.52, uv.y)
              * smoothstep(0.32, 0.42, uv.x) * smoothstep(0.68, 0.58, uv.x);
            pos.z += mouth * uAmp * 0.12;
            pos.y -= mouth * uAmp * 0.04;

            float hand = smoothstep(0.52, 0.72, uv.x)
              * smoothstep(0.05, 0.18, uv.y) * smoothstep(0.55, 0.32, uv.y);
            pos.x += sin(uTime * 5.5) * 0.07 * hand;
            pos.z += cos(uTime * 5.5) * 0.03 * hand;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `}
        fragmentShader={/* glsl */ `
          uniform sampler2D uMap;
          varying vec2 vUv;
          void main() {
            vec4 c = texture2D(uMap, vUv);
            if (c.a < 0.08) discard;
            float edge = smoothstep(0.0, 0.03, vUv.x) * smoothstep(1.0, 0.97, vUv.x)
              * smoothstep(0.0, 0.02, vUv.y) * smoothstep(1.0, 0.94, vUv.y);
            gl_FragColor = vec4(c.rgb, c.a * edge);
          }
        `}
      />
    </mesh>
  );
}
