"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/useMotionPrefs";
import { cn } from "@/lib/utils";

/** Word-by-word stagger for section headlines */
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
    const tween = gsap.from(spans, {
      yPercent: 110,
      opacity: 0,
      duration: 0.42,
      stagger: 0.028,
      ease: "power3.out",
      immediateRender: false,
      clearProps: "opacity,transform",
      scrollTrigger: {
        trigger: el,
        start: "top 90%",
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
