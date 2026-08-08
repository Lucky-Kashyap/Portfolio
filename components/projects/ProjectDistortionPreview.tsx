"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/**
 * Mouse-velocity liquid distortion + subtle RGB split.
 * Classic “mouse image distortion” hover look.
 */
const fragmentShader = /* glsl */ `
  uniform sampler2D uTexture;
  uniform sampler2D uNextTexture;
  uniform vec2 uScale;
  uniform vec2 uOffset;
  uniform vec2 uNextScale;
  uniform vec2 uNextOffset;
  uniform float uMix;
  uniform float uVelo;
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec2 vUv;

  vec2 coverUv(vec2 uv, vec2 scale, vec2 offset) {
    return uv * scale + offset;
  }

  vec2 distort(vec2 uv, float strength) {
    vec2 fromMouse = uv - uMouse;
    float dist = length(fromMouse);
    float wave = sin(dist * 28.0 - uTime * 4.5) * 0.012 * strength;
    float radial = smoothstep(0.55, 0.0, dist) * strength * 0.045;
    vec2 dir = dist > 0.0001 ? normalize(fromMouse) : vec2(0.0);
    uv += dir * (wave + radial);
    uv.x += sin(uv.y * 14.0 + uTime * 2.2) * 0.018 * strength;
    uv.y += cos(uv.x * 12.0 - uTime * 1.6) * 0.012 * strength;
    return clamp(uv, 0.0, 1.0);
  }

  vec4 sampleDistorted(sampler2D tex, vec2 uv, float strength, vec2 scale, vec2 offset) {
    vec2 d = coverUv(distort(uv, strength), scale, offset);
    d = clamp(d, 0.001, 0.999);
    float chroma = strength * 0.014;
    float r = texture2D(tex, d + vec2(chroma, 0.0)).r;
    float g = texture2D(tex, d).g;
    float b = texture2D(tex, d - vec2(chroma, 0.0)).b;
    float a = texture2D(tex, d).a;
    return vec4(r, g, b, a);
  }

  void main() {
    float strength = clamp(uVelo, 0.0, 2.8);
    vec4 current = sampleDistorted(uTexture, vUv, strength, uScale, uOffset);
    vec4 next = sampleDistorted(uNextTexture, vUv, strength, uNextScale, uNextOffset);
    gl_FragColor = mix(current, next, uMix);
  }
`;

function coverParams(texture: THREE.Texture, planeAspect: number) {
  const img = texture.image as { width?: number; height?: number } | undefined;
  if (!img?.width || !img?.height) {
    return { scale: new THREE.Vector2(1, 1), offset: new THREE.Vector2(0, 0) };
  }
  const imageAspect = img.width / img.height;
  if (imageAspect > planeAspect) {
    const scaleX = planeAspect / imageAspect;
    return {
      scale: new THREE.Vector2(scaleX, 1),
      offset: new THREE.Vector2((1 - scaleX) / 2, 0),
    };
  }
  const scaleY = imageAspect / planeAspect;
  return {
    scale: new THREE.Vector2(1, scaleY),
    offset: new THREE.Vector2(0, (1 - scaleY) / 2),
  };
}

type DistortionMeshProps = {
  src: string;
  nextSrc: string;
  mix: number;
  velocityRef: MutableRefObject<number>;
  mouseRef: MutableRefObject<{ x: number; y: number }>;
  onReady?: () => void;
  onError?: () => void;
};

function DistortionMesh({
  src,
  nextSrc,
  mix,
  velocityRef,
  mouseRef,
  onReady,
  onError,
}: DistortionMeshProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const cache = useRef<Map<string, THREE.Texture>>(new Map());
  const { gl } = useThree();
  const planeAspect = 3.2 / 2;
  const placeholder = useMemo(() => {
    const data = new Uint8Array([7, 11, 18, 255]);
    const tex = new THREE.DataTexture(data, 1, 1);
    tex.needsUpdate = true;
    return tex;
  }, []);

  const uniforms = useMemo(
    () => ({
      uTexture: { value: placeholder },
      uNextTexture: { value: placeholder },
      uScale: { value: new THREE.Vector2(1, 1) },
      uOffset: { value: new THREE.Vector2(0, 0) },
      uNextScale: { value: new THREE.Vector2(1, 1) },
      uNextOffset: { value: new THREE.Vector2(0, 0) },
      uMix: { value: 0 },
      uVelo: { value: 0 },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    }),
    [placeholder],
  );

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    let cancelled = false;

    const load = (url: string) => {
      const hit = cache.current.get(url);
      if (hit) return Promise.resolve(hit);
      return new Promise<THREE.Texture>((resolve, reject) => {
        loader.load(
          url,
          (tex) => {
            tex.colorSpace = THREE.SRGBColorSpace;
            tex.minFilter = THREE.LinearFilter;
            tex.magFilter = THREE.LinearFilter;
            tex.generateMipmaps = false;
            tex.wrapS = THREE.ClampToEdgeWrapping;
            tex.wrapT = THREE.ClampToEdgeWrapping;
            cache.current.set(url, tex);
            resolve(tex);
          },
          undefined,
          reject,
        );
      });
    };

    void Promise.all([load(src), load(nextSrc)])
      .then(([a, b]) => {
        if (cancelled || !matRef.current) return;
        const coverA = coverParams(a, planeAspect);
        const coverB = coverParams(b, planeAspect);
        matRef.current.uniforms.uTexture.value = a;
        matRef.current.uniforms.uNextTexture.value = b;
        matRef.current.uniforms.uScale.value.copy(coverA.scale);
        matRef.current.uniforms.uOffset.value.copy(coverA.offset);
        matRef.current.uniforms.uNextScale.value.copy(coverB.scale);
        matRef.current.uniforms.uNextOffset.value.copy(coverB.offset);
        gl.toneMapping = THREE.NoToneMapping;
        onReady?.();
      })
      .catch(() => {
        if (!cancelled) onError?.();
      });

    return () => {
      cancelled = true;
    };
    // Intentionally omit onReady/onError — parent may pass inline fns
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, nextSrc, planeAspect, gl]);

  useFrame((state) => {
    const mat = matRef.current;
    if (!mat) return;
    mat.uniforms.uMix.value = mix;
    mat.uniforms.uTime.value = state.clock.elapsedTime;
    mat.uniforms.uVelo.value = THREE.MathUtils.damp(
      mat.uniforms.uVelo.value,
      velocityRef.current,
      6,
      Math.min(state.clock.getDelta(), 0.05),
    );
    mat.uniforms.uMouse.value.set(
      THREE.MathUtils.clamp(mouseRef.current.x, 0, 1),
      THREE.MathUtils.clamp(1 - mouseRef.current.y, 0, 1),
    );
  });

  useEffect(() => {
    const map = cache.current;
    return () => {
      map.forEach((t) => t.dispose());
      map.clear();
      placeholder.dispose();
    };
  }, [placeholder]);

  return (
    <mesh>
      <planeGeometry args={[3.2, 2]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
      />
    </mesh>
  );
}

export type ProjectDistortionPreviewProps = {
  /** Outgoing texture (mix = 0) */
  src: string;
  /** Incoming texture (mix = 1) */
  nextSrc?: string;
  mix?: number;
  velocityRef: MutableRefObject<number>;
  mouseRef: MutableRefObject<{ x: number; y: number }>;
  className?: string;
  onReady?: () => void;
  onError?: () => void;
};

/** WebGL plane that warps the active project image from mouse velocity. */
export function ProjectDistortionPreview({
  src,
  nextSrc,
  mix = 0,
  velocityRef,
  mouseRef,
  className,
  onReady,
  onError,
}: ProjectDistortionPreviewProps) {
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  return (
    <div className={className} aria-hidden>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 2.45], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        // Parent uses pointer-events-none, but R3F canvas defaults to auto and
        // re-enables hit-testing — that ghost overlay blocked About skill chips.
        style={{ width: "100%", height: "100%", pointerEvents: "none" }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <DistortionMesh
          src={src}
          nextSrc={nextSrc ?? src}
          mix={mix}
          velocityRef={velocityRef}
          mouseRef={mouseRef}
          onReady={onReady}
          onError={() => {
            setFailed(true);
            onError?.();
          }}
        />
      </Canvas>
    </div>
  );
}
