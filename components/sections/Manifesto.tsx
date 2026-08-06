"use client";

import { Container } from "@/components/ui";
import { TextGradientScroll } from "@/components/motion/TextGradientScroll";
import { site } from "@/lib/content";

/**
 * Sticky-feel manifesto band — scroll opacity reveal for the portfolio thesis.
 */
export function Manifesto() {
  return (
    <section
      className="relative overflow-hidden border-y border-border-muted bg-surface-base py-[clamp(4.5rem,10vw,8rem)]"
      aria-label="Design philosophy"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_70%_at_50%_50%,color-mix(in_srgb,#7dd3fc_8%,transparent),transparent_70%)]"
        aria-hidden
      />
      <Container className="relative z-10">
        <p className="mb-8 text-xs font-medium tracking-[0.22em] text-accent-cyan uppercase">
          Philosophy
        </p>
        <TextGradientScroll
          as="h2"
          text={site.summary}
          className="max-w-4xl text-display-sm font-bold tracking-tight text-text-primary md:text-display-md"
          shadowOpacity={0.12}
          offset={["start 0.85", "start 0.2"]}
        />
        <TextGradientScroll
          text={site.connect}
          className="mt-10 max-w-3xl text-lg leading-relaxed text-text-secondary md:text-xl"
          shadowOpacity={0.16}
          offset={["start 0.95", "start 0.45"]}
        />
      </Container>
    </section>
  );
}
