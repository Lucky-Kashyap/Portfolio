"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/useMotionPrefs";
import { cn } from "@/lib/utils";

type ScrollProgressGlowProps = {
  className?: string;
};

/**
 * Thin top progress bar + soft vignette that tracks scroll for cinematic feel.
 */
export function ScrollProgressGlow({ className }: ScrollProgressGlowProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const bar = barRef.current;
    if (!bar) return;

    let raf = 0;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      bar.style.transform = `scaleX(${Math.min(1, Math.max(0, p))})`;
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  if (reduced) return null;

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] origin-left",
        className,
      )}
      aria-hidden
    >
      <div
        ref={barRef}
        className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-accent-cyan via-sky-300 to-accent-amber shadow-[0_0_18px_rgba(125,211,252,0.55)]"
      />
    </div>
  );
}
