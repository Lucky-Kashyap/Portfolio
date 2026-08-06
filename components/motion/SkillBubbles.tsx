"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { skillBubbles, skillIconUrl, type SkillBubble } from "@/lib/skills";
import { usePrefersReducedMotion } from "@/hooks/useMotionPrefs";
import { cn } from "@/lib/utils";

type Body = {
  skill: SkillBubble;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  img: HTMLImageElement | null;
};

type SkillBubblesProps = {
  className?: string;
};

const FRICTION = 0.965;
const SPRING = 0.012;
const REPEL_RADIUS = 150;
const REPEL_STRENGTH = 28;
const GRAVITY = 0.045;
const BOUNCE = 0.62;

function sizeForIndex(i: number) {
  const sizes = [52, 64, 72, 58, 80, 48, 68];
  return sizes[i % sizes.length];
}

export function SkillBubbles({ className }: SkillBubblesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const bodiesRef = useRef<Body[]>([]);
  const pointerRef = useRef({ x: -9999, y: -9999, active: false });
  const rafRef = useRef(0);
  const reduced = usePrefersReducedMotion();
  const [ready, setReady] = useState(false);
  const [isCoarse, setIsCoarse] = useState(false);

  const initBodies = useCallback((width: number, height: number) => {
    const bodies: Body[] = skillBubbles.map((skill, i) => {
      const r = sizeForIndex(i) / 2;
      const col = i % 5;
      const row = Math.floor(i / 5);
      const x = (width / 6) * (col + 1) + (Math.random() - 0.5) * 40;
      const y = height * 0.35 + row * 70 + Math.random() * 30;
      return {
        skill,
        x: Math.min(width - r - 8, Math.max(r + 8, x)),
        y: Math.min(height - r - 8, Math.max(r + 8, y)),
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        r,
        img: null,
      };
    });

    bodies.forEach((body) => {
      const img = new Image();
      img.decoding = "async";
      img.crossOrigin = "anonymous";
      img.src = skillIconUrl(body.skill.icon, body.skill.color);
      img.onload = () => {
        body.img = img;
      };
      img.onerror = () => {
        body.img = null;
      };
    });

    bodiesRef.current = bodies;
  }, []);

  useEffect(() => {
    setIsCoarse(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap || reduced) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (bodiesRef.current.length === 0) {
        initBodies(rect.width, rect.height);
      } else {
        bodiesRef.current.forEach((b) => {
          b.x = Math.min(rect.width - b.r, Math.max(b.r, b.x));
          b.y = Math.min(rect.height - b.r, Math.max(b.r, b.y));
        });
      }
      setReady(true);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const drawBubble = (b: Body) => {
      const { x, y, r } = b;
      const g = ctx.createRadialGradient(
        x - r * 0.35,
        y - r * 0.4,
        r * 0.1,
        x,
        y,
        r,
      );
      g.addColorStop(0, "#ffffff");
      g.addColorStop(0.45, "#f4f4f5");
      g.addColorStop(0.85, "#d4d4d8");
      g.addColorStop(1, "#a1a1aa");

      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,255,255,0.35)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      const iconSize = r * 1.05;
      if (b.img?.complete && b.img.naturalWidth > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, r * 0.72, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(
          b.img,
          x - iconSize / 2,
          y - iconSize / 2,
          iconSize,
          iconSize,
        );
        ctx.restore();
      } else {
        ctx.fillStyle = "#18181b";
        ctx.font = `600 ${Math.max(10, r * 0.28)}px Inter, system-ui, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(b.skill.label.slice(0, 3), x, y);
      }

      // soft highlight
      ctx.beginPath();
      ctx.ellipse(
        x - r * 0.28,
        y - r * 0.32,
        r * 0.28,
        r * 0.16,
        -0.4,
        0,
        Math.PI * 2,
      );
      ctx.fillStyle = "rgba(255,255,255,0.55)";
      ctx.fill();
    };

    const step = () => {
      const rect = wrap.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const pointer = pointerRef.current;
      const bodies = bodiesRef.current;

      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < bodies.length; i++) {
        const b = bodies[i];

        if (pointer.active) {
          const dx = b.x - pointer.x;
          const dy = b.y - pointer.y;
          const dist = Math.hypot(dx, dy) || 0.001;
          if (dist < REPEL_RADIUS + b.r) {
            const force =
              ((REPEL_RADIUS + b.r - dist) / (REPEL_RADIUS + b.r)) *
              REPEL_STRENGTH;
            b.vx += (dx / dist) * force * 0.08;
            b.vy += (dy / dist) * force * 0.08;
          }
        }

        // soft home spring toward lower band (stacked feel)
        const homeY = h * 0.62 + (i % 4) * 18;
        const homeX = ((i + 0.5) / bodies.length) * w;
        b.vx += (homeX - b.x) * SPRING * 0.15;
        b.vy += (homeY - b.y) * SPRING * 0.2;
        b.vy += GRAVITY;

        b.vx *= FRICTION;
        b.vy *= FRICTION;
        b.x += b.vx;
        b.y += b.vy;

        if (b.x < b.r) {
          b.x = b.r;
          b.vx *= -BOUNCE;
        } else if (b.x > w - b.r) {
          b.x = w - b.r;
          b.vx *= -BOUNCE;
        }
        if (b.y < b.r) {
          b.y = b.r;
          b.vy *= -BOUNCE;
        } else if (b.y > h - b.r) {
          b.y = h - b.r;
          b.vy *= -BOUNCE;
        }
      }

      // soft collisions
      for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) {
          const a = bodies[i];
          const b = bodies[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy) || 0.001;
          const min = a.r + b.r;
          if (dist < min) {
            const overlap = (min - dist) * 0.5;
            const nx = dx / dist;
            const ny = dy / dist;
            a.x -= nx * overlap;
            a.y -= ny * overlap;
            b.x += nx * overlap;
            b.y += ny * overlap;
            const dvx = a.vx - b.vx;
            const dvy = a.vy - b.vy;
            const impact = dvx * nx + dvy * ny;
            if (impact > 0) {
              a.vx -= impact * nx * 0.5;
              a.vy -= impact * ny * 0.5;
              b.vx += impact * nx * 0.5;
              b.vy += impact * ny * 0.5;
            }
          }
        }
      }

      for (const b of bodies) drawBubble(b);
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      bodiesRef.current = [];
    };
  }, [reduced, initBodies]);

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    pointerRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      active: true,
    };
  };

  const onPointerLeave = () => {
    pointerRef.current.active = false;
  };

  if (reduced || isCoarse) {
    return (
      <ul
        className={cn(
          "grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5",
          className,
        )}
        aria-label="Technology skills"
      >
        {skillBubbles.map((skill) => (
          <li
            key={skill.id}
            className="flex flex-col items-center gap-2 rounded-sm border border-border-muted bg-surface-raised p-4 text-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={skillIconUrl(skill.icon, skill.color)}
              alt={`${skill.label} technology logo`}
              width={36}
              height={36}
              className="size-9"
              loading="lazy"
            />
            <span className="text-xs text-text-secondary">{skill.label}</span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div
      ref={wrapRef}
      className={cn(
        "relative h-[min(70vh,560px)] w-full overflow-hidden rounded-md border border-border-muted bg-surface-base",
        className,
      )}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onPointerDown={onPointerMove}
      role="img"
      aria-label="Interactive skill bubbles. Move your cursor to push the technology bubbles away."
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 size-full touch-none"
        aria-hidden
      />
      {!ready ? (
        <p className="absolute inset-0 flex items-center justify-center text-sm text-text-tertiary">
          Loading skills…
        </p>
      ) : null}

      {/* Screen-reader list */}
      <ul className="sr-only">
        {skillBubbles.map((skill) => (
          <li key={skill.id}>{skill.label}</li>
        ))}
      </ul>
    </div>
  );
}
