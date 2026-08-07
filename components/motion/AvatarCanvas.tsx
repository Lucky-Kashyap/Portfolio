"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/useMotionPrefs";

type AvatarCanvasProps = {
  /** Animated GIF / still source drawn to canvas each frame */
  src: string;
  /** Fallback still if GIF fails */
  poster?: string;
  className?: string;
  /** Soft object position (0–1) */
  focusY?: number;
};

/**
 * Draws an animated GIF (or still) onto canvas so the wave loops without
 * CSS masks that clip the face. Soft vignette keeps edges clean.
 */
export function AvatarCanvas({
  src,
  poster,
  className,
  focusY = 0.12,
}: AvatarCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();
  const source = reduced && poster ? poster : src;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const img = new Image();
    img.decoding = "async";
    img.src = source;

    let raf = 0;
    let alive = true;

    const fit = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      if (w < 2 || h < 2) return;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const paint = () => {
      if (!alive || !ctx) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w < 2 || h < 2 || !img.complete || !img.naturalWidth) {
        raf = requestAnimationFrame(paint);
        return;
      }

      ctx.clearRect(0, 0, w, h);

      // Cover-fit without hard face crop — bias toward upper torso / head
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const scale = Math.max(w / iw, h / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      const dx = (w - dw) / 2;
      const dy = (h - dh) * focusY;

      ctx.drawImage(img, dx, dy, dw, dh);

      // Soft edge fade — no polygon clip cutting the hand/face
      const fade = ctx.createLinearGradient(0, h * 0.72, 0, h);
      fade.addColorStop(0, "rgba(12,17,24,0)");
      fade.addColorStop(1, "rgba(12,17,24,0.55)");
      ctx.fillStyle = fade;
      ctx.fillRect(0, 0, w, h);

      const glow = ctx.createRadialGradient(
        w * 0.45,
        h * 0.28,
        8,
        w * 0.45,
        h * 0.28,
        w * 0.55,
      );
      glow.addColorStop(0, "rgba(125,211,252,0.12)");
      glow.addColorStop(1, "rgba(125,211,252,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      raf = requestAnimationFrame(paint);
    };

    const onLoad = () => {
      fit();
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(paint);
    };

    img.addEventListener("load", onLoad);
    if (img.complete) onLoad();

    const ro = new ResizeObserver(() => {
      fit();
    });
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      img.removeEventListener("load", onLoad);
      ro.disconnect();
    };
  }, [source, focusY]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 size-full", className)}
      aria-hidden
    />
  );
}
