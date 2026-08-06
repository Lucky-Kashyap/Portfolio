"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
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
  start?: string;
};

/**
 * Scroll-linked reveal using GSAP ScrollTrigger (transform + opacity only).
 */
export function ScrollReveal({
  children,
  className,
  y = 40,
  x = 0,
  delay = 0,
  duration = 0.9,
  start = "top 85%",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      registerGsap();
      const el = ref.current;
      if (!el || reduced) return;

      gsap.set(el, { opacity: 0, y, x, force3D: true });

      const tween = gsap.to(el, {
        opacity: 1,
        y: 0,
        x: 0,
        duration,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: "play none none none",
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { dependencies: [reduced, y, x, delay, duration, start] },
  );

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={reduced ? undefined : { opacity: 0 }}
    >
      {children}
    </div>
  );
}

export function refreshScrollTriggers() {
  registerGsap();
  ScrollTrigger.refresh();
}
