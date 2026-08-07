"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/useMotionPrefs";
import { cn } from "@/lib/utils";

/**
 * Lightweight custom cursor — desktop / fine pointer only.
 * Supports optional `data-cursor-label` on interactive targets.
 */
export function CustomCursor() {
  const reduced = usePrefersReducedMotion();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (reduced) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    let x = 0;
    let y = 0;
    let rx = 0;
    let ry = 0;
    let hovering = false;
    let hasLabel = false;
    let raf = 0;

    const onMove = (event: MouseEvent) => {
      x = event.clientX;
      y = event.clientY;
    };

    const onOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const interactive = target?.closest(
        "a, button, [data-cursor='hover'], summary, input, textarea, [role='button']",
      ) as HTMLElement | null;
      hovering = Boolean(interactive);
      const labeled = (interactive?.closest("[data-cursor-label]") ||
        interactive?.hasAttribute?.("data-cursor-label")
        ? interactive
        : null) as HTMLElement | null;
      const text =
        labeled?.getAttribute("data-cursor-label") ||
        interactive?.getAttribute("data-cursor-label") ||
        "";
      hasLabel = hovering && Boolean(text);
      label.textContent = hasLabel ? text : "";
      ring.dataset.hasLabel = hasLabel ? "true" : "false";
    };

    const tick = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      const scale = hasLabel ? 1 : hovering ? 1.65 : 1;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${scale})`;
      ring.style.opacity = hovering ? "0.55" : "0.85";
      raf = requestAnimationFrame(tick);
    };

    document.documentElement.classList.add("has-custom-cursor");
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[200] hidden md:block"
      aria-hidden
    >
      <div
        ref={dotRef}
        className={cn(
          "absolute top-0 left-0 size-1.5 rounded-full bg-action-primary",
          "will-change-transform",
        )}
      />
      <div
        ref={ringRef}
        className={cn(
          "absolute top-0 left-0 flex size-8 items-center justify-center rounded-full border border-action-primary/50",
          "will-change-transform transition-[opacity,padding,width,height] duration-fast",
          "data-[has-label=true]:h-7 data-[has-label=true]:w-auto data-[has-label=true]:px-2.5 data-[has-label=true]:border-accent-cyan/60",
        )}
      >
        <span
          ref={labelRef}
          className="whitespace-nowrap text-[9px] font-semibold tracking-[0.14em] text-accent-cyan uppercase empty:hidden"
        />
      </div>
    </div>
  );
}
