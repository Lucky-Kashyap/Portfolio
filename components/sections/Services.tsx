"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
    <article className="flex h-full min-h-[15rem] flex-col justify-between bg-[#0a0e14] p-5 sm:min-h-[17rem] sm:p-6">
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

export function Services() {
  const [active, setActive] = useState(0);
  const reduced = usePrefersReducedMotion();
  const current = services[active];
  const Icon = current ? serviceIcons[current.id] : Boxes;

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="section-pad scroll-mt-28 overflow-x-clip border-y border-border-muted bg-surface-raised/40 md:scroll-mt-32"
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

      <Container className="mt-8 hidden gap-6 lg:mt-10 lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-8">
        <ul className="flex list-none flex-col border-y border-border-muted p-0">
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

        <div className="relative min-h-[260px]">
          <div className="sticky top-28 overflow-hidden border border-border-muted bg-surface-base p-6 md:p-7">
            <div
              className="pointer-events-none absolute -right-8 -top-8 size-40 rounded-full bg-[radial-gradient(circle,rgba(125,211,252,0.18),transparent_70%)]"
              aria-hidden
            />
            <AnimatePresence mode="wait">
              {current ? (
                <motion.div
                  key={current.id}
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
                  <p className="mt-3 text-base leading-relaxed text-text-secondary">
                    {current.description}
                  </p>
                  <p className="mt-6 border-t border-border-muted pt-4 text-xs font-semibold tracking-[0.16em] text-text-tertiary uppercase">
                    Outcome · {current.outcome}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-text-tertiary">
                    {about.specialize}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </section>
  );
}
