"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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

function markSrc(id: (typeof services)[number]["id"]) {
  if (id === "ui-architecture" || id === "react-next") return "/icons/ui-window.svg";
  if (id === "api") return "/icons/stack-cube.svg";
  return "/icons/grid-mark.svg";
}

function ServiceSlide({
  service,
  index,
}: {
  service: (typeof services)[number];
  index: number;
}) {
  const Icon = serviceIcons[service.id];
  return (
    <article className="flex h-full min-h-[13.5rem] flex-col justify-between bg-surface-raised p-4 sm:min-h-[15rem] sm:p-5 md:p-6">
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

  return (
    <div className="mt-8 lg:mt-10">
      <Container className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-stretch lg:gap-8">
        <ul className="flex h-full list-none flex-col border-y border-border-muted p-0">
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
                  onMouseEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  onClick={() => setActive(index)}
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
                      isActive ? "text-accent-cyan" : "text-text-primary/20",
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
                <p className="sr-only">
                  {service.description} Outcome: {service.outcome}.
                </p>
              </li>
            );
          })}
        </ul>

        <div className="relative flex min-h-[24rem] w-full flex-col overflow-hidden border border-border-muted bg-surface-base p-5 surface-hover transition-[border-color,box-shadow] duration-normal ease-standard hover:border-accent-cyan/70 hover:shadow-[0_0_0_1px_rgba(125,211,252,0.28),0_18px_50px_rgba(3,6,11,0.55)] md:min-h-[26rem] md:p-6">
          <div
            className="pointer-events-none absolute -right-8 -top-8 size-40 rounded-full bg-[radial-gradient(circle,rgba(125,211,252,0.18),transparent_70%)]"
            aria-hidden
          />
          {services.map((service, index) => {
            const isActive = active === index;
            const Icon = serviceIcons[service.id];
            return (
              <article
                key={service.id}
                className={cn(
                  "absolute inset-0 flex flex-col p-5 transition-opacity duration-300 ease-standard md:p-6",
                  isActive
                    ? "z-[1] opacity-100"
                    : "z-0 opacity-0 pointer-events-none",
                )}
                aria-hidden={!isActive}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={markSrc(service.id)}
                  alt=""
                  width={56}
                  height={56}
                  className="absolute top-4 right-4 opacity-70"
                  aria-hidden
                />
                <div className="relative z-[1] flex min-h-0 flex-1 flex-col">
                  <div className="flex items-center gap-3">
                    <Icon size={20} className="text-accent-cyan" aria-hidden />
                    <p className="font-mono text-xs tracking-[0.2em] text-accent-cyan">
                      {String(index + 1).padStart(2, "0")} /{" "}
                      {String(services.length).padStart(2, "0")}
                    </p>
                  </div>
                  <h3 className="mt-4 text-2xl font-bold tracking-tight text-text-primary">
                    {service.title}
                  </h3>
                  <p className="mt-3 max-w-prose text-base leading-relaxed text-text-secondary">
                    {service.description}
                  </p>
                  <div className="mt-auto border-t border-border-muted pt-4">
                    <p className="text-xs font-semibold tracking-[0.16em] text-text-tertiary uppercase">
                      Outcome · {service.outcome}
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-text-tertiary">
                      {about.specialize}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
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
