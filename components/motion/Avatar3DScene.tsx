"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Float, useTexture } from "@react-three/drei";
import * as THREE from "three";

type Avatar3DSceneProps = {
  faceUrl: string;
  speaking?: boolean;
};

/**
 * Modern Three.js AI portrait:
 * transparent scene, cinematic lighting, breathing + integrated hand wave,
 * mouse parallax — no separate hand mesh.
 */
export function Avatar3DScene({ faceUrl, speaking = false }: Avatar3DSceneProps) {
  return (
    <>
      <fog attach="fog" args={["#000000", 8, 16]} />
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[2.8, 3.2, 3.5]}
        intensity={1.45}
        color="#ffffff"
        castShadow
      />
      <directionalLight position={[-3, 1.2, -0.5]} intensity={0.55} color="#a8c5d8" />
      <spotLight
        position={[0.2, 3.2, 2.4]}
        angle={0.42}
        penumbra={0.7}
        intensity={speaking ? 1.35 : 0.75}
        color="#dce9f2"
      />

      <CameraRig />
      <GlowDisc speaking={speaking} />
      <AmbientDust />

      <Float
        speed={speaking ? 1.4 : 1.05}
        rotationIntensity={0.04}
        floatIntensity={speaking ? 0.28 : 0.16}
      >
        <PortraitMesh faceUrl={faceUrl} speaking={speaking} />
      </Float>

      <ContactShadows
        position={[0, -1.85, 0]}
        opacity={0.55}
        scale={5.5}
        blur={3.2}
        far={4.5}
        color="#000000"
      />
    </>
  );
}

function GlowDisc({ speaking }: { speaking: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.opacity = THREE.MathUtils.lerp(
      mat.opacity,
      speaking ? 0.22 : 0.12,
      0.05,
    );
    ref.current.scale.setScalar(
      1 + Math.sin(state.clock.elapsedTime * 1.1) * 0.03,
    );
  });

  return (
    <mesh ref={ref} position={[0, -0.15, -0.55]} rotation={[0, 0, 0]}>
      <circleGeometry args={[1.55, 64]} />
      <meshBasicMaterial
        color="#7dd3fc"
        transparent
        opacity={0.12}
        depthWrite={false}
      />
    </mesh>
  );
}

function AmbientDust() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const n = 36;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 4.8;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 3.8;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 2 - 0.8;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.018;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.016}
        color="#93c5fd"
        transparent
        opacity={0.28}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

function CameraRig() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    mouse.current.x = THREE.MathUtils.lerp(
      mouse.current.x,
      state.pointer.x,
      0.05,
    );
    mouse.current.y = THREE.MathUtils.lerp(
      mouse.current.y,
      state.pointer.y,
      0.05,
    );
    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x,
      mouse.current.x * 0.42,
      0.045,
    );
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      0.12 + mouse.current.y * 0.2,
      0.045,
    );
    camera.lookAt(0, 0.12, 0);
  });

  return null;
}

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uSpeak;
  uniform float uHandX0;
  uniform float uHandX1;
  uniform float uHandY0;
  uniform float uHandY1;

  varying vec2 vUv;
  varying float vDepth;

  void main() {
    vUv = uv;
    vec3 pos = position;

    float distToCenter = distance(uv, vec2(0.5, 0.48));
    float faceVolume = smoothstep(0.62, 0.0, distToCenter);
    vDepth = faceVolume;

    float breathing = sin(uTime * 1.15) * (0.01 + uSpeak * 0.008);
    pos.z += faceVolume * 0.38;
    pos.z += breathing * faceVolume;

    pos.x += uMouse.x * faceVolume * 0.16;
    pos.y += uMouse.y * faceVolume * 0.1;

    float softWave = sin(uv.x * 5.5 + uTime * 0.55) * 0.005;
    pos.z += softWave * faceVolume;

    float yMask = smoothstep(uHandY0, uHandY0 + 0.1, uv.y) *
      smoothstep(uHandY1 + 0.06, uHandY1, uv.y);
    float handMask = smoothstep(uHandX0, uHandX1, uv.x) * yMask;

    float waveIntensity = max(0.0, (uv.y - uHandY0) * 1.7 + (uv.x - uHandX0));
    float waveSpeed = 5.8 + uSpeak * 2.0;
    float amp = 0.14 + uSpeak * 0.06;

    pos.x += sin(uTime * waveSpeed) * amp * handMask * waveIntensity;
    pos.y += cos(uTime * waveSpeed * 2.0) * 0.032 * handMask * waveIntensity;
    pos.z += sin(uTime * waveSpeed + 0.5) * 0.045 * handMask * waveIntensity;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform float uSpeak;
  uniform vec2 uMouse;

  varying vec2 vUv;
  varying float vDepth;

  void main() {
    vec2 uv = vUv;
    uv += uMouse * vDepth * 0.014;

    vec4 tex = texture2D(uTexture, uv);
    if (tex.a < 0.06) discard;

    float rim = pow(1.0 - vDepth, 2.0);
    vec3 color = tex.rgb;
    color += vec3(0.4, 0.78, 0.98) * rim * 0.14;
    color *= 1.02 + vDepth * 0.06;

    float pulse = 0.5 + 0.5 * sin(uTime * 5.2);
    color += vec3(0.25, 0.6, 0.85) * pulse * uSpeak * 0.05 * vDepth;

    // Soft edge fade into transparent page bg
    float edge = smoothstep(0.0, 0.04, uv.x) * smoothstep(1.0, 0.96, uv.x)
      * smoothstep(0.0, 0.03, uv.y) * smoothstep(1.0, 0.92, uv.y);

    gl_FragColor = vec4(color, tex.a * edge);
  }
`;

function PortraitMesh({
  faceUrl,
  speaking,
}: {
  faceUrl: string;
  speaking: boolean;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const map = useTexture(faceUrl);

  const uniforms = useMemo(
    () => ({
      uTexture: { value: map },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uSpeak: { value: 0 },
      uHandX0: { value: 0.56 },
      uHandX1: { value: 0.74 },
      uHandY0: { value: 0.06 },
      uHandY1: { value: 0.5 },
    }),
    [map],
  );

  useLayoutEffect(() => {
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = 8;
    map.wrapS = THREE.ClampToEdgeWrapping;
    map.wrapT = THREE.ClampToEdgeWrapping;
    map.needsUpdate = true;
  }, [map]);

  const geometry = useMemo(
    () => new THREE.PlaneGeometry(2.85, 3.55, 112, 140),
    [],
  );

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uMouse.value.x = THREE.MathUtils.lerp(
      uniforms.uMouse.value.x,
      state.pointer.x,
      0.07,
    );
    uniforms.uMouse.value.y = THREE.MathUtils.lerp(
      uniforms.uMouse.value.y,
      state.pointer.y,
      0.07,
    );
    uniforms.uSpeak.value = THREE.MathUtils.lerp(
      uniforms.uSpeak.value,
      speaking ? 1 : 0,
      0.08,
    );

    if (mesh.current) {
      const t = state.clock.elapsedTime;
      mesh.current.rotation.y = THREE.MathUtils.lerp(
        mesh.current.rotation.y,
        state.pointer.x * 0.16 + Math.sin(t * 0.35) * 0.025,
        0.055,
      );
      mesh.current.rotation.x = THREE.MathUtils.lerp(
        mesh.current.rotation.x,
        -state.pointer.y * 0.08 + Math.sin(t * 0.5) * 0.015,
        0.055,
      );
    }
  });

  return (
    <mesh ref={mesh} geometry={geometry} position={[0, 0.15, 0]}>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}
