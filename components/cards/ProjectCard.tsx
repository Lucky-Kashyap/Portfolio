"use client";

import { useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, GitFork, Star } from "lucide-react";
import { Badge, Card, Heading, Text, TextLink } from "@/components/ui";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import type { Project } from "@/lib/content";
import { usePrefersReducedMotion } from "@/hooks/useMotionPrefs";
import { cn } from "@/lib/utils";

type ProjectCardProps = {
  project: Project;
  index?: number;
};

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const hasLink = Boolean(project.href);
  const reduced = usePrefersReducedMotion();
  const mediaRef = useRef<HTMLDivElement>(null);
  const gallery = project.images?.length ? [...project.images] : [project.image];
  const [active, setActive] = useState(0);
  const cta = project.ctaLabel ?? (hasLink ? "Live Project" : "Link coming soon");
  const activeSrc = gallery[active] ?? project.image;
  const activeAlt =
    project.imageAlts?.[active] ??
    (gallery.length > 1
      ? `${project.imageAlt} — view ${active + 1} of ${gallery.length}`
      : project.imageAlt);

  const onMove = (event: MouseEvent<HTMLDivElement>) => {
    if (reduced || !mediaRef.current || gallery.length > 1) return;
    const rect = mediaRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    mediaRef.current.style.transform = `scale(1.05) translate(${x * 8}px, ${y * 8}px)`;
  };

  const onLeave = () => {
    if (!mediaRef.current) return;
    mediaRef.current.style.transform = "scale(1) translate(0, 0)";
  };

  return (
    <ScrollReveal className="h-full w-full" y={36} x={0} delay={0.05 * (index % 2)}>
      <Card
        variant="interactive"
        className="flex h-full w-full flex-col"
        aria-label={`${project.title} project`}
        data-cursor="hover"
      >
        <div
          className="relative mb-5 shrink-0 overflow-hidden rounded-xs border border-border-muted bg-surface-muted"
          onMouseMove={onMove}
          onMouseLeave={onLeave}
        >
          <div className="relative aspect-[16/10] w-full bg-surface-raised">
            <div
              ref={mediaRef}
              className="absolute inset-0 transition-transform duration-normal will-change-transform"
            >
              <Image
                src={activeSrc}
                alt={activeAlt}
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={90}
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          {gallery.length > 1 ? (
            <div
              className={cn(
                "grid gap-1 border-t border-border-muted bg-surface-base p-1",
                gallery.length <= 4 ? "grid-cols-4" : "grid-cols-3 sm:grid-cols-6",
              )}
            >
              {gallery.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  className={cn(
                    "relative aspect-video overflow-hidden rounded-[2px] border transition-[opacity,border-color] duration-fast",
                    i === active
                      ? "border-accent-cyan opacity-100"
                      : "border-transparent opacity-70 hover:opacity-100",
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
                    quality={75}
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          ) : null}

          {typeof project.stars === "number" ? (
            <div className="absolute top-3 left-3 flex items-center gap-3 rounded-xs border border-border-muted bg-surface-base/85 px-3 py-1.5 text-xs text-text-primary backdrop-blur-sm">
              <span className="inline-flex items-center gap-1">
                <Star size={12} aria-hidden className="text-accent-cyan" />
                {project.stars}
                <span className="sr-only"> stars</span>
              </span>
              {typeof project.forks === "number" ? (
                <span className="inline-flex items-center gap-1 text-text-secondary">
                  <GitFork size={12} aria-hidden />
                  {project.forks}
                  <span className="sr-only"> forks</span>
                </span>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="flex min-h-[2.5rem] flex-wrap content-start gap-2">
          {project.tags.slice(0, 4).map((tag, tagIndex) => (
            <motion.span
              key={tag}
              initial={reduced ? false : { opacity: 0, y: 8 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.04 * tagIndex, duration: 0.3 }}
            >
              <Badge>{tag}</Badge>
            </motion.span>
          ))}
        </div>

        <Heading as={3} size="xl" className="mt-4 line-clamp-2 min-h-[2.6em]">
          {hasLink ? (
            <TextLink
              href={project.href}
              external
              className="text-inherit no-underline hover:underline"
            >
              {project.title}
            </TextLink>
          ) : (
            project.title
          )}
        </Heading>

        <Text tone="muted" className="mt-3 line-clamp-4 flex-1">
          {project.description}
        </Text>

        {hasLink ? (
          <div className="mt-auto flex flex-wrap items-center gap-4 pt-6">
            <TextLink
              href={project.href}
              external
              className="inline-flex items-center gap-2 text-sm font-medium tracking-wide text-text-primary uppercase no-underline hover:underline"
              aria-label={`${project.title} — ${cta} (opens in new tab)`}
            >
              {cta}
              <ArrowUpRight size={16} aria-hidden />
            </TextLink>
            {project.githubHref ? (
              <TextLink
                href={project.githubHref}
                external
                className="inline-flex items-center gap-2 text-sm font-medium tracking-wide text-text-tertiary uppercase no-underline hover:text-text-primary hover:underline"
                aria-label={`${project.title} — View on GitHub (opens in new tab)`}
              >
                GitHub
                <ArrowUpRight size={16} aria-hidden />
              </TextLink>
            ) : null}
          </div>
        ) : (
          <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-medium tracking-wide text-text-primary uppercase">
            {cta}
          </span>
        )}
      </Card>
    </ScrollReveal>
  );
}
