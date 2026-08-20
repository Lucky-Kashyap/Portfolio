"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  skillBubbles,
  skillIconIsPrecolored,
  skillIconUrl,
  type SkillBubble,
} from "@/lib/skills";
import { usePrefersReducedMotion } from "@/hooks/useMotionPrefs";
import { cn } from "@/lib/utils";

function skillIconAlt(skill: Pick<SkillBubble, "label">) {
  return `${skill.label} logo`;
}

function SkillIconMark({ skill }: { skill: SkillBubble }) {
  const color =
    skill.color.toUpperCase() === "FFFFFF" ? "E2E8F0" : skill.color;
  const src = skillIconUrl(skill);
  const alt = skillIconAlt(skill);
  const precolored = skillIconIsPrecolored(skill);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      title={skill.label}
      width={40}
      height={40}
      className={cn(
        "size-9 object-contain sm:size-10",
        !precolored && "rounded-sm p-1.5",
      )}
      style={
        precolored
          ? undefined
          : {
              backgroundColor: `#${color}`,
              // Monochrome Simple Icons are black — brand tile keeps them readable
              // in light and dark themes while alt text stays crawlable.
            }
      }
      loading="lazy"
      decoding="async"
    />
  );
}

type Body = {
  skill: SkillBubble;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  homeX: number;
  homeY: number;
  img: HTMLImageElement | HTMLCanvasElement | null;
};

type SkillBubblesProps = {
  className?: string;
};

const FRICTION = 0.94;
const SPRING = 0.018;
const REPEL_RADIUS = 260;
const REPEL_STRENGTH = 92;
const GRAVITY = 0.028;
const BOUNCE = 0.68;
const MAX_SPEED = 18;

function sizeForIndex(i: number) {
  const sizes = [48, 56, 64, 52, 70, 46, 60, 54, 66];
  return sizes[i % sizes.length];
}

/** Load brand SVG, inject fill color, return drawable image (canvas-safe). */
async function loadBrandIcon(skill: SkillBubble): Promise<HTMLImageElement | null> {
  const color = skill.color === "FFFFFF" || skill.color === "ffffff" ? "E2E8F0" : skill.color;
  const primary = skillIconUrl({ ...skill, color });

  const tryUrls = [primary, skill.iconUrl].filter(
    (url, i, arr): url is string => Boolean(url) && arr.indexOf(url!) === i,
  );

  for (const url of tryUrls) {
    try {
      const isSvg =
        url.endsWith(".svg") ||
        url.includes("simple-icons") ||
        url.startsWith("/icons/");

      if (isSvg) {
        const res = await fetch(url, { mode: "cors" });
        if (!res.ok) continue;
        let svg = await res.text();
        // Local/precolored assets keep their own fills; monochrome SI get tinted
        if (!skill.iconUrl) {
          if (svg.includes("fill=")) {
            svg = svg.replace(/fill="(?!none)[^"]*"/g, `fill="#${color}"`);
          } else {
            svg = svg.replace(/<svg\b/, `<svg fill="#${color}"`);
          }
        }
        const blobUrl = URL.createObjectURL(
          new Blob([svg], { type: "image/svg+xml;charset=utf-8" }),
        );
        const img = await loadImage(blobUrl);
        URL.revokeObjectURL(blobUrl);
        if (img) return img;
      } else {
        const img = await loadImage(url);
        if (img) return img;
      }
    } catch {
      // try next source
    }
  }

  return loadImage(primary, false);
}

function loadImage(src: string, useCors = true): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    if (useCors) img.crossOrigin = "anonymous";
    img.decoding = "async";
    img.onload = () => resolve(img.naturalWidth > 0 ? img : null);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

export function SkillBubbles({ className }: SkillBubblesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const bodiesRef = useRef<Body[]>([]);
  const pointerRef = useRef({ x: -9999, y: -9999, active: false });
  const rafRef = useRef(0);
  const scrollBurstDoneRef = useRef(false);
  const reduced = usePrefersReducedMotion();
  const [ready, setReady] = useState(false);
  /** Static grid on touch / narrow viewports — canvas physics tanks mobile scroll. */
  const [useStaticGrid, setUseStaticGrid] = useState(true);

  const burstScatter = useCallback((cx: number, cy: number, strength = 14) => {
    for (const b of bodiesRef.current) {
      const dx = b.x - cx;
      const dy = b.y - cy;
      const dist = Math.hypot(dx, dy) || 0.001;
      const reach = REPEL_RADIUS + b.r + 40;
      if (dist < reach) {
        const t = 1 - dist / reach;
        const impulse = t * strength;
        b.vx += (dx / dist) * impulse;
        b.vy += (dy / dist) * impulse;
      } else {
        // Soft outward kick for distant bubbles so the whole field reacts
        b.vx += (dx / dist) * strength * 0.12;
        b.vy += (dy / dist) * strength * 0.12;
      }
    }
  }, []);

  const initBodies = useCallback((width: number, height: number) => {
    const cols = width < 640 ? 5 : width < 960 ? 7 : 9;
    const bodies: Body[] = skillBubbles.map((skill, i) => {
      const r = sizeForIndex(i) / 2;
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = ((col + 0.5) / cols) * width + (Math.random() - 0.5) * 24;
      const y = height * 0.28 + row * (r * 2.05) + Math.random() * 16;
      const clampedX = Math.min(width - r - 8, Math.max(r + 8, x));
      const clampedY = Math.min(height - r - 8, Math.max(r + 8, y));
      return {
        skill,
        x: clampedX,
        y: clampedY,
        homeX: clampedX,
        homeY: clampedY,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r,
        img: null,
      };
    });

    void Promise.all(
      bodies.map(async (body) => {
        body.img = await loadBrandIcon(body.skill);
      }),
    );

    bodiesRef.current = bodies;
  }, []);

  useEffect(() => {
    const mqCoarse = window.matchMedia("(pointer: coarse)");
    const mqNarrow = window.matchMedia("(max-width: 767px)");
    const sync = () => {
      setUseStaticGrid(mqCoarse.matches || mqNarrow.matches);
    };
    sync();
    mqCoarse.addEventListener("change", sync);
    mqNarrow.addEventListener("change", sync);
    return () => {
      mqCoarse.removeEventListener("change", sync);
      mqNarrow.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap || reduced || useStaticGrid) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let visible = true;
    let running = false;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
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
      const { x, y, r, skill } = b;
      const brand = `#${skill.color === "FFFFFF" ? "94A3B8" : skill.color}`;

      // Soft dark glass + brand-tinted rim so colorful icons read clearly
      const g = ctx.createRadialGradient(
        x - r * 0.35,
        y - r * 0.4,
        r * 0.08,
        x,
        y,
        r,
      );
      g.addColorStop(0, "rgba(248,250,252,0.16)");
      g.addColorStop(0.55, "rgba(15,23,42,0.92)");
      g.addColorStop(1, "rgba(3,6,11,0.98)");

      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, r - 0.5, 0, Math.PI * 2);
      ctx.strokeStyle = brand;
      ctx.globalAlpha = 0.55;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.globalAlpha = 1;

      const iconSize = r * 1.15;
      const drawable =
        b.img &&
        (("complete" in b.img && b.img.complete && b.img.naturalWidth > 0) ||
          ("width" in b.img && b.img.width > 0));

      if (drawable && b.img) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, r * 0.78, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(b.img, x - iconSize / 2, y - iconSize / 2, iconSize, iconSize);
        ctx.restore();
      } else {
        // Temporary fallback while icons load
        ctx.fillStyle = brand;
        ctx.font = `700 ${Math.max(11, r * 0.32)}px Syne, system-ui, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(skill.label.slice(0, 3).toUpperCase(), x, y);
      }

      // Specular highlight
      ctx.beginPath();
      ctx.ellipse(
        x - r * 0.28,
        y - r * 0.32,
        r * 0.26,
        r * 0.14,
        -0.4,
        0,
        Math.PI * 2,
      );
      ctx.fillStyle = "rgba(255,255,255,0.22)";
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
          const reach = REPEL_RADIUS + b.r;

          if (dist < reach) {
            // Stronger near cursor — punchy scatter
            const t = 1 - dist / reach;
            const force = t * t * REPEL_STRENGTH;
            const nx = dx / dist;
            const ny = dy / dist;
            b.vx += nx * force * 0.35;
            b.vy += ny * force * 0.35;
            // Slight tangential swirl so scatter feels organic
            b.vx += -ny * force * 0.08;
            b.vy += nx * force * 0.08;
          }

          // While hovering, barely pull home — let bubbles stay scattered
          b.vx += (b.homeX - b.x) * SPRING * 0.04;
          b.vy += (b.homeY - b.y) * SPRING * 0.04;
          b.vy += GRAVITY * 0.35;
        } else {
          // Idle: settle back into cluster
          b.vx += (b.homeX - b.x) * SPRING;
          b.vy += (b.homeY - b.y) * SPRING;
          b.vy += GRAVITY;
        }

        b.vx *= FRICTION;
        b.vy *= FRICTION;

        const speed = Math.hypot(b.vx, b.vy);
        if (speed > MAX_SPEED) {
          b.vx = (b.vx / speed) * MAX_SPEED;
          b.vy = (b.vy / speed) * MAX_SPEED;
        }

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
            const impact = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
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

      if (visible) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        running = false;
      }
    };

    const startLoop = () => {
      if (running || !visible) return;
      running = true;
      rafRef.current = requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visible = entry.isIntersecting;
          if (!entry.isIntersecting) {
            cancelAnimationFrame(rafRef.current);
            running = false;
            continue;
          }
          startLoop();
          if (scrollBurstDoneRef.current) continue;
          if (bodiesRef.current.length === 0) continue;
          scrollBurstDoneRef.current = true;
          const rect = wrap.getBoundingClientRect();
          burstScatter(rect.width * 0.5, rect.height * 0.45, 16);
        }
      },
      { threshold: 0.12, rootMargin: "80px 0px" },
    );
    io.observe(wrap);
    startLoop();

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      io.disconnect();
      bodiesRef.current = [];
      scrollBurstDoneRef.current = false;
    };
  }, [reduced, useStaticGrid, initBodies, burstScatter]);

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const wasActive = pointerRef.current.active;
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    pointerRef.current = { x, y, active: true };

    // First hover / re-enter — burst scatter impulse
    if (!wasActive) {
      burstScatter(x, y, 14);
    }
  };

  const onPointerLeave = () => {
    pointerRef.current.active = false;
  };

  if (reduced || useStaticGrid) {
    return (
      <ul
        className={cn(
          "grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8",
          className,
        )}
        aria-label="Technology skills"
      >
        {skillBubbles.map((skill) => (
          <li
            key={skill.id}
            className="flex flex-col items-center gap-1.5 rounded-sm border border-border-muted bg-surface-raised p-2.5 text-center surface-hover transition-[border-color,box-shadow,transform] duration-normal ease-standard hover:border-accent-cyan/70 hover:shadow-[0_0_0_1px_rgba(125,211,252,0.28),0_12px_36px_rgba(3,6,11,0.45)] sm:gap-2 sm:p-3 md:p-4"
          >
            <SkillIconMark skill={skill} />
            <span className="text-[10px] leading-tight text-text-secondary sm:text-xs">
              {skill.label}
            </span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div
      ref={wrapRef}
      className={cn(
        "relative h-[min(52vh,420px)] w-full overflow-hidden rounded-md border border-border-muted bg-surface-base surface-hover transition-[border-color,box-shadow,transform] duration-normal ease-standard hover:border-accent-cyan/70 hover:shadow-[0_0_0_1px_rgba(125,211,252,0.28),0_12px_36px_rgba(3,6,11,0.45)] sm:h-[min(58vh,480px)] lg:h-[min(68vh,560px)]",
        className,
      )}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onPointerDown={onPointerMove}
      role="img"
      aria-label="Interactive skill bubbles. Icons scatter when the section scrolls into view and when you move the cursor."
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

      <ul className="sr-only">
        {skillBubbles.map((skill) => (
          <li key={skill.id}>{skill.label}</li>
        ))}
      </ul>
    </div>
  );
}
