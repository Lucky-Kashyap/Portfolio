"use client";

import { motion } from "framer-motion";
import { site } from "@/lib/content";
import { usePrefersReducedMotion } from "@/hooks/useMotionPrefs";
import { cn } from "@/lib/utils";

type AvailabilityBadgeProps = {
  className?: string;
  /** Show the longer opportunity line under the pill */
  showDetail?: boolean;
  /** Compact pill only (hero) vs roomier contact treatment */
  size?: "sm" | "md";
};

function LiveDot({ reduced }: { reduced: boolean }) {
  return (
    <span className="relative inline-flex size-2.5 shrink-0 items-center justify-center">
      {!reduced ? (
        <span
          className="absolute inset-0 rounded-full bg-emerald-400/70 animate-live-ping"
          aria-hidden
        />
      ) : null}
      <span
        className={cn(
          "relative size-2 rounded-full bg-emerald-400 shadow-[0_0_0_1px_rgba(52,211,153,0.35)]",
          !reduced && "animate-live-pulse",
        )}
        aria-hidden
      />
    </span>
  );
}

export function AvailabilityBadge({
  className,
  showDetail = false,
  size = "md",
}: AvailabilityBadgeProps) {
  const reduced = usePrefersReducedMotion();
  const { label, headline, detail } = site.availability;

  return (
    <motion.div
      className={cn("flex flex-col gap-2", className)}
      initial={reduced ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className={cn(
          "inline-flex w-fit max-w-full items-center gap-2 rounded-full border border-emerald-400/35 bg-emerald-400/10 text-text-primary backdrop-blur-sm",
          "shadow-[0_0_0_1px_color-mix(in_srgb,#34d399_12%,transparent)]",
          size === "sm"
            ? "px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em]"
            : "px-3 py-1.5 text-[11px] font-semibold tracking-[0.1em] sm:text-xs",
        )}
        role="status"
        aria-label={`${label}. ${headline}`}
      >
        <LiveDot reduced={reduced} />
        <span className="shrink-0 uppercase tracking-[0.14em] text-emerald-400">
          {label}
        </span>
        <span className="text-text-tertiary" aria-hidden>
          ·
        </span>
        <span className="min-w-0 truncate font-medium normal-case tracking-normal text-text-secondary">
          {headline}
        </span>
      </div>

      {showDetail ? (
        <motion.p
          className="max-w-xl text-sm leading-relaxed text-text-secondary sm:text-[0.95rem]"
          initial={reduced ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          {detail}
        </motion.p>
      ) : (
        <p className="sr-only">{detail}</p>
      )}
    </motion.div>
  );
}
