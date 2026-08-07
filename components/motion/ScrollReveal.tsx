"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { registerGsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/useMotionPrefs";
import { cn } from "@/lib/utils";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  /** y offset in px */
  y?: number;
  /** x offset in px */
  x?: number;
  delay?: number;
  duration?: number;
  /** Kept for API compatibility */
  start?: string;
};

function isInView(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight || 1;
  // Reveal once the top crosses ~90% of the viewport (includes already scrolled-past)
  return rect.top < vh * 0.9;
}

/**
 * Lightweight scroll reveal. Avoids GSAP ScrollTrigger enter (unreliable with
 * Lenis). Content never stays fully invisible while on-screen.
 */
export function ScrollReveal({
  children,
  className,
  y = 40,
  x = 0,
  delay = 0,
  duration = 0.9,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    let played = false;
    let raf = 0;

    const play = () => {
      if (played) return;
      played = true;
      cancelAnimationFrame(raf);
      el.style.transition = `opacity ${duration}s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s, transform ${duration}s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`;
      el.style.opacity = "1";
      el.style.transform = "translate3d(0,0,0) scale(1)";
    };

    // Soft start — never leave a fully blank void if checks lag
    el.style.opacity = "0.15";
    el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(0.985)`;
    el.style.willChange = "opacity, transform";

    const loop = () => {
      if (played) return;
      if (isInView(el)) {
        play();
        return;
      }
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    const safety = window.setTimeout(() => {
      if (!played && isInView(el)) play();
    }, 400);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(safety);
    };
  }, [reduced, y, x, delay, duration]);

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}

export function refreshScrollTriggers() {
  registerGsap();
  ScrollTrigger.refresh();
}
