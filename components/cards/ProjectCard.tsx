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
 * Editorial project panel — image plane + readable overlay.
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
    mediaRef.current.style.transform = `scale(1.06) translate(${x * 10}px, ${y * 10}px)`;
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
        "rounded-md border border-border-muted bg-surface-raised shadow-card",
        "outline-none transition-[transform,box-shadow,border-color] duration-normal",
        !rail &&
          "hover:-translate-y-0.5 hover:border-accent-cyan/35 hover:shadow-accent",
        rail && "min-h-[22rem] sm:min-h-[24rem]",
        featured && "border-accent-cyan/25 shadow-accent",
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
              ? "aspect-[16/10] md:aspect-[16/8.5]"
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
                  ? "(max-width: 768px) 100vw, 80vw"
                  : "(max-width: 768px) 100vw, 50vw"
            }
            quality={rail ? 75 : 88}
            loading="lazy"
            decoding="async"
          />
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#03060b] via-[#03060b]/70 to-[#03060b]/10"
        />
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_25%_15%,rgba(125,211,252,0.22),transparent_55%)] transition-opacity duration-normal",
            hovered || rail || featured ? "opacity-100" : "opacity-50",
          )}
        />

        <div className="absolute top-3 left-3 z-10 flex items-center gap-2 sm:top-4 sm:left-4">
          <span className="rounded-xs bg-surface-base/70 px-2 py-1 font-mono text-[10px] tracking-[0.2em] text-accent-cyan backdrop-blur-sm sm:text-xs">
            {indexLabel}
          </span>
          {typeof project.stars === "number" ? (
            <span className="inline-flex items-center gap-1 rounded-xs bg-surface-base/60 px-2 py-1 text-[10px] text-text-secondary backdrop-blur-sm sm:text-[11px]">
              <Star size={10} className="text-accent-amber" aria-hidden />
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

        <div className="absolute inset-x-0 bottom-0 z-10 p-3.5 sm:p-5 md:p-6">
          <ul className="mb-2.5 flex flex-wrap gap-x-2.5 gap-y-1 sm:mb-3">
            {project.tags.slice(0, rail ? 3 : 5).map((tag) => (
              <li
                key={tag}
                className="text-[10px] font-semibold tracking-[0.16em] text-accent-mist uppercase sm:text-[11px]"
              >
                {tag}
              </li>
            ))}
          </ul>

          <h3
            className={cn(
              "font-display font-bold tracking-tight text-text-primary",
              rail
                ? "text-lg leading-snug sm:text-xl"
                : featured
                  ? "text-2xl md:text-3xl lg:text-[2.15rem]"
                  : "text-xl md:text-2xl",
            )}
          >
            {hasLink ? (
              <TextLink
                href={project.href}
                external
                className="text-inherit no-underline transition-colors hover:text-accent-cyan"
              >
                {project.title}
              </TextLink>
            ) : (
              project.title
            )}
          </h3>

          <p
            className={cn(
              "mt-2 text-sm leading-relaxed text-text-secondary",
              rail
                ? "line-clamp-2 text-xs sm:text-sm"
                : hovered || featured
                  ? "line-clamp-3 md:line-clamp-4"
                  : "line-clamp-2",
            )}
          >
            {project.description}
          </p>

          {hasLink ? (
            <div className="mt-3.5 flex flex-wrap items-center gap-3 sm:mt-4 sm:gap-4">
              <TextLink
                href={project.href}
                external
                className="inline-flex items-center gap-1.5 rounded-xs border border-accent-cyan/35 bg-accent-cyan/10 px-3 py-1.5 text-[11px] font-semibold tracking-[0.14em] text-accent-cyan uppercase no-underline transition-colors hover:bg-accent-cyan/20 sm:text-xs"
                aria-label={`${project.title} — ${cta}`}
              >
                {cta}
                <ArrowUpRight size={13} aria-hidden />
              </TextLink>
              {project.githubHref && !rail ? (
                <TextLink
                  href={project.githubHref}
                  external
                  className="text-[11px] font-semibold tracking-[0.14em] text-text-tertiary uppercase no-underline hover:text-text-primary sm:text-xs"
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
