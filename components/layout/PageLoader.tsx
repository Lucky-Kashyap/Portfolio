"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { site } from "@/lib/content";
import { cn } from "@/lib/utils";

const STATUS_LINES = [
  "INITIALIZING SYSTEM ARCHITECTURE...",
  "BOOTSTRAPPING REACT RUNTIME...",
  "HYDRATING NEXT.JS ROUTES...",
  "COMPILING TYPESCRIPT MODULES...",
  "OPTIMIZING WEBGL / MOTION LAYERS...",
  "SYNCING GSAP SCROLL TRIGGERS...",
  "LOADING PROJECT ASSETS...",
  "CALIBRATING UI MOTION SYSTEM...",
  "PORTFOLIO READY — ENTERING...",
] as const;

type PageLoaderProps = {
  onComplete?: () => void;
};

function padProgress(n: number) {
  return String(Math.min(100, Math.max(0, Math.round(n)))).padStart(3, "0");
}

function brandInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "DK";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
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

  useEffect(() => {
    if (reduceMotion) {
      setPhase("done");
      onComplete?.();
      window.dispatchEvent(new Event("portfolio:ready"));
      return;
    }

    window.dispatchEvent(new Event("portfolio:loader-start"));

    const duration = 3200;
    const started = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - started) / duration);
      // Ease-out cubic — fast start, settle near 100
      const eased = 1 - Math.pow(1 - t, 3);
      const next = eased * 100;
      setProgress(next);
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
        setPhase("exiting");
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
    }, 720);

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

  const pct = padProgress(progress);
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
      aria-label={`Loading portfolio ${pct} percent`}
      initial={{ opacity: 1 }}
      animate={
        phase === "exiting"
          ? { opacity: 0, scale: 1.04, filter: "blur(8px)" }
          : { opacity: 1, scale: 1, filter: "blur(0px)" }
      }
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Atmosphere */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 45%, color-mix(in srgb, #7dd3fc 12%, transparent), transparent 68%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Header row */}
      <div className="absolute inset-x-0 top-0 z-20 flex items-start justify-between px-5 pt-5 md:px-8 md:pt-7">
        <p className="text-sm font-bold tracking-[0.18em] text-text-primary uppercase md:text-md">
          {initials}
        </p>
        <p className="text-[10px] font-medium tracking-[0.22em] text-text-tertiary uppercase md:text-xs">
          Portfolio edition @{year}
        </p>
      </div>

      {/* Giant background role */}
      <p
        className="pointer-events-none absolute left-1/2 top-[42%] z-0 w-[140%] -translate-x-1/2 -translate-y-1/2 select-none text-center text-[clamp(2.75rem,14vw,10rem)] font-bold tracking-tighter text-text-primary/[0.06] uppercase"
        aria-hidden
      >
        {site.heroHeadline}
      </p>

      {/* Center counter + status */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6">
        <div className="flex items-start leading-none">
          <span
            className="font-bold tracking-tighter text-text-primary tabular-nums"
            style={{
              fontSize: "clamp(5.5rem, 22vw, 12rem)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {pct}
          </span>
          <span
            className="mt-[0.18em] font-bold tracking-tight text-accent-cyan"
            style={{ fontSize: "clamp(1.75rem, 6vw, 3.5rem)" }}
          >
            %
          </span>
        </div>

        <div className="mt-6 flex min-h-[1.5rem] items-center justify-center gap-2">
          <AnimatePresence mode="wait">
            <motion.p
              key={STATUS_LINES[statusIndex]}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="text-center text-[11px] font-medium tracking-[0.28em] text-text-primary uppercase md:text-xs"
            >
              {STATUS_LINES[statusIndex]}
            </motion.p>
          </AnimatePresence>
          <span
            className="inline-block size-2.5 shrink-0 bg-accent-cyan animate-pulse"
            aria-hidden
          />
        </div>
      </div>

      {/* Bottom progress */}
      <div className="absolute inset-x-0 bottom-0 z-20 px-5 pb-8 md:px-10 md:pb-10">
        <div className="relative h-px w-full bg-border-muted">
          <motion.div
            className="absolute inset-y-0 left-0 bg-accent-cyan"
            style={{ width: barWidth }}
            aria-hidden
          />
          <motion.div
            className="absolute top-1/2 size-2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_16px_4px_rgba(125,211,252,0.85)]"
            style={{ left: barWidth, marginLeft: "-4px" }}
            aria-hidden
          />
        </div>
        <div className="mt-4 flex items-center justify-between text-[10px] font-medium tracking-[0.22em] text-text-tertiary uppercase md:text-xs">
          <span>Loading assets</span>
          <span>Please wait</span>
        </div>
      </div>
    </motion.div>
  );
}
