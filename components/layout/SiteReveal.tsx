"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/useMotionPrefs";
import { PORTFOLIO_READY_EVENT, BOOT_SAFETY_MS } from "@/lib/boot";
import { cn } from "@/lib/utils";

type SiteRevealProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Reveals the main site once PageLoader fires `portfolio:ready`.
 * Opacity-only — clip/blur on the whole page stutters on mobile GPUs.
 */
export function SiteReveal({ children, className }: SiteRevealProps) {
  const reduced = usePrefersReducedMotion();
  const [ready, setReady] = useState(reduced);

  useEffect(() => {
    if (reduced) {
      setReady(true);
      return;
    }

    const onReady = () => setReady(true);
    window.addEventListener(PORTFOLIO_READY_EVENT, onReady);
    const fallback = window.setTimeout(() => setReady(true), BOOT_SAFETY_MS);

    return () => {
      window.removeEventListener(PORTFOLIO_READY_EVENT, onReady);
      window.clearTimeout(fallback);
    };
  }, [reduced]);

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn("will-change-[opacity,transform]", className)}
      initial={{ opacity: 0, y: 10 }}
      animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      transition={{
        duration: 0.48,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
