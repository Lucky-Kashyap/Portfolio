"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { site } from "@/lib/content";
import {
  getLoaderTimings,
  markPortfolioReady,
  PORTFOLIO_LOADER_START_EVENT,
} from "@/lib/boot";
import { cn } from "@/lib/utils";

/** Status beats — paced so each line can land clearly */
const STATUS_LINES = [
  "READYING SYSTEMS…",
  `MEET ${site.brand.toUpperCase()}`,
  "FRONTEND ENGINEER · JAIPUR",
  "REACT · NEXT.JS · TYPESCRIPT",
  "SCALABLE UI · API · PERFORMANCE",
  "SHIPPING CREATIVE EXPERIENCES",
  "FINALIZING INTERFACE…",
  "CREATIVE EXPERIENCES — READY",
] as const;

const PHASE_LABELS = [
  { until: 0.16, label: "Readying" },
  { until: 0.36, label: "Loading assets" },
  { until: 0.56, label: "Creative Experiences" },
  { until: 0.76, label: "Syncing portfolio" },
  { until: 0.9, label: "Finalizing" },
  { until: 1.01, label: "Almost there" },
] as const;

const TICK_MS = 42;

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

/** Smooth S-curve — calm start, readable middle, soft landing at 100 */
function easeInOutCubic(t: number) {
  const x = Math.min(1, Math.max(0, t));
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function clampPercent(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

/**
 * Rolling digit — snaps on big jumps so mid-tweens never invent values like 155%.
 */
function RollingDigit({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const digit = ((Math.trunc(value) % 10) + 10) % 10;
  const prevRef = useRef(digit);
  const jump = Math.abs(digit - prevRef.current);
  useEffect(() => {
    prevRef.current = digit;
  }, [digit]);

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
        transition={{
          duration: jump > 2 ? 0 : 0.32,
          ease: [0.22, 1, 0.36, 1],
        }}
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

function RollingPercent({ value, lite }: { value: number; lite?: boolean }) {
  const clamped = Math.round(clampPercent(value));
  const hundreds = Math.floor(clamped / 100);
  const tens = Math.floor((clamped % 100) / 10);
  const ones = clamped % 10;

  return (
    <div
      className="flex items-start leading-none text-text-primary"
      style={{
        fontSize: "clamp(3.5rem, 18vw, 11.5rem)",
        fontVariantNumeric: "tabular-nums",
        textShadow: lite ? "none" : "0 0 48px rgba(125,211,252,0.2)",
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
  /** Visible integer 0–100 only — never mid-digit garbage */
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);
  const [phaseLabel, setPhaseLabel] = useState<PhaseLabel>(
    PHASE_LABELS[0].label,
  );
  const [lite, setLite] = useState(false);
  const [exitMs, setExitMs] = useState(560);
  const year = useMemo(() => new Date().getFullYear(), []);
  const initials = useMemo(() => brandInitials(site.brand), []);
  const completedRef = useRef(false);
  const displayRef = useRef(0);
  const targetRef = useRef(0);
  const lastTickRef = useRef(0);

  useEffect(() => {
    if (reduceMotion) {
      setPhase("done");
      onComplete?.();
      markPortfolioReady();
      return;
    }

    const timings = getLoaderTimings();
    setLite(timings.lite);
    setExitMs(timings.exitMs);
    window.dispatchEvent(new Event(PORTFOLIO_LOADER_START_EVENT));

    const started = performance.now();
    let frame = 0;
    const catchUp = 1;

    const tick = (now: number) => {
      const t = Math.min(1, (now - started) / timings.loadMs);
      const eased = easeInOutCubic(t);
      targetRef.current = clampPercent(eased * 100);
      setPhaseLabel(phaseLabelFor(t));
      setStatusIndex(
        Math.min(
          STATUS_LINES.length - 1,
          Math.floor(t * STATUS_LINES.length),
        ),
      );

      if (now - lastTickRef.current >= TICK_MS) {
        lastTickRef.current = now;
        const goal = t >= 1 ? 100 : Math.min(100, Math.floor(targetRef.current));
        if (displayRef.current < goal) {
          displayRef.current = Math.min(100, displayRef.current + catchUp);
          setProgress(displayRef.current);
        }
      }

      if (t < 1 || displayRef.current < 100) {
        frame = requestAnimationFrame(tick);
      } else {
        setProgress(100);
        setPhaseLabel("Creative Experiences");
        setStatusIndex(STATUS_LINES.length - 1);
        if (!completedRef.current) {
          completedRef.current = true;
          window.setTimeout(() => setPhase("exiting"), timings.holdMs);
        }
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduceMotion, onComplete]);

  useEffect(() => {
    if (phase !== "exiting") return;

    markPortfolioReady();
    const doneTimer = window.setTimeout(() => {
      setPhase("done");
      onComplete?.();
    }, exitMs);

    return () => window.clearTimeout(doneTimer);
  }, [phase, onComplete, exitMs]);

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
  const exiting = phase === "exiting";

  return (
    <motion.div
      className={cn(
        "fixed inset-0 z-[100] overflow-hidden bg-surface-base text-text-primary",
        exiting && "pointer-events-none",
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={`Loading portfolio ${pctLabel} percent. ${STATUS_LINES[statusIndex]}`}
      initial={false}
      animate={
        exiting
          ? { opacity: 0, y: lite ? -12 : -28 }
          : { opacity: 1, y: 0 }
      }
      transition={{
        duration: exitMs / 1000,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {/* Soft atmosphere */}
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

      <motion.div
        className={cn(
          "pointer-events-none absolute inset-0 z-[1]",
          lite ? "opacity-25" : "opacity-40",
        )}
        aria-hidden
        style={{
          background:
            "linear-gradient(105deg, transparent 35%, rgba(125,211,252,0.14) 48%, rgba(255,255,255,0.1) 50%, rgba(125,211,252,0.14) 52%, transparent 65%)",
          backgroundSize: "220% 100%",
        }}
        animate={{ backgroundPosition: ["120% 0%", "-40% 0%"] }}
        transition={{
          duration: lite ? 2.8 : 2.4,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Carpet edge highlight during exit */}
      <AnimatePresence>
        {exiting && !lite ? (
          <motion.div
            key="carpet-edge"
            className="pointer-events-none absolute inset-x-0 z-[30] h-px bg-gradient-to-r from-transparent via-accent-cyan to-transparent"
            initial={{ top: "0%", opacity: 0.9 }}
            animate={{ top: "100%", opacity: 0.35 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: exitMs / 1000,
              ease: [0.22, 1, 0.36, 1],
            }}
            aria-hidden
          />
        ) : null}
      </AnimatePresence>

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
          className="text-xs font-medium tracking-[0.18em] text-text-secondary uppercase md:text-sm"
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
          animate={{
            opacity: exiting ? 0 : 1,
            y: exiting ? -24 : 0,
          }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <RollingPercent value={displayProgress} lite={lite} />
        </motion.div>

        <div className="mt-8 flex min-h-[2rem] max-w-2xl flex-col items-center justify-center gap-3 sm:mt-10">
          <div className="flex items-center justify-center gap-2.5">
            <AnimatePresence mode="wait">
              <motion.p
                key={STATUS_LINES[statusIndex]}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="text-center text-sm font-semibold tracking-[0.18em] text-text-primary uppercase sm:text-base md:text-lg md:tracking-[0.2em]"
              >
                {STATUS_LINES[statusIndex]}
              </motion.p>
            </AnimatePresence>
            <motion.span
              className="inline-block size-2 shrink-0 bg-accent-cyan shadow-[0_0_10px_rgba(125,211,252,0.8)]"
              aria-hidden
              animate={{ opacity: [1, 0.25, 1] }}
              transition={{
                duration: 0.9,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
          <p className="max-w-md text-center text-xs leading-relaxed text-text-secondary sm:text-sm">
            Building scalable, responsive experiences with React, Next.js, and
            TypeScript — based in Jaipur.
          </p>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 px-5 pb-9 md:px-10 md:pb-11">
        <div className="relative h-[2px] w-full overflow-hidden rounded-full bg-border-muted">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-accent-cyan"
            animate={{ width: barWidth }}
            transition={{ duration: 0.18, ease: "linear" }}
            aria-hidden
          />
          <motion.div
            className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-action-primary/40 to-transparent"
            aria-hidden
            animate={{ left: ["-35%", "110%"] }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-1/2 size-2.5 -translate-y-1/2 rounded-full bg-action-primary shadow-[0_0_18px_5px_color-mix(in_srgb,var(--color-accent-cyan)_70%,transparent)]"
            animate={{ left: barWidth }}
            transition={{ duration: 0.18, ease: "linear" }}
            style={{ marginLeft: "-5px" }}
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
              transition={{ duration: 0.32 }}
              className="text-xs font-semibold tracking-[0.16em] text-text-primary uppercase sm:text-sm md:tracking-[0.2em]"
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
