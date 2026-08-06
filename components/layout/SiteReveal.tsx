"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/useMotionPrefs";
import { cn } from "@/lib/utils";

type SiteRevealProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Reveals the main site once PageLoader fires `portfolio:ready`.
 * Keeps content mounted (for SEO / preload) but hidden until ready.
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
    window.addEventListener("portfolio:ready", onReady);
    const fallback = window.setTimeout(() => setReady(true), 4500);

    return () => {
      window.removeEventListener("portfolio:ready", onReady);
      window.clearTimeout(fallback);
    };
  }, [reduced]);

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn("will-change-transform", className)}
      initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
      animate={
        ready
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : { opacity: 0, y: 28, filter: "blur(10px)" }
      }
      transition={{
        duration: 0.95,
        delay: ready ? 0.08 : 0,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
