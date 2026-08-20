"use client";

import { useEffect, useRef, useState } from "react";
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

function markSrc(id: (typeof services)[number]["id"]) {
  if (id === "ui-architecture" || id === "react-next") return "/icons/ui-window.svg";
  if (id === "api") return "/icons/stack-cube.svg";
  return "/icons/grid-mark.svg";
}

function markAlt(id: (typeof services)[number]["id"], title: string) {
  if (id === "ui-architecture" || id === "react-next") {
    return `${title} — UI window icon`;
  }
  if (id === "api") {
    return `${title} — stack cube icon`;
  }
  return `${title} — grid mark icon`;
}

function indexFromSection(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight || 1;
  const n = services.length;

  if (rect.bottom < vh * 0.1) return n - 1;
  if (rect.top > vh * 0.9) return 0;

  const start = vh * 0.7;
  const end = vh * 0.28;
  const usable = Math.max(1, rect.height + (start - end));
  const p = (start - rect.top) / usable;
  return Math.min(n - 1, Math.max(0, Math.floor(p * n + 1e-6)));
}

function ServicesBoard({ reduced }: { reduced: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const hoveringRef = useRef(false);
  const scrollingRef = useRef(false);
  const rafRef = useRef(0);
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [active, setActive] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  const applyFromScroll = () => {
    const el = rootRef.current;
    if (!el) return;
    const next = indexFromSection(el);
    setActive((prev) => (prev === next ? prev : next));
  };

  const hoverTo = (index: number) => {
    if (scrollingRef.current) return;
    hoveringRef.current = true;
    setActive(index);
  };

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    // Scroll-linked highlight is desktop-only — on mobile it fights touch scroll
    if (!el || reduced || !isDesktop) return;

    const flush = () => {
      rafRef.current = 0;
      if (hoveringRef.current && !scrollingRef.current) return;
      applyFromScroll();
    };

    const schedule = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(flush);
    };

    const onScroll = () => {
      scrollingRef.current = true;
      hoveringRef.current = false;
      schedule();
      if (settleTimer.current) clearTimeout(settleTimer.current);
      settleTimer.current = setTimeout(() => {
        scrollingRef.current = false;
        applyFromScroll();
      }, 90);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    const lenis = window.__lenis;
    lenis?.on("scroll", onScroll);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (settleTimer.current) clearTimeout(settleTimer.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      lenis?.off("scroll", onScroll);
    };
  }, [reduced, isDesktop]);

  // Mobile / tablet: compact accordion — no duplicate 28rem panels
  if (!isDesktop) {
    return (
      <ul className="mt-8 m-0 list-none divide-y divide-border-muted border-y border-border-muted p-0">
        {services.map((service, index) => {
          const isActive = active === index;
          const ItemIcon = serviceIcons[service.id];
          return (
            <li key={service.id}>
              <button
                type="button"
                data-cursor="hover"
                onClick={() => setActive(index)}
                className={cn(
                  "flex w-full items-center gap-3 py-3.5 text-left transition-colors duration-200",
                  isActive ? "text-text-primary" : "text-text-tertiary",
                )}
                aria-expanded={isActive}
              >
                <span
                  className={cn(
                    "w-7 shrink-0 font-mono text-sm tabular-nums",
                    isActive ? "text-text-primary" : "text-text-primary/35",
                  )}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <ItemIcon
                  size={16}
                  aria-hidden
                  className={cn(
                    "shrink-0",
                    isActive ? "text-accent-cyan" : "text-text-tertiary",
                  )}
                />
                <span className="min-w-0 flex-1 text-[0.95rem] font-semibold leading-snug tracking-tight">
                  {service.title}
                </span>
              </button>
              <div
                className={cn(
                  "grid transition-[grid-template-rows] duration-200 ease-standard",
                  isActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
              >
                <div className="overflow-hidden">
                  <div className="pb-4 pl-10 pr-1">
                    <p className="text-sm leading-relaxed text-text-secondary">
                      {service.description}
                    </p>
                    <p className="mt-2 text-[10px] font-semibold tracking-[0.14em] text-accent-cyan uppercase">
                      Outcome · {service.outcome}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <div
      ref={rootRef}
      className="mt-10 grid gap-6 lg:mt-12 lg:grid-cols-2 lg:items-stretch lg:gap-10"
    >
      <ul
        className="m-0 grid min-h-[28rem] list-none grid-rows-6 border-y border-border-muted p-0 lg:min-h-[32rem]"
        onMouseLeave={() => {
          hoveringRef.current = false;
          if (!scrollingRef.current) applyFromScroll();
        }}
      >
        {services.map((service, index) => {
          const isActive = active === index;
          const ItemIcon = serviceIcons[service.id];
          return (
            <li
              key={service.id}
              className="min-h-0 border-b border-border-muted last:border-b-0"
            >
              <button
                type="button"
                data-cursor="hover"
                onMouseEnter={() => hoverTo(index)}
                onFocus={() => hoverTo(index)}
                onClick={() => hoverTo(index)}
                className={cn(
                  "flex h-full w-full items-center gap-3 px-0 text-left transition-colors duration-200",
                  isActive
                    ? "text-text-primary"
                    : "text-text-tertiary hover:text-text-secondary",
                )}
                aria-current={isActive ? "true" : undefined}
              >
                <span
                  className={cn(
                    "w-7 shrink-0 font-mono text-sm tabular-nums",
                    isActive ? "text-text-primary" : "text-text-primary/35",
                  )}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <ItemIcon
                  size={16}
                  aria-hidden
                  className={cn(
                    "shrink-0",
                    isActive ? "text-accent-cyan" : "text-text-tertiary",
                  )}
                />
                <span className="min-w-0 flex-1 text-[0.95rem] font-semibold leading-snug tracking-tight md:text-lg">
                  {service.title}
                </span>
                <span
                  className={cn(
                    "hidden max-w-[11rem] shrink-0 text-right text-[10px] tracking-[0.14em] uppercase lg:inline",
                    isActive ? "text-accent-cyan" : "text-text-tertiary",
                  )}
                >
                  {service.outcome}
                </span>
              </button>
              <p className="sr-only">
                {service.description} Outcome: {service.outcome}.
              </p>
            </li>
          );
        })}
      </ul>

      <div className="relative min-h-[28rem] overflow-hidden border border-border-muted bg-surface-base lg:min-h-[32rem]">
        <div
          className="pointer-events-none absolute -right-8 -top-8 size-40 rounded-full bg-[radial-gradient(circle,rgba(125,211,252,0.16),transparent_70%)]"
          aria-hidden
        />
        {services.map((service, index) => {
          const isActive = active === index;
          const Icon = serviceIcons[service.id];
          return (
            <article
              key={service.id}
              className={cn(
                "absolute inset-0 flex flex-col p-5 transition-opacity duration-200 ease-standard sm:p-6 lg:p-7",
                isActive
                  ? "z-[1] opacity-100"
                  : "pointer-events-none z-0 opacity-0",
              )}
              aria-hidden={!isActive}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={markSrc(service.id)}
                alt={markAlt(service.id, service.title)}
                title={markAlt(service.id, service.title)}
                width={48}
                height={48}
                className="absolute top-5 right-5 opacity-70"
              />
              <div className="flex items-center gap-2.5">
                <Icon size={18} className="text-accent-cyan" aria-hidden />
                <p className="font-mono text-xs tracking-[0.2em] text-accent-cyan">
                  {String(index + 1).padStart(2, "0")} /{" "}
                  {String(services.length).padStart(2, "0")}
                </p>
              </div>
              <h3 className="mt-5 text-2xl font-bold tracking-tight text-text-primary">
                {service.title}
              </h3>
              <p className="mt-3 max-w-prose text-base leading-relaxed text-text-secondary">
                {service.description}
              </p>
              <div className="mt-auto border-t border-border-muted pt-4">
                <p className="text-xs font-semibold tracking-[0.16em] text-accent-cyan uppercase">
                  Outcome · {service.outcome}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-text-tertiary">
                  {about.specialize}
                </p>
              </div>
            </article>
          );
        })}
      </div>
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
        <div className="grid items-end gap-3 lg:grid-cols-2 lg:gap-10">
          <div>
            <Eyebrow className="mb-2">Services</Eyebrow>
            <Heading
              id="services-heading"
              as={2}
              size="display-sm"
              className="max-w-lg text-[clamp(1.35rem,5.5vw,2.5rem)]"
            >
              How I help teams ship
            </Heading>
          </div>
          <Text
            tone="muted"
            className="max-w-md text-sm leading-relaxed sm:text-base lg:max-w-none lg:justify-self-end lg:text-right"
          >
            {about.impact}
          </Text>
        </div>

        <ServicesBoard reduced={reduced} />
      </Container>
    </section>
  );
}
