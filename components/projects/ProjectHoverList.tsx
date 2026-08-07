"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { ArrowUpRight, GitFork, Star } from "lucide-react";
import { TextLink } from "@/components/ui";
import type { Project } from "@/lib/content";
import { usePrefersReducedMotion } from "@/hooks/useMotionPrefs";
import { cn } from "@/lib/utils";

const ProjectDistortionPreview = dynamic(
  () =>
    import("@/components/projects/ProjectDistortionPreview").then(
      (m) => m.ProjectDistortionPreview,
    ),
  { ssr: false, loading: () => null },
);

type ProjectHoverListProps = {
  projects: readonly Project[];
  className?: string;
};

/** Portrait float — matches the classic list + mouse-image-distortion reference */
const PREVIEW_W = 260;
const PREVIEW_H = 360;
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

function usePointerFine() {
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return fine;
}

function ProjectMeta({ project }: { project: Project }) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-3">
      <TextLink
        href={project.href}
        external
        className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.16em] text-accent-cyan uppercase no-underline hover:text-text-primary sm:text-xs"
        aria-label={`${project.title} — ${project.ctaLabel ?? "Open"}`}
      >
        {project.ctaLabel ?? "Open"}
        <ArrowUpRight size={13} aria-hidden />
      </TextLink>
      {project.githubHref ? (
        <TextLink
          href={project.githubHref}
          external
          className="text-[11px] font-semibold tracking-[0.14em] text-text-tertiary uppercase no-underline hover:text-text-primary sm:text-xs"
        >
          GitHub
        </TextLink>
      ) : null}
      {typeof project.stars === "number" ? (
        <span className="inline-flex items-center gap-1 text-[11px] text-text-tertiary">
          <Star size={11} className="text-accent-amber" aria-hidden />
          {project.stars}
          {typeof project.forks === "number" ? (
            <>
              <GitFork size={11} aria-hidden className="ml-1" />
              {project.forks}
            </>
          ) : null}
        </span>
      ) : null}
    </div>
  );
}

function clampPreviewPos(clientX: number, clientY: number) {
  const offsetX = 36;
  const offsetY = -PREVIEW_H * 0.45;
  const maxX = window.innerWidth - PREVIEW_W - 20;
  const maxY = window.innerHeight - PREVIEW_H - 20;
  return {
    x: Math.min(maxX, Math.max(16, clientX + offsetX)),
    y: Math.min(maxY, Math.max(16, clientY + offsetY)),
  };
}

/**
 * Line-by-line project index.
 * Desktop: floating portrait preview with mouse-image-distortion (WebGL).
 * Touch: tap to expand image + details.
 */
export function ProjectHoverList({ projects, className }: ProjectHoverListProps) {
  const reduced = usePrefersReducedMotion();
  const finePointer = usePointerFine();
  const [hovered, setHovered] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [mix, setMix] = useState(0);

  const rawX = useMotionValue(-9999);
  const rawY = useMotionValue(-9999);
  const x = useSpring(rawX, { stiffness: 120, damping: 20, mass: 0.9 });
  const y = useSpring(rawY, { stiffness: 120, damping: 20, mass: 0.9 });

  const velocityRef = useRef(0);
  const mouseNormRef = useRef({ x: 0.5, y: 0.5 });
  const lastPointer = useRef({ x: 0, y: 0, t: 0 });
  const mixRaf = useRef<number | null>(null);

  const active = hovered != null ? projects[hovered] : null;
  const showDesktopHover = finePointer && !reduced;
  // Shader mix: prev (0) → display (1)
  const fromSrc = projects[prevIndex]?.image ?? projects[0]?.image ?? "";
  const toSrc = projects[displayIndex]?.image ?? fromSrc;

  // Preload covers for instant swaps
  useEffect(() => {
    if (!showDesktopHover) return;
    projects.forEach((p) => {
      const img = new window.Image();
      img.src = p.image;
    });
  }, [projects, showDesktopHover]);

  const crossfadeTo = useCallback(
    (index: number, instant = false) => {
      if (instant) {
        if (mixRaf.current) cancelAnimationFrame(mixRaf.current);
        setPrevIndex(index);
        setDisplayIndex(index);
        setMix(1);
        return;
      }
      if (index === displayIndex) return;
      setPrevIndex(displayIndex);
      setDisplayIndex(index);
      setMix(0);
      if (mixRaf.current) cancelAnimationFrame(mixRaf.current);
      const start = performance.now();
      const duration = 420;
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        setMix(eased);
        if (t < 1) mixRaf.current = requestAnimationFrame(tick);
      };
      mixRaf.current = requestAnimationFrame(tick);
    },
    [displayIndex],
  );

  useEffect(() => {
    return () => {
      if (mixRaf.current) cancelAnimationFrame(mixRaf.current);
    };
  }, []);

  const trackPointer = useCallback(
    (clientX: number, clientY: number, immediate = false) => {
      const pos = clampPreviewPos(clientX, clientY);
      if (immediate) {
        rawX.jump(pos.x);
        rawY.jump(pos.y);
      } else {
        rawX.set(pos.x);
        rawY.set(pos.y);
      }

      const now = performance.now();
      const dt = Math.max(8, now - lastPointer.current.t);
      const dx = clientX - lastPointer.current.x;
      const dy = clientY - lastPointer.current.y;
      const speed = Math.sqrt(dx * dx + dy * dy) / dt;
      // Feed distortion strength (capped)
      velocityRef.current = Math.min(2.6, speed * 18);
      lastPointer.current = { x: clientX, y: clientY, t: now };

      // Mouse in preview UV space (approx — enough for radial warp)
      mouseNormRef.current = {
        x: ((clientX - pos.x) / PREVIEW_W + 0.5) * 0.5 + 0.25,
        y: ((clientY - pos.y) / PREVIEW_H + 0.5) * 0.5 + 0.25,
      };
    },
    [rawX, rawY],
  );

  const onListMove = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (!showDesktopHover) return;
      trackPointer(event.clientX, event.clientY);
    },
    [showDesktopHover, trackPointer],
  );

  const onRowEnter = useCallback(
    (index: number, event: ReactMouseEvent<HTMLButtonElement>) => {
      if (!showDesktopHover) return;
      trackPointer(event.clientX, event.clientY, !previewVisible);
      setHovered(index);
      setPreviewVisible(true);
      crossfadeTo(index, !previewVisible);
      // Burst of distortion on enter
      velocityRef.current = Math.max(velocityRef.current, 1.4);
    },
    [showDesktopHover, trackPointer, previewVisible, crossfadeTo],
  );

  // Decay velocity when idle
  useEffect(() => {
    if (!showDesktopHover) return;
    let id = 0;
    const loop = () => {
      velocityRef.current *= 0.92;
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [showDesktopHover]);

  return (
    <div className={cn("relative", className)}>
      {showDesktopHover ? (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed top-0 left-0 z-40 overflow-hidden rounded-[4px] border border-border-muted bg-[#070b12] shadow-accent"
          style={{
            x,
            y,
            width: PREVIEW_W,
            height: PREVIEW_H,
          }}
          initial={false}
          animate={{
            opacity: previewVisible && active ? 1 : 0,
            scale: previewVisible && active ? 1 : 0.94,
          }}
          transition={{
            opacity: { duration: 0.3, ease: EASE_OUT },
            scale: { type: "spring", stiffness: 240, damping: 22, mass: 0.75 },
          }}
        >
          {fromSrc ? (
            <ProjectDistortionPreview
              src={fromSrc}
              nextSrc={toSrc}
              mix={mix}
              velocityRef={velocityRef}
              mouseRef={mouseNormRef}
              className="absolute inset-0 h-full w-full"
            />
          ) : null}
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#03060b]/70 via-transparent to-[#03060b]/20"
            aria-hidden
          />
          {active ? (
            <p className="absolute right-3 bottom-3 left-3 truncate font-display text-xs font-bold tracking-tight text-text-primary">
              {active.title}
            </p>
          ) : null}
        </motion.div>
      ) : null}

      <div
        data-project-list
        className="relative"
        onMouseMove={showDesktopHover ? onListMove : undefined}
        onMouseLeave={() => {
          setHovered(null);
          setPreviewVisible(false);
          velocityRef.current = 0;
        }}
      >
        <ul className="m-0 list-none divide-y divide-border-muted border-y border-border-muted p-0">
          {projects.map((project, index) => {
            const num = String(index + 1).padStart(2, "0");
            const isHovered = hovered === index;
            const isOpen = expanded === index;
            const isActive = showDesktopHover ? isHovered : isOpen;

            return (
              <li key={project.title} className="relative">
                <button
                  type="button"
                  className={cn(
                    "group flex w-full items-center gap-3 py-4 text-left transition-colors duration-300 sm:gap-5 sm:py-5 md:py-6",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base",
                    isActive ? "bg-surface-raised/40" : "hover:bg-surface-raised/25",
                  )}
                  aria-expanded={!showDesktopHover ? isOpen : undefined}
                  aria-controls={
                    !showDesktopHover ? `project-panel-${index}` : undefined
                  }
                  onMouseEnter={(e) => onRowEnter(index, e)}
                  onClick={() => {
                    if (showDesktopHover) {
                      window.open(project.href, "_blank", "noopener,noreferrer");
                      return;
                    }
                    setExpanded((prev) => (prev === index ? null : index));
                  }}
                  data-cursor="hover"
                >
                  <span
                    className={cn(
                      "w-8 shrink-0 font-mono text-[11px] tracking-[0.18em] transition-colors duration-300 sm:w-10",
                      isActive ? "text-accent-cyan" : "text-text-tertiary",
                    )}
                  >
                    {num}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span
                        className={cn(
                          "font-display text-lg font-bold tracking-tight transition-colors duration-300 sm:text-xl md:text-2xl",
                          isActive ? "text-accent-cyan" : "text-text-primary",
                        )}
                      >
                        {project.title}
                      </span>
                      {typeof project.stars === "number" && showDesktopHover ? (
                        <span className="hidden items-center gap-1 text-[11px] text-text-tertiary sm:inline-flex">
                          <Star size={10} className="text-accent-amber" aria-hidden />
                          {project.stars}
                        </span>
                      ) : null}
                    </div>

                    <ul className="mt-1.5 flex flex-wrap gap-x-2.5 gap-y-1">
                      {project.tags
                        .slice(0, showDesktopHover ? 5 : 3)
                        .map((tag) => (
                          <li
                            key={tag}
                            className="text-[10px] tracking-[0.14em] text-text-tertiary uppercase sm:text-[11px]"
                          >
                            {tag}
                          </li>
                        ))}
                    </ul>
                  </div>

                  <ArrowUpRight
                    size={18}
                    className={cn(
                      "shrink-0 transition-all duration-300",
                      isActive
                        ? "translate-x-0.5 -translate-y-0.5 text-accent-cyan"
                        : "text-text-tertiary group-hover:text-text-secondary",
                    )}
                    aria-hidden
                  />
                </button>

                <AnimatePresence initial={false}>
                  {!showDesktopHover && isOpen ? (
                    <motion.div
                      id={`project-panel-${index}`}
                      initial={reduced ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={reduced ? undefined : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: EASE_OUT }}
                      className="overflow-hidden"
                    >
                      <div className="pb-5 pl-8 sm:pl-9 md:pl-11">
                        <motion.div
                          initial={
                            reduced ? false : { y: 16, opacity: 0, scale: 0.97 }
                          }
                          animate={{ y: 0, opacity: 1, scale: 1 }}
                          transition={{ duration: 0.45, ease: EASE_OUT }}
                          className="relative aspect-[16/10] overflow-hidden border border-border-muted bg-[#070b12]"
                        >
                          <Image
                            src={project.image}
                            alt={project.imageAlt}
                            fill
                            className="object-cover object-top"
                            sizes="(max-width: 768px) 100vw, 700px"
                            quality={88}
                          />
                          <div
                            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#03060b]/50 to-transparent"
                            aria-hidden
                          />
                        </motion.div>
                        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-text-secondary">
                          {project.description}
                        </p>
                        <ProjectMeta project={project} />
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>

      {showDesktopHover ? (
        <p className="mt-4 text-[11px] tracking-[0.14em] text-text-tertiary uppercase">
          Hover a line to preview · click to open
        </p>
      ) : (
        <p className="mt-4 text-[11px] tracking-[0.14em] text-text-tertiary uppercase">
          Tap a project to expand
        </p>
      )}
    </div>
  );
}
