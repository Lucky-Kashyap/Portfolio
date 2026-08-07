"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import {
  Activity,
  Boxes,
  Cable,
  Gauge,
  Search,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Container, Eyebrow, Heading, Text } from "@/components/ui";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { SnapRail } from "@/components/motion/SnapRail";
import { about, services } from "@/lib/content";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/useMotionPrefs";

const serviceIcons: Record<(typeof services)[number]["id"], LucideIcon> = {
  "react-next": Boxes,
  "ui-architecture": Sparkles,
  api: Cable,
  performance: Gauge,
  motion: Activity,
  seo: Search,
};

function ServiceSlide({
  service,
  index,
}: {
  service: (typeof services)[number];
  index: number;
}) {
  const Icon = serviceIcons[service.id];
  return (
    <article className="flex h-full min-h-[13.5rem] flex-col justify-between bg-[#0a0e14] p-4 sm:min-h-[15rem] sm:p-5 md:p-6">
      <div>
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-sm text-accent-cyan">
            {String(index + 1).padStart(2, "0")}
          </span>
          <Icon size={18} className="text-accent-cyan" aria-hidden />
        </div>
        <h3 className="mt-4 text-lg font-bold tracking-tight text-text-primary sm:text-xl">
          {service.title}
        </h3>
        <p className="mt-2.5 text-sm leading-relaxed text-text-secondary">
          {service.description}
        </p>
      </div>
      <p className="mt-5 text-[10px] font-semibold tracking-[0.16em] text-text-tertiary uppercase">
        Outcome · {service.outcome}
      </p>
    </article>
  );
}

function DesktopServices({ reduced }: { reduced: boolean }) {
  const [active, setActive] = useState(0);
  const interactLock = useRef(false);
  const unlockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const current = services[active];
  const Icon = current ? serviceIcons[current.id] : Boxes;

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  const lockInteraction = () => {
    interactLock.current = true;
    if (unlockTimer.current) clearTimeout(unlockTimer.current);
  };

  const releaseInteraction = () => {
    if (unlockTimer.current) clearTimeout(unlockTimer.current);
    unlockTimer.current = setTimeout(() => {
      interactLock.current = false;
    }, 900);
  };

  const selectService = (index: number) => {
    lockInteraction();
    setActive(index);
  };

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (reduced || interactLock.current) return;
    const n = services.length;
    const next = Math.min(n - 1, Math.max(0, Math.floor(progress * n)));
    setActive((prev) => (prev === next ? prev : next));
  });

  useEffect(() => {
    return () => {
      if (unlockTimer.current) clearTimeout(unlockTimer.current);
    };
  }, []);

  const stickyBlock = (
    <Container className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-stretch lg:gap-8">
      <ul
        className="flex h-full list-none flex-col border-y border-border-muted p-0"
        onMouseLeave={releaseInteraction}
      >
        {services.map((service, index) => {
          const isActive = active === index;
          const ItemIcon = serviceIcons[service.id];
          return (
            <li
              key={service.id}
              className="border-b border-border-muted last:border-b-0"
            >
              <motion.button
                type="button"
                data-cursor="hover"
                onMouseEnter={() => selectService(index)}
                onFocus={() => selectService(index)}
                onClick={() => selectService(index)}
                whileHover={reduced ? undefined : { x: 6 }}
                transition={{ type: "spring", stiffness: 320, damping: 24 }}
                className={cn(
                  "flex w-full items-center gap-3 px-1 py-4 text-left transition-colors duration-300",
                  isActive
                    ? "text-text-primary"
                    : "text-text-tertiary hover:text-text-secondary",
                )}
                aria-current={isActive ? "true" : undefined}
              >
                <span
                  className={cn(
                    "font-mono text-sm tabular-nums transition-colors duration-300",
                    isActive ? "text-accent-cyan" : "text-white/20",
                  )}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <ItemIcon
                  size={18}
                  aria-hidden
                  className={cn(
                    "shrink-0 transition-colors duration-300",
                    isActive ? "text-accent-cyan" : "text-text-tertiary",
                  )}
                />
                <span className="min-w-0 flex-1 text-lg font-semibold tracking-tight md:text-xl">
                  {service.title}
                </span>
                <span
                  className={cn(
                    "hidden text-[11px] tracking-[0.14em] uppercase transition-colors duration-300 xl:inline",
                    isActive ? "text-accent-cyan" : "text-text-tertiary",
                  )}
                >
                  {service.outcome}
                </span>
              </motion.button>
            </li>
          );
        })}
      </ul>

      <div className="relative flex min-h-0 h-full">
        <div className="relative flex h-full w-full flex-col overflow-hidden border border-border-muted bg-surface-base p-5 transition-[border-color,box-shadow] duration-fast hover:border-accent-cyan/40 hover:shadow-soft md:p-6">
          <div
            className="pointer-events-none absolute -right-8 -top-8 size-40 rounded-full bg-[radial-gradient(circle,rgba(125,211,252,0.18),transparent_70%)]"
            aria-hidden
          />
          {/* Decorative SVG mark */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              current?.id === "ui-architecture" || current?.id === "react-next"
                ? "/icons/ui-window.svg"
                : current?.id === "api"
                  ? "/icons/stack-cube.svg"
                  : "/icons/grid-mark.svg"
            }
            alt=""
            width={56}
            height={56}
            className="absolute top-4 right-4 opacity-70"
            aria-hidden
          />
          <div className="relative z-[1] flex min-h-0 flex-1 flex-col">
            <AnimatePresence mode="wait">
              {current ? (
                <motion.div
                  key={current.id}
                  className="flex min-h-0 flex-1 flex-col"
                  initial={
                    reduced
                      ? false
                      : { opacity: 0, y: 14, filter: "blur(6px)" }
                  }
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={
                    reduced
                      ? undefined
                      : { opacity: 0, y: -10, filter: "blur(4px)" }
                  }
                  transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} className="text-accent-cyan" aria-hidden />
                    <p className="font-mono text-xs tracking-[0.2em] text-accent-cyan">
                      {String(active + 1).padStart(2, "0")} /{" "}
                      {String(services.length).padStart(2, "0")}
                    </p>
                  </div>
                  <h3 className="mt-4 text-2xl font-bold tracking-tight text-text-primary">
                    {current.title}
                  </h3>
                  <p className="mt-3 max-w-prose text-base leading-relaxed text-text-secondary">
                    {current.description}
                  </p>
                  <div className="mt-auto border-t border-border-muted pt-4">
                    <p className="text-xs font-semibold tracking-[0.16em] text-text-tertiary uppercase">
                      Outcome · {current.outcome}
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-text-tertiary">
                      {about.specialize}
                    </p>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Container>
  );

  if (reduced) {
    return <div className="mt-8 lg:mt-10">{stickyBlock}</div>;
  }

  return (
    <div
      ref={trackRef}
      className="relative mt-8 lg:mt-10"
      style={{ height: `${Math.max(services.length, 2) * 72}vh` }}
    >
      <div className="sticky top-28 md:top-32">{stickyBlock}</div>
    </div>
  );
}

export function Services() {
  const reduced = usePrefersReducedMotion();

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="section-pad scroll-mt-28 border-y border-border-muted bg-surface-raised/40 md:scroll-mt-32"
    >
      <Container>
        <div className="grid items-end gap-3 sm:gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-8">
          <ScrollReveal>
            <Eyebrow className="mb-2">Services</Eyebrow>
            <Heading
              id="services-heading"
              as={2}
              size="display-sm"
              className="max-w-lg text-[clamp(1.35rem,5.5vw,2.5rem)]"
            >
              How I help teams ship
            </Heading>
          </ScrollReveal>
          <ScrollReveal delay={0.05}>
            <Text
              tone="muted"
              className="max-w-md text-sm leading-relaxed sm:text-base lg:justify-self-end lg:text-right"
            >
              {about.impact}
            </Text>
          </ScrollReveal>
        </div>
      </Container>

      <div className="section-content lg:hidden">
        <SnapRail count={services.length} label="Services">
          {services.map((service, index) => (
            <ServiceSlide key={service.id} service={service} index={index} />
          ))}
        </SnapRail>
      </div>

      <div className="hidden lg:block">
        <DesktopServices reduced={reduced} />
      </div>
    </section>
  );
}
