"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { site } from "@/lib/content";
import { cn } from "@/lib/utils";

const STATUS_LINES = [
  "INITIALIZING SYSTEM...",
  "BOOTSTRAPPING REACT RUNTIME...",
  "HYDRATING NEXT.JS ROUTES...",
  "OPTIMIZING WEBGL SCENE...",
  "COMPILING SHADER PASSES...",
  "SYNCING GSAP SCROLL TRIGGERS...",
  "LOADING PROJECT ASSETS...",
  "CALIBRATING UI MOTION...",
  "PORTFOLIO READY",
] as const;

/** Smooth climb — digits stay in motion; short settle then exit */
const LOAD_MS = 4800;
const HOLD_AT_100_MS = 280;
const EXIT_MS = 900;

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;

type PageLoaderProps = {
  onComplete?: () => void;
};

function brandInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "DK";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

/** Soft ease — never snaps early to 100 */
function easeOutQuart(t: number) {
  return 1 - Math.pow(1 - t, 4);
}

/**
 * Govind-style rolling digit column — strip of 0–9 slides to the active digit.
 */
function RollingDigit({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const digit = ((value % 10) + 10) % 10;

  return (
    <span
      className={cn(
        "relative inline-block h-[0.95em] w-[0.62em] overflow-hidden",
        className,
      )}
      aria-hidden
    >
      <motion.span
        className="absolute inset-x-0 top-0 flex flex-col items-center"
        animate={{ y: `${-digit * 0.95}em` }}
        transition={{
          type: "spring",
          stiffness: 120,
          damping: 22,
          mass: 0.85,
        }}
      >
        {DIGITS.map((d) => (
          <span
            key={d}
            className="flex h-[0.95em] items-center justify-center leading-none"
          >
            {d}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

function RollingPercent({ value }: { value: number }) {
  const clamped = Math.min(100, Math.max(0, Math.round(value)));
  const hundreds = Math.floor(clamped / 100);
  const tens = Math.floor((clamped % 100) / 10);
  const ones = clamped % 10;

  return (
    <div
      className="flex items-start leading-none text-text-primary"
      style={{
        fontSize: "clamp(4.25rem, 22vw, 11.5rem)",
        fontVariantNumeric: "tabular-nums",
        textShadow: "0 0 48px rgba(125,211,252,0.2)",
      }}
      aria-hidden
    >
      <span className="flex font-bold tracking-tighter">
        {/* Keep 3 columns always so layout doesn't jump; fade leading zero feel via opacity */}
        <span className={cn(hundreds === 0 && clamped < 100 && "opacity-25")}>
          <RollingDigit value={hundreds} />
        </span>
        <RollingDigit value={tens} />
        <RollingDigit value={ones} />
      </span>
      <span
        className="mt-[0.12em] ml-1 font-bold tracking-tight text-accent-cyan"
        style={{ fontSize: "0.32em" }}
      >
        %
      </span>
    </div>
  );
}

export function PageLoader({ onComplete }: PageLoaderProps) {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<"loading" | "exiting" | "done">(
    reduceMotion ? "done" : "loading",
  );
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);
  const year = useMemo(() => new Date().getFullYear(), []);
  const initials = useMemo(() => brandInitials(site.brand), []);
  const completedRef = useRef(false);

  useEffect(() => {
    if (reduceMotion) {
      setPhase("done");
      onComplete?.();
      window.dispatchEvent(new Event("portfolio:ready"));
      return;
    }

    window.dispatchEvent(new Event("portfolio:loader-start"));

    const started = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - started) / LOAD_MS);
      const eased = easeOutQuart(t);
      // Keep progress moving — never freeze mid-way; approach 100 smoothly
      setProgress(eased * 100);

      setStatusIndex(
        Math.min(
          STATUS_LINES.length - 1,
          Math.floor(t * STATUS_LINES.length),
        ),
      );

      if (t < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setProgress(100);
        setStatusIndex(STATUS_LINES.length - 1);
        if (!completedRef.current) {
          completedRef.current = true;
          window.setTimeout(() => setPhase("exiting"), HOLD_AT_100_MS);
        }
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduceMotion, onComplete]);

  useEffect(() => {
    if (phase !== "exiting") return;

    const doneTimer = window.setTimeout(() => {
      setPhase("done");
      onComplete?.();
      window.dispatchEvent(new Event("portfolio:ready"));
    }, EXIT_MS);

    return () => window.clearTimeout(doneTimer);
  }, [phase, onComplete]);

  useEffect(() => {
    if (phase === "done") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [phase]);

  if (phase === "done") return null;

  const pctLabel = String(Math.min(100, Math.round(progress))).padStart(3, "0");
  const barWidth = `${Math.min(100, progress)}%`;

  return (
    <motion.div
      className={cn(
        "fixed inset-0 z-[100] overflow-hidden bg-surface-base text-text-primary",
        phase === "exiting" && "pointer-events-none",
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={`Loading portfolio ${pctLabel} percent`}
      initial={{ opacity: 1 }}
      animate={
        phase === "exiting"
          ? { opacity: 0, y: -28, filter: "blur(12px)" }
          : { opacity: 1, y: 0, filter: "blur(0px)" }
      }
      transition={{ duration: EXIT_MS / 1000, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 55% 48% at 50% 42%, color-mix(in srgb, #7dd3fc 16%, transparent), transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      <div className="absolute inset-x-0 top-0 z-20 flex items-start justify-between px-5 pt-5 md:px-8 md:pt-7">
        <motion.p
          className="text-sm font-bold tracking-[0.2em] text-text-primary uppercase md:text-base"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {initials}
        </motion.p>
        <motion.p
          className="text-[10px] font-medium tracking-[0.22em] text-text-secondary uppercase md:text-xs"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          Portfolio edition @{year}
        </motion.p>
      </div>

      <p
        className="pointer-events-none absolute left-1/2 top-[40%] z-0 w-[140%] -translate-x-1/2 -translate-y-1/2 select-none text-center text-[clamp(3rem,16vw,11rem)] font-bold tracking-tighter text-text-primary/[0.05] uppercase"
        aria-hidden
      >
        {site.heroHeadline}
      </p>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <RollingPercent value={progress} />
        </motion.div>

        <div className="mt-8 flex min-h-[1.75rem] max-w-xl items-center justify-center gap-2.5 sm:mt-10">
          <AnimatePresence mode="wait">
            <motion.p
              key={STATUS_LINES[statusIndex]}
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="text-center text-[11px] font-semibold tracking-[0.26em] text-text-primary uppercase md:text-xs"
            >
              {STATUS_LINES[statusIndex]}
            </motion.p>
          </AnimatePresence>
          <motion.span
            className="inline-block size-2 shrink-0 bg-accent-cyan"
            aria-hidden
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 0.75, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 px-5 pb-8 md:px-10 md:pb-10">
        <div className="relative h-px w-full bg-white/10">
          <motion.div
            className="absolute inset-y-0 left-0 bg-accent-cyan"
            style={{ width: barWidth }}
            aria-hidden
          />
          <motion.div
            className="absolute top-1/2 size-2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_18px_5px_rgba(125,211,252,0.9)]"
            style={{ left: barWidth, marginLeft: "-4px" }}
            aria-hidden
          />
        </div>
        <div className="mt-4 flex items-center justify-between text-[10px] font-medium tracking-[0.2em] text-text-secondary uppercase md:text-xs">
          <span>Loading assets</span>
          <span className="tabular-nums text-text-primary">{pctLabel}%</span>
        </div>
      </div>
    </motion.div>
  );
}
