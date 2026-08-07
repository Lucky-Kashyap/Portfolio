"use client";

import {
  createElement,
  useRef,
  type ReactNode,
} from "react";
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
  shadowOpacity?: number;
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
    <span className="relative mr-[0.28em] inline-block last:mr-0">
      <span
        className="pointer-events-none absolute inset-0 select-none text-inherit"
        style={{ opacity: shadowOpacity }}
        aria-hidden
      >
        {children}
      </span>
      <motion.span className="relative text-inherit" style={{ opacity }}>
        {children}
      </motion.span>
    </span>
  );
}

/**
 * Word-by-word opacity scrubbed to scroll (About / Philosophy).
 */
export function TextGradientScroll({
  text,
  className,
  as = "p",
  id,
  shadowOpacity = 0.18,
  offset = ["start 0.95", "end 0.55"] as ScrollOffset,
}: TextGradientScrollProps) {
  const container = useRef<HTMLElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const words = text.trim().split(/\s+/).filter(Boolean);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: offset ?? ["start 0.95", "end 0.55"],
  });

  if (reduced) {
    return createElement(
      as,
      { id, className },
      text,
    );
  }

  return createElement(
    as,
    {
      id,
      ref: container,
      className: cn("flex flex-wrap", className),
      "aria-label": text,
    },
    words.map((word, i) => {
      const start = i / words.length;
      const end = Math.min(1, start + 1 / words.length);
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
    }),
  );
}
