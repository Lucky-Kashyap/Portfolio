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
 * Carpet-style clip unveil — content unrolls into view under the loader wipe.
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
    // Match PageLoader worst-case: load + hold + exit + buffer
    const fallback = window.setTimeout(() => setReady(true), 9500);

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
      className={cn("will-change-[clip-path,opacity,filter]", className)}
      initial={{
        opacity: 0.65,
        filter: "blur(8px)",
        clipPath: "inset(100% 0 0 0)",
      }}
      animate={
        ready
          ? {
              opacity: 1,
              filter: "blur(0px)",
              clipPath: "inset(0% 0 0 0)",
            }
          : {
              opacity: 0.65,
              filter: "blur(8px)",
              clipPath: "inset(100% 0 0 0)",
            }
      }
      transition={{
        duration: 1.15,
        delay: ready ? 0.04 : 0,
        ease: [0.76, 0, 0.24, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
