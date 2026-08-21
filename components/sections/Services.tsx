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
import { registerGsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/useMotionPrefs";

const serviceIcons: Record<(typeof services)[number]["id"], LucideIcon> = {
  "react-next": Boxes,
  "ui-architecture": Sparkles,
  api: Cable,
  performance: Gauge,
  motion: Activity,
  seo: Search,
};

const SERVICE_COUNT = services.length;
/** Viewport height per service while the board is pinned */
const STEP_VH = 55;

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

function ServicesAccordion() {
  const [active, setActive] = useState(0);

  return (
    <ul className="mt-8 m-0 list-none divide-y divide-border-muted border-y border-border-muted p-0 lg:hidden">
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
                "flex w-full items-center gap-3 py-3 text-left transition-colors duration-200",
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
            {isActive ? (
              <div className="pb-3.5 pl-10 pr-1">
                <p className="text-sm leading-relaxed text-text-secondary">
                  {service.description}
                </p>
                <p className="mt-2 text-[10px] font-semibold tracking-[0.14em] text-accent-cyan uppercase">
                  Outcome · {service.outcome}
                </p>
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

function ServicesBoard({ reduced }: { reduced: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);

  const setActiveSafe = (index: number) => {
    const next = Math.min(SERVICE_COUNT - 1, Math.max(0, index));
    if (activeRef.current === next) return;
    activeRef.current = next;
    setActive(next);
  };

  useEffect(() => {
    if (reduced) return;
    registerGsap();

    const track = trackRef.current;
    if (!track) return;

    const st = ScrollTrigger.create({
      trigger: track,
      start: "top top+=96",
      end: "bottom bottom",
      scrub: false,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const progress = Math.min(0.999, Math.max(0, self.progress));
        setActiveSafe(Math.floor(progress * SERVICE_COUNT));
      },
      onRefresh: (self) => {
        const progress = Math.min(0.999, Math.max(0, self.progress));
        setActiveSafe(Math.floor(progress * SERVICE_COUNT));
      },
    });

    const refreshId = window.requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      window.cancelAnimationFrame(refreshId);
      st.kill();
    };
  }, [reduced]);

  const service = services[active] ?? services[0];
  const Icon = serviceIcons[service.id];

  return (
    <div
      ref={trackRef}
      className="relative mt-10 hidden lg:mt-12 lg:block"
      style={
        reduced ? undefined : { height: `${SERVICE_COUNT * STEP_VH}vh` }
      }
    >
      <div className={cn("w-full", reduced ? "relative" : "sticky top-24")}>
        <div className="grid grid-cols-2 items-stretch border border-border-muted">
          {/* Left list — drives row height */}
          <ul className="m-0 flex h-full list-none flex-col divide-y divide-border-muted border-r border-border-muted p-0">
            {services.map((item, index) => {
              const isActive = active === index;
              const ItemIcon = serviceIcons[item.id];
              return (
                <li key={item.id} className="flex flex-1">
                  <button
                    type="button"
                    data-cursor="hover"
                    onClick={() => setActiveSafe(index)}
                    className={cn(
                      "relative flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors duration-200",
                      isActive
                        ? "bg-surface-muted/60 text-text-primary"
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
                    <span className="min-w-0 flex-1 text-[0.95rem] font-semibold leading-snug tracking-tight xl:text-lg">
                      {item.title}
                    </span>
                    <span
                      className={cn(
                        "hidden max-w-[10.5rem] shrink-0 text-right text-[10px] tracking-[0.14em] uppercase xl:inline",
                        isActive ? "text-accent-cyan" : "text-text-tertiary",
                      )}
                    >
                      {item.outcome}
                    </span>
                    {isActive ? (
                      <span
                        className="absolute top-1/2 right-0 size-2.5 translate-x-1/2 -translate-y-1/2 rounded-full border border-accent-cyan bg-text-primary shadow-[0_0_0_3px_color-mix(in_srgb,var(--theme-accent-cyan)_25%,transparent)]"
                        aria-hidden
                      />
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Right detail — same grid row = same height as left */}
          <article className="relative flex h-full min-h-full flex-col bg-surface-base p-5 sm:p-6 lg:p-7">
            <div
              className="pointer-events-none absolute -right-8 -top-8 size-36 rounded-full bg-[radial-gradient(circle,rgba(125,211,252,0.14),transparent_70%)]"
              aria-hidden
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={markSrc(service.id)}
              alt={markAlt(service.id, service.title)}
              title={markAlt(service.id, service.title)}
              width={40}
              height={40}
              className="absolute top-5 right-5 opacity-70"
            />
            <div className="flex items-center gap-2.5">
              <Icon size={18} className="text-accent-cyan" aria-hidden />
              <p className="font-mono text-xs tracking-[0.2em] text-accent-cyan">
                {String(active + 1).padStart(2, "0")} /{" "}
                {String(SERVICE_COUNT).padStart(2, "0")}
              </p>
            </div>
            <h3 className="mt-4 text-xl font-bold tracking-tight text-text-primary md:text-2xl">
              {service.title}
            </h3>
            <p className="mt-2.5 max-w-prose text-[0.95rem] leading-relaxed text-text-secondary md:text-base">
              {service.description}
            </p>
            <div className="mt-auto border-t border-border-muted pt-3.5">
              <p className="text-xs font-semibold tracking-[0.16em] text-accent-cyan uppercase">
                Outcome · {service.outcome}
              </p>
            </div>
          </article>
        </div>

        {!reduced ? (
          <p className="mt-3 font-mono text-[10px] tracking-[0.14em] text-text-tertiary uppercase">
            {String(active + 1).padStart(2, "0")} /{" "}
            {String(SERVICE_COUNT).padStart(2, "0")} · scroll to browse
          </p>
        ) : null}
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

        <ServicesAccordion />
        <ServicesBoard reduced={reduced} />
      </Container>
    </section>
  );
}
