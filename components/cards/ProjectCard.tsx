"use client";

import { useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import { ArrowUpRight, GitFork, Star } from "lucide-react";
import { TextLink } from "@/components/ui";
import type { Project } from "@/lib/content";
import { usePrefersReducedMotion } from "@/hooks/useMotionPrefs";
import { cn } from "@/lib/utils";

type ProjectCardProps = {
  project: Project;
  index?: number;
  featured?: boolean;
  /** Compact panel for horizontal snap rails */
  rail?: boolean;
};

/**
 * Editorial project panel — image plane + overlay type.
 * Used in snap rails (mobile) and mosaic (desktop).
 */
export function ProjectCard({
  project,
  index = 0,
  featured = false,
  rail = false,
}: ProjectCardProps) {
  const hasLink = Boolean(project.href);
  const reduced = usePrefersReducedMotion();
  const mediaRef = useRef<HTMLDivElement>(null);
  const gallery = project.images?.length ? [...project.images] : [project.image];
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const cta = project.ctaLabel ?? (hasLink ? "Open" : "Soon");
  const activeSrc = gallery[active] ?? project.image;
  const activeAlt =
    project.imageAlts?.[active] ??
    (gallery.length > 1
      ? `${project.imageAlt} — view ${active + 1} of ${gallery.length}`
      : project.imageAlt);
  const indexLabel = String(index + 1).padStart(2, "0");

  const onMove = (event: MouseEvent<HTMLDivElement>) => {
    if (reduced || rail || !mediaRef.current || gallery.length > 1) return;
    const rect = mediaRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    mediaRef.current.style.transform = `scale(1.08) translate(${x * 12}px, ${y * 12}px)`;
  };

  const onLeave = () => {
    if (!mediaRef.current) return;
    mediaRef.current.style.transform = "scale(1) translate(0, 0)";
    setHovered(false);
  };

  return (
    <article
      className={cn(
        "group relative flex h-full min-h-0 w-full flex-col overflow-hidden",
        "bg-[#0a0e14] outline-none",
        "transition-[transform,box-shadow] duration-normal will-change-transform",
        !rail && "hover:shadow-[0_0_0_1px_rgba(125,211,252,0.28)]",
        rail && "min-h-[22rem] sm:min-h-[24rem]",
      )}
      aria-label={`${project.title} project`}
      data-cursor="hover"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onLeave}
    >
      <div
        className={cn(
          "relative shrink-0 overflow-hidden",
          rail
            ? "aspect-[4/5] min-h-[18rem]"
            : featured
              ? "aspect-[16/11] md:aspect-[16/9]"
              : "aspect-[16/11]",
        )}
        onMouseMove={onMove}
      >
        <div
          ref={mediaRef}
          className="absolute inset-0 transition-transform duration-500 ease-out will-change-transform"
        >
          <Image
            src={activeSrc}
            alt={activeAlt}
            fill
            className="object-cover object-top"
            sizes={
              rail
                ? "(max-width: 640px) 86vw, 420px"
                : featured
                  ? "(max-width: 768px) 100vw, 66vw"
                  : "(max-width: 768px) 100vw, 50vw"
            }
            quality={rail ? 75 : 88}
            loading="lazy"
            decoding="async"
          />
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent"
        />
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(125,211,252,0.16),transparent_55%)] transition-opacity duration-normal",
            hovered || rail ? "opacity-100" : "opacity-40",
          )}
        />

        <div className="absolute top-3 left-3 z-10 flex items-center gap-2 sm:top-4 sm:left-4">
          <span className="font-mono text-[10px] tracking-[0.2em] text-accent-cyan sm:text-xs">
            {indexLabel}
          </span>
          {typeof project.stars === "number" ? (
            <span className="inline-flex items-center gap-1 text-[10px] text-text-secondary sm:text-[11px]">
              <Star size={10} className="text-accent-cyan" aria-hidden />
              {project.stars}
              {typeof project.forks === "number" ? (
                <>
                  <GitFork size={10} aria-hidden className="ml-1" />
                  {project.forks}
                </>
              ) : null}
            </span>
          ) : null}
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 p-3 sm:p-4 md:p-5">
          <ul className="mb-2 flex flex-wrap gap-x-2 gap-y-1 sm:mb-3 sm:gap-x-3">
            {project.tags.slice(0, rail ? 3 : 4).map((tag) => (
              <li
                key={tag}
                className="text-[9px] font-medium tracking-[0.14em] text-text-tertiary uppercase sm:text-[10px]"
              >
                {tag}
              </li>
            ))}
          </ul>

          <h3
            className={cn(
              "font-bold tracking-tight text-text-primary",
              rail
                ? "text-base leading-snug sm:text-lg"
                : featured
                  ? "text-xl md:text-2xl lg:text-3xl"
                  : "text-lg md:text-xl",
            )}
          >
            {hasLink ? (
              <TextLink
                href={project.href}
                external
                className="text-inherit no-underline hover:text-accent-cyan"
              >
                {project.title}
              </TextLink>
            ) : (
              project.title
            )}
          </h3>

          <p
            className={cn(
              "mt-1.5 text-xs leading-relaxed text-text-secondary sm:mt-2 sm:text-sm",
              rail ? "line-clamp-2" : hovered ? "line-clamp-4" : "line-clamp-2",
            )}
          >
            {project.description}
          </p>

          {hasLink ? (
            <div className="mt-2.5 flex flex-wrap items-center gap-3 sm:mt-3 sm:gap-4">
              <TextLink
                href={project.href}
                external
                className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-[0.14em] text-accent-cyan uppercase no-underline sm:text-xs"
                aria-label={`${project.title} — ${cta}`}
              >
                {cta}
                <ArrowUpRight size={12} aria-hidden />
              </TextLink>
              {project.githubHref && !rail ? (
                <TextLink
                  href={project.githubHref}
                  external
                  className="text-[10px] font-semibold tracking-[0.14em] text-text-tertiary uppercase no-underline hover:text-text-primary sm:text-xs"
                >
                  GitHub
                </TextLink>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      {!rail && gallery.length > 1 ? (
        <div
          className={cn(
            "grid gap-px border-t border-border-muted bg-border-muted",
            gallery.length <= 4 ? "grid-cols-4" : "grid-cols-3 sm:grid-cols-6",
          )}
        >
          {gallery.map((src, i) => (
            <button
              key={src}
              type="button"
              className={cn(
                "relative aspect-video overflow-hidden bg-surface-base transition-opacity duration-fast",
                i === active ? "opacity-100" : "opacity-55 hover:opacity-90",
              )}
              aria-label={`Show ${project.title} screenshot ${i + 1}`}
              aria-pressed={i === active}
              onClick={() => setActive(i)}
            >
              <Image
                src={src}
                alt=""
                fill
                className="object-cover object-top"
                sizes="80px"
                quality={70}
                loading="lazy"
              />
              {i === active ? (
                <span
                  className="absolute inset-x-0 bottom-0 h-0.5 bg-accent-cyan"
                  aria-hidden
                />
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </article>
  );
}
