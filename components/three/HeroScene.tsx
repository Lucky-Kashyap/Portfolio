"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

const HeroWebGL = dynamic(
  () => import("@/components/three/HeroWebGL").then((m) => m.HeroWebGL),
  { ssr: false, loading: () => null },
);

type HeroSceneProps = {
  className?: string;
};

/** Client-only Three.js layer for the hero (no SSR WebGL). */
export function HeroScene({ className }: HeroSceneProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-[1] overflow-hidden",
        className,
      )}
      aria-hidden
    >
      <div className="absolute inset-0 opacity-[0.85] md:opacity-100">
        <HeroWebGL className="h-full w-full" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-surface-base via-surface-base/70 to-transparent lg:via-surface-base/45" />
      <div className="absolute inset-0 bg-gradient-to-t from-surface-base via-transparent to-surface-base/40" />
    </div>
  );
}
