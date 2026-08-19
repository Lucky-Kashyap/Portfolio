"use client";

import { Container } from "@/components/ui";
import { TextGradientScroll } from "@/components/motion/TextGradientScroll";
import { about, site } from "@/lib/content";

/**
 * Philosophy band — scroll-scrubbed word opacity (tight vertical space).
 */
export function Manifesto() {
  return (
    <section
      className="relative overflow-hidden border-y border-border-muted bg-surface-base py-[clamp(3rem,7vw,5.5rem)]"
      aria-label="Design philosophy"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_70%_at_50%_50%,color-mix(in_srgb,#7dd3fc_8%,transparent),transparent_70%)]"
        aria-hidden
      />
      <Container className="relative z-10">
        <p className="mb-5 text-xs font-medium tracking-[0.22em] text-accent-cyan uppercase md:mb-6">
          Philosophy
        </p>
        <TextGradientScroll
          as="h2"
          text={about.narrative}
          className="max-w-4xl text-[clamp(1.35rem,3.2vw,2.35rem)] font-bold leading-snug tracking-tight text-text-primary"
          shadowOpacity={0.14}
          offset={["start 0.92", "end 0.45"]}
        />
        <TextGradientScroll
          text={`${about.impact} ${about.passion}`}
          className="mt-6 max-w-3xl text-base leading-relaxed text-text-secondary md:mt-8 md:text-lg"
          shadowOpacity={0.16}
          offset={["start 0.98", "end 0.5"]}
        />
        <p className="mt-5 max-w-2xl text-sm leading-relaxed tracking-wide text-text-tertiary md:mt-6">
          {site.connect}
        </p>
      </Container>
    </section>
  );
}
