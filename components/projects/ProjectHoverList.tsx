"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { createPortal } from "react-dom";
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

/** Large landscape float — project UIs stay fully readable on hover */
const PREVIEW_W = 480;
const PREVIEW_H = 300;
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

/** Keep preview near the cursor, flipped left when near the right edge */
function clampPreviewPos(clientX: number, clientY: number) {
  const gap = 28;
  const preferRight = clientX + gap + PREVIEW_W < window.innerWidth - 16;
  const x = preferRight ? clientX + gap : clientX - gap - PREVIEW_W;
  // Center vertically on the cursor so the full frame stays on-screen
  const y = clientY - PREVIEW_H * 0.5;
  return {
    x: Math.min(window.innerWidth - PREVIEW_W - 16, Math.max(16, x)),
    y: Math.min(window.innerHeight - PREVIEW_H - 16, Math.max(16, y)),
  };
}

/**
 * Line-by-line project index.
 * Desktop: floating landscape preview (full UI visible + optional WebGL distortion).
 * Touch: tap to expand image + details.
 */
export function ProjectHoverList({ projects, className }: ProjectHoverListProps) {
  const reduced = usePrefersReducedMotion();
  const finePointer = usePointerFine();
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [mix, setMix] = useState(0);
  const [glReady, setGlReady] = useState(false);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 380, damping: 32, mass: 0.45 });
  const y = useSpring(rawY, { stiffness: 380, damping: 32, mass: 0.45 });

  const velocityRef = useRef(0);
  const mouseNormRef = useRef({ x: 0.5, y: 0.5 });
  const lastPointer = useRef({ x: 0, y: 0, t: 0 });
  const mixRaf = useRef<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const active = hovered != null ? projects[hovered] : null;
  const showDesktopHover = finePointer && !reduced;
  const fromSrc = projects[prevIndex]?.image ?? projects[0]?.image ?? "";
  const toSrc = projects[displayIndex]?.image ?? fromSrc;
  // Always prefer the hovered project's cover for the reliable Image layer
  const previewSrc = active?.image ?? toSrc;
  const previewAlt = active?.imageAlt ?? projects[displayIndex]?.imageAlt ?? "";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!showDesktopHover) return;
    projects.forEach((p) => {
      const img = new window.Image();
      img.src = p.image;
    });
  }, [projects, showDesktopHover]);

  useEffect(() => {
    setGlReady(false);
  }, [fromSrc, toSrc]);

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
      const duration = 320;
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
      velocityRef.current = Math.min(2.6, speed * 18);
      lastPointer.current = { x: clientX, y: clientY, t: now };

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
      velocityRef.current = Math.max(velocityRef.current, 1.4);
    },
    [showDesktopHover, trackPointer, previewVisible, crossfadeTo],
  );

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

  const hidePreview = useCallback(() => {
    setHovered(null);
    setPreviewVisible(false);
    velocityRef.current = 0;
  }, []);

  // Wheel/scroll does not fire mouseleave while the cursor stays put — close the
  // fixed portal preview so it cannot stick over later sections (e.g. FAQ).
  useEffect(() => {
    if (!showDesktopHover || !previewVisible) return;

    const onScrollOrWheel = () => hidePreview();
    window.addEventListener("scroll", onScrollOrWheel, {
      capture: true,
      passive: true,
    });
    window.addEventListener("wheel", onScrollOrWheel, { passive: true });
    window.addEventListener("touchmove", onScrollOrWheel, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScrollOrWheel, true);
      window.removeEventListener("wheel", onScrollOrWheel);
      window.removeEventListener("touchmove", onScrollOrWheel);
    };
  }, [showDesktopHover, previewVisible, hidePreview]);

  useEffect(() => {
    if (!showDesktopHover) return;
    const root = listRef.current;
    if (!root) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) hidePreview();
      },
      { threshold: 0.05 },
    );
    io.observe(root);
    return () => io.disconnect();
  }, [showDesktopHover, hidePreview]);

  const preview =
    mounted && showDesktopHover
      ? createPortal(
          <motion.div
            aria-hidden
            className="pointer-events-none fixed z-[80] overflow-hidden rounded-[4px] border border-border-muted bg-[#070b12] shadow-accent"
            style={{
              left: x,
              top: y,
              width: PREVIEW_W,
              height: PREVIEW_H,
              pointerEvents: "none",
            }}
            initial={false}
            animate={{
              opacity: previewVisible && active ? 1 : 0,
              scale: previewVisible && active ? 1 : 0.96,
            }}
            transition={{
              opacity: { duration: 0.2, ease: EASE_OUT },
              scale: { type: "spring", stiffness: 320, damping: 26, mass: 0.55 },
            }}
          >
            <div className="pointer-events-none relative h-full w-full">
              {previewSrc ? (
                <Image
                  src={previewSrc}
                  alt={previewAlt}
                  fill
                  sizes={`${PREVIEW_W}px`}
                  quality={90}
                  className="pointer-events-none object-contain object-center"
                  priority={false}
                />
              ) : null}

              {/* Soft distortion wash — does not hide the full screenshot */}
              {fromSrc ? (
                <ProjectDistortionPreview
                  src={fromSrc}
                  nextSrc={toSrc}
                  mix={mix}
                  velocityRef={velocityRef}
                  mouseRef={mouseNormRef}
                  onReady={() => setGlReady(true)}
                  onError={() => setGlReady(false)}
                  className={cn(
                    "pointer-events-none absolute inset-0 h-full w-full mix-blend-soft-light transition-opacity duration-200",
                    glReady ? "opacity-50" : "opacity-0",
                  )}
                />
              ) : null}

              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#03060b]/85 via-transparent to-transparent"
                aria-hidden
              />
              {active ? (
                <p className="pointer-events-none absolute right-3 bottom-3 left-3 truncate font-display text-xs font-bold tracking-tight text-text-primary drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)]">
                  {active.title}
                </p>
              ) : null}
            </div>
          </motion.div>,
          document.body,
        )
      : null;

  return (
    <div className={cn("relative", className)}>
      {preview}

      <div
        ref={listRef}
        data-project-list
        className="relative"
        onMouseMove={showDesktopHover ? onListMove : undefined}
        onMouseLeave={hidePreview}
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
                    "group flex w-full items-center gap-3 py-3 text-left transition-colors duration-300 sm:gap-4 sm:py-3.5 md:py-4",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base",
                    isActive
                      ? "bg-surface-raised/40"
                      : "hover:bg-surface-raised/25",
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
                          "font-display text-base font-bold tracking-tight transition-colors duration-300 sm:text-lg md:text-xl",
                          isActive ? "text-accent-cyan" : "text-text-primary",
                        )}
                      >
                        {project.title}
                      </span>
                      {typeof project.stars === "number" && showDesktopHover ? (
                        <span className="hidden items-center gap-1 text-[11px] text-text-tertiary sm:inline-flex">
                          <Star
                            size={10}
                            className="text-accent-amber"
                            aria-hidden
                          />
                          {project.stars}
                        </span>
                      ) : null}
                    </div>

                    <ul className="mt-1 flex flex-wrap gap-x-2.5 gap-y-1">
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
                          className="relative aspect-[16/10] overflow-hidden border border-border-muted bg-[#070b12] surface-hover transition-[border-color,box-shadow,transform] duration-normal ease-standard hover:border-accent-cyan/70 hover:shadow-[0_0_0_1px_rgba(125,211,252,0.28),0_18px_50px_rgba(3,6,11,0.55)]"
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
    </div>
  );
}
