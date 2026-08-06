"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { BrandMark } from "@/components/ui/BrandMark";
import { site } from "@/lib/content";
import { cn } from "@/lib/utils";

const STATUS = "Initializing system architecture...";

type PageLoaderProps = {
  onComplete?: () => void;
};

export function PageLoader({ onComplete }: PageLoaderProps) {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<"loading" | "exiting" | "done">(
    reduceMotion ? "done" : "loading",
  );

  useEffect(() => {
    if (reduceMotion) {
      setPhase("done");
      onComplete?.();
      window.dispatchEvent(new Event("portfolio:ready"));
      return;
    }

    window.dispatchEvent(new Event("portfolio:loader-start"));

    const exitTimer = window.setTimeout(() => setPhase("exiting"), 1750);
    const doneTimer = window.setTimeout(() => {
      setPhase("done");
      onComplete?.();
      window.dispatchEvent(new Event("portfolio:ready"));
    }, 2200);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
    };
  }, [reduceMotion, onComplete]);

  useEffect(() => {
    if (phase === "done") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center bg-surface-muted",
        phase === "exiting" && "pointer-events-none",
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading portfolio"
    >
      <motion.div
        className="absolute inset-0"
        aria-hidden
        initial={{ opacity: 1 }}
        animate={phase === "exiting" ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 50% 42%, color-mix(in srgb, #111 6%, transparent), transparent 70%)",
        }}
      />

      <motion.div
        className="relative z-10 mx-auto flex w-full max-w-xl flex-col items-center px-8 text-center"
        initial={{ opacity: 0, y: 12 }}
        animate={
          phase === "exiting"
            ? { opacity: 0, y: -8 }
            : { opacity: 1, y: 0 }
        }
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <BrandMark
          size={48}
          className="mb-6 rounded-xs shadow-card"
          title={`${site.brand} mark`}
        />
        <p className="text-display-md font-semibold tracking-tight text-text-primary">
          {site.tagline}
        </p>
        <p className="mt-5 text-xs font-medium tracking-[0.22em] text-text-tertiary uppercase">
          {STATUS}
        </p>
        <div
          className="mt-8 h-1 w-full max-w-[220px] overflow-hidden rounded-xl bg-[color-mix(in_srgb,#111_10%,transparent)]"
          aria-hidden
        >
          <motion.div
            className="h-full rounded-xl bg-action-primary"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: 1.55,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
