"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import Lenis from "lenis";
import { ReactLenis, useLenis } from "lenis/react";
import { useReducedMotion } from "framer-motion";
import "lenis/dist/lenis.css";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

function LenisBridge() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    window.__lenis = lenis;
    return () => {
      if (window.__lenis === lenis) delete window.__lenis;
    };
  }, [lenis]);

  useEffect(() => {
    if (!lenis) return;

    const onLoaderStart = () => lenis.stop();
    const onLoaderDone = () => lenis.start();

    window.addEventListener("portfolio:loader-start", onLoaderStart);
    window.addEventListener("portfolio:ready", onLoaderDone);

    return () => {
      window.removeEventListener("portfolio:loader-start", onLoaderStart);
      window.removeEventListener("portfolio:ready", onLoaderDone);
    };
  }, [lenis]);

  return null;
}

type SmoothScrollProps = {
  children: ReactNode;
};

export function SmoothScroll({ children }: SmoothScrollProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08,
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.4,
        anchors: false,
        autoRaf: true,
      }}
    >
      <LenisBridge />
      {children}
    </ReactLenis>
  );
}
