"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/useMotionPrefs";
import { cn } from "@/lib/utils";

type ScrollOffset = Parameters<typeof useScroll>[0] extends infer O
  ? O extends { offset?: infer Off }
    ? Off
    : never
  : never;

type TextGradientScrollProps = {
  text: string;
  className?: string;
  as?: "p" | "h2" | "h3" | "blockquote";
  id?: string;
  /** Dim layer under each word (reads as the “unlit” gradient). */
  shadowOpacity?: number;
  /** Scroll offsets for Framer useScroll. */
  offset?: ScrollOffset;
};

function Word({
  children,
  progress,
  range,
  shadowOpacity,
}: {
  children: ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
  shadowOpacity: number;
}) {
  const opacity = useTransform(progress, range, [0, 1]);

  return (
    <span className="relative mr-[0.32em] inline-block last:mr-0">
      <span
        className="absolute inset-0 select-none"
        style={{ opacity: shadowOpacity }}
        aria-hidden
      >
        {children}
      </span>
      <motion.span className="relative" style={{ opacity }} aria-hidden>
        {children}
      </motion.span>
    </span>
  );
}

/**
 * Text Gradient Scroll Opacity v2 — word-by-word opacity scrubbed to scroll
 * (Olivier Larose / awwwards pattern). Use on long narrative copy only.
 */
export function TextGradientScroll({
  text,
  className,
  as = "p",
  id,
  shadowOpacity = 0.16,
  offset = ["start 0.9", "start 0.28"] as ScrollOffset,
}: TextGradientScrollProps) {
  const container = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const words = text.trim().split(/\s+/).filter(Boolean);
  const Tag = as as ElementType;

  const { scrollYProgress } = useScroll({
    target: container,
    offset,
  });

  if (reduced) {
    return (
      <Tag id={id} className={className}>
        {text}
      </Tag>
    );
  }

  return (
    <Tag
      id={id}
      ref={container}
      className={cn("flex flex-wrap", className)}
      aria-label={text}
    >
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return (
          <Word
            key={`${word}-${i}`}
            progress={scrollYProgress}
            range={[start, end]}
            shadowOpacity={shadowOpacity}
          >
            {word}
          </Word>
        );
      })}
    </Tag>
  );
}
