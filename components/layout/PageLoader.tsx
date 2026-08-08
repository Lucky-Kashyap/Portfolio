"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { site } from "@/lib/content";
import { cn } from "@/lib/utils";

/** About-me status beats — longer loader so each line can land clearly */
const STATUS_LINES = [
  "READYING SYSTEMS…",
  `MEET ${site.brand.toUpperCase()}`,
  "FRONTEND ENGINEER · JAIPUR",
  "REACT · NEXT.JS · TYPESCRIPT",
  "SCALABLE UI · API · PERFORMANCE",
  "SHIPPING CREATIVE EXPERIENCES",
  "LOADING PROJECT ASSETS…",
  "CALIBRATING MOTION & WEBGL…",
  "FINALIZING INTERFACE…",
  "CREATIVE EXPERIENCES — READY",
] as const;

/** Bottom bar phase labels (appealing progress copy) */
const PHASE_LABELS = [
  { until: 0.18, label: "Readying" },
  { until: 0.38, label: "Loading assets" },
  { until: 0.58, label: "Creative Experiences" },
  { until: 0.78, label: "Syncing portfolio" },
  { until: 0.92, label: "Finalizing" },
  { until: 1.01, label: "Almost there" },
] as const;

/** Longer climb — more time to read about-me lines */
const LOAD_MS = 7800;
const HOLD_AT_100_MS = 520;
const EXIT_MS = 950;

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

type PhaseLabel = (typeof PHASE_LABELS)[number]["label"];

function phaseLabelFor(t: number): PhaseLabel {
  for (const phase of PHASE_LABELS) {
    if (t < phase.until) return phase.label;
  }
  return PHASE_LABELS[PHASE_LABELS.length - 1].label;
}

/** Soft ease — never snaps early to 100 */
function easeOutQuart(t: number) {
  return 1 - Math.pow(1 - t, 4);
}

/**
 * Govind-style rolling digit column — strip of 0–9 slides to the active digit.
 * Tween (not spring) so digits never overshoot past the target (e.g. 100 → 155).
 */
function RollingDigit({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const digit = ((Math.trunc(value) % 10) + 10) % 10;

  return (
    <span
      className={cn(
        "relative inline-block h-[1em] w-[0.62em] overflow-hidden",
        className,
      )}
      aria-hidden
    >
      <motion.span
        className="absolute inset-x-0 top-0 flex flex-col items-center will-change-transform"
        animate={{ y: `${-digit}em` }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        {DIGITS.map((d) => (
          <span
            key={d}
            className="flex h-[1em] w-full items-center justify-center leading-none"
          >
            {d}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

function clampPercent(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

function RollingPercent({ value }: { value: number }) {
  const clamped = Math.round(clampPercent(value));
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
  const [phaseLabel, setPhaseLabel] = useState<PhaseLabel>(PHASE_LABELS[0].label);
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
      const next = clampPercent(eased * 100);
      setProgress(next);
      setPhaseLabel(phaseLabelFor(t));

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
        setPhaseLabel("Creative Experiences");
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

  const displayProgress = clampPercent(progress);
  const pctLabel = String(Math.round(displayProgress)).padStart(3, "0");
  const barWidth = `${displayProgress}%`;

  return (
    <motion.div
      className={cn(
        "fixed inset-0 z-[100] overflow-hidden bg-surface-base text-text-primary",
        phase === "exiting" && "pointer-events-none",
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={`Loading portfolio ${pctLabel} percent. ${STATUS_LINES[statusIndex]}`}
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
          className="text-xs font-medium tracking-[0.18em] text-white/70 uppercase md:text-sm"
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
        Creative Experiences
      </p>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <RollingPercent value={displayProgress} />
        </motion.div>

        <div className="mt-8 flex min-h-[2rem] max-w-2xl flex-col items-center justify-center gap-3 sm:mt-10">
          <div className="flex items-center justify-center gap-2.5">
            <AnimatePresence mode="wait">
              <motion.p
                key={STATUS_LINES[statusIndex]}
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="text-center text-sm font-semibold tracking-[0.18em] text-white uppercase sm:text-base md:text-lg md:tracking-[0.2em]"
              >
                {STATUS_LINES[statusIndex]}
              </motion.p>
            </AnimatePresence>
            <motion.span
              className="inline-block size-2 shrink-0 bg-accent-cyan shadow-[0_0_10px_rgba(125,211,252,0.8)]"
              aria-hidden
              animate={{ opacity: [1, 0.25, 1] }}
              transition={{
                duration: 0.75,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
          <p className="max-w-md text-center text-xs leading-relaxed text-white/65 sm:text-sm">
            Building scalable, responsive experiences with React, Next.js, and
            TypeScript — based in Jaipur.
          </p>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 px-5 pb-9 md:px-10 md:pb-11">
        <div className="relative h-[2px] w-full rounded-full bg-white/15">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-accent-cyan"
            style={{ width: barWidth }}
            aria-hidden
          />
          <motion.div
            className="absolute top-1/2 size-2.5 -translate-y-1/2 rounded-full bg-white shadow-[0_0_18px_5px_rgba(125,211,252,0.9)]"
            style={{ left: barWidth, marginLeft: "-5px" }}
            aria-hidden
          />
        </div>
        <div className="mt-4 flex items-center justify-between gap-4">
          <AnimatePresence mode="wait">
            <motion.span
              key={phaseLabel}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.28 }}
              className="text-xs font-semibold tracking-[0.16em] text-white uppercase sm:text-sm md:tracking-[0.2em]"
            >
              {phaseLabel}
            </motion.span>
          </AnimatePresence>
          <span className="text-xs font-semibold tracking-[0.16em] text-accent-cyan tabular-nums uppercase sm:text-sm">
            {pctLabel}%
          </span>
        </div>
      </div>
    </motion.div>
  );
}
