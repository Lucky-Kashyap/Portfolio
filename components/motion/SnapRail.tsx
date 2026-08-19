"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type SnapRailProps = {
  children: ReactNode;
  className?: string;
  /** Number of slides for progress ticks */
  count: number;
  /** Accessible label for the scroll region */
  label: string;
};

/**
 * Mobile/tablet horizontal snap rail with active-index progress.
 * Desktop callers should hide this and use a different layout.
 */
export function SnapRail({ children, className, count, label }: SnapRailProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const sync = useCallback(() => {
    const el = ref.current;
    if (!el || count < 1) return;
    const slides = Array.from(el.children) as HTMLElement[];
    if (!slides.length) return;

    const mid = el.scrollLeft + el.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    slides.forEach((slide, i) => {
      const center = slide.offsetLeft + slide.offsetWidth / 2;
      const dist = Math.abs(center - mid);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    setActive(best);
  }, [count]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", sync);
      ro.disconnect();
    };
  }, [sync]);

  return (
    <div className={cn("w-full", className)}>
      <div
        ref={ref}
        className="snap-rail snap-rail-edge"
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
      >
        {children}
      </div>
      {count > 1 ? (
        <div className="snap-progress" aria-hidden>
          {Array.from({ length: count }, (_, i) => (
            <span key={i} data-active={i === active} />
          ))}
        </div>
      ) : null}
      <p className="mt-2 text-center text-[10px] tracking-[0.16em] text-text-tertiary uppercase">
        Swipe · {active + 1}/{count}
      </p>
    </div>
  );
}
