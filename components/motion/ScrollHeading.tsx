"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/useMotionPrefs";
import { cn } from "@/lib/utils";

type ScrollHeadingProps = {
  id?: string;
  as?: 1 | 2 | 3;
  children: ReactNode;
  className?: string;
};

/**
 * Clip-path + rise reveal for section titles (GSAP ScrollTrigger).
 */
export function ScrollHeading({
  id,
  as = 2,
  children,
  className,
}: ScrollHeadingProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const Tag = `h${as}` as const;

  useGSAP(
    () => {
      registerGsap();
      const wrap = wrapRef.current;
      if (!wrap || reduced) return;
      const heading = wrap.querySelector("[data-scroll-heading]");
      if (!heading) return;

      gsap.set(heading, {
        y: 48,
        opacity: 0,
        clipPath: "inset(0 0 100% 0)",
      });

      const tween = gsap.to(heading, {
        y: 0,
        opacity: 1,
        clipPath: "inset(0 0 0% 0)",
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: wrap,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { dependencies: [reduced] },
  );

  return (
    <div ref={wrapRef} className="overflow-hidden">
      <Tag
        id={id}
        data-scroll-heading
        className={cn(
          "text-display-sm font-bold leading-tight tracking-tight text-text-primary",
          className,
        )}
        style={reduced ? undefined : { opacity: 0 }}
      >
        {children}
      </Tag>
    </div>
  );
}

/** Optional word-by-word stagger for longer headlines */
export function ScrollWords({
  text,
  className,
  as = 2,
  id,
}: {
  text: string;
  className?: string;
  as?: 1 | 2 | 3;
  id?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const reduced = usePrefersReducedMotion();
  const Tag = `h${as}` as const;
  const words = text.split(" ");

  useEffect(() => {
    registerGsap();
    const el = ref.current;
    if (!el || reduced) return;

    const spans = el.querySelectorAll("[data-word]");
    gsap.set(spans, { yPercent: 110, opacity: 0 });

    const tween = gsap.to(spans, {
      yPercent: 0,
      opacity: 1,
      duration: 0.7,
      stagger: 0.06,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [reduced, text]);

  return (
    <Tag
      id={id}
      ref={ref}
      className={cn(
        "text-display-sm font-bold leading-tight tracking-tight text-text-primary",
        className,
      )}
    >
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-1">
          <span data-word className="inline-block will-change-transform">
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </span>
        </span>
      ))}
    </Tag>
  );
}
