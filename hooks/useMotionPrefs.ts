"use client";

import { useEffect, useState } from "react";
import { onPortfolioReady, BOOT_SAFETY_MS } from "@/lib/boot";

/** True when the user prefers reduced motion (a11y). */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}

/** Resolves after PageLoader finishes (or immediately if reduced motion). */
export function usePortfolioReady(reducedMotion: boolean) {
  const [ready, setReady] = useState(reducedMotion);

  useEffect(() => {
    if (reducedMotion) {
      setReady(true);
      return;
    }

    const fallback = window.setTimeout(() => setReady(true), BOOT_SAFETY_MS);
    const stop = onPortfolioReady(() => {
      window.clearTimeout(fallback);
      setReady(true);
    });

    return () => {
      stop();
      window.clearTimeout(fallback);
    };
  }, [reducedMotion]);

  return ready;
}
