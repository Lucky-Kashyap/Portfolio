"use client";

import { useEffect, useState, type ReactNode } from "react";
import Lenis from "lenis";
import { ReactLenis, useLenis } from "lenis/react";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/useMotionPrefs";
import {
  isCoarsePointer,
  PORTFOLIO_LOADER_START_EVENT,
  PORTFOLIO_READY_EVENT,
} from "@/lib/boot";
import "lenis/dist/lenis.css";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

function LenisGsapBridge() {
  const lenis = useLenis();

  useEffect(() => {
    registerGsap();
    if (!lenis) return;

    window.__lenis = lenis;

    // Keep ScrollTrigger in sync with Lenis (virtual scroll)
    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length && typeof value === "number") {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });
    ScrollTrigger.defaults({ scroller: document.documentElement });

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const ticker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    const onLoaderStart = () => lenis.stop();
    const onLoaderDone = () => {
      lenis.start();
      ScrollTrigger.refresh();
    };

    window.addEventListener(PORTFOLIO_LOADER_START_EVENT, onLoaderStart);
    window.addEventListener(PORTFOLIO_READY_EVENT, onLoaderDone);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    ScrollTrigger.refresh();

    return () => {
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(ticker);
      window.removeEventListener(PORTFOLIO_LOADER_START_EVENT, onLoaderStart);
      window.removeEventListener(PORTFOLIO_READY_EVENT, onLoaderDone);
      window.removeEventListener("resize", onResize);
      if (window.__lenis === lenis) delete window.__lenis;
    };
  }, [lenis]);

  return null;
}

type SmoothScrollProps = {
  children: ReactNode;
};

export function SmoothScroll({ children }: SmoothScrollProps) {
  const reduceMotion = usePrefersReducedMotion();
  const [enableSmooth, setEnableSmooth] = useState(false);

  useEffect(() => {
    // Native touch scrolling is smoother on phones; Lenis waits until after paint.
    setEnableSmooth(!reduceMotion && !isCoarsePointer());
  }, [reduceMotion]);

  if (!enableSmooth) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.085,
        duration: 1.05,
        smoothWheel: true,
        wheelMultiplier: 0.85,
        touchMultiplier: 1,
        anchors: false,
        autoRaf: false,
      }}
    >
      <LenisGsapBridge />
      {children}
    </ReactLenis>
  );
}
