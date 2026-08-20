"use client";

import {
  createElement,
  useEffect,
  useRef,
  useState,
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

/** Snappy default: finish reveal within ~40vh of travel, not the full paragraph height. */
const DEFAULT_OFFSET = ["start 0.88", "start 0.48"] as ScrollOffset;

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

function wordRange(index: number, total: number): [number, number] {
  // Compress + overlap so the line fills in early instead of dripping word-by-word
  const finishBy = 0.62;
  const window = Math.max(0.08, (1 / total) * finishBy * 2.4);
  const start = (index / Math.max(1, total - 1 || 1)) * (finishBy - window * 0.35);
  const end = Math.min(1, start + window);
  return [Math.max(0, start), end];
}

/**
 * Word-by-word opacity scrubbed to scroll (About / Philosophy).
 * Desktop: short scrub distance. Mobile: one-shot cascade (touch scrub feels laggy).
 */
export function TextGradientScroll({
  text,
  className,
  as = "p",
  id,
  shadowOpacity = 0.18,
  offset = DEFAULT_OFFSET,
}: TextGradientScrollProps) {
  const container = useRef<HTMLElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const words = text.trim().split(/\s+/).filter(Boolean);
  const [useCascade, setUseCascade] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
  });
  const [cascadeOn, setCascadeOn] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px), (pointer: coarse)");
    const sync = () => setUseCascade(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!useCascade || reduced) return;
    const el = container.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setCascadeOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [useCascade, reduced, text]);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: offset ?? DEFAULT_OFFSET,
  });

  if (reduced) {
    return createElement(as, { id, className }, text);
  }

  if (useCascade) {
    return createElement(
      as,
      {
        id,
        ref: container,
        className: cn("flex flex-wrap", className),
        "aria-label": text,
      },
      words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="relative mr-[0.28em] inline-block last:mr-0"
          style={{
            opacity: cascadeOn ? 1 : shadowOpacity,
            transition: cascadeOn
              ? `opacity 0.28s cubic-bezier(0.22, 1, 0.36, 1) ${Math.min(i * 0.018, 0.28)}s`
              : undefined,
          }}
        >
          {word}
        </span>
      )),
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
    words.map((word, i) => (
      <Word
        key={`${word}-${i}`}
        progress={scrollYProgress}
        range={wordRange(i, words.length)}
        shadowOpacity={shadowOpacity}
      >
        {word}
      </Word>
    )),
  );
}
