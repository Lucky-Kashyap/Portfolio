"use client";

import { Container } from "@/components/ui";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ScrollWords } from "@/components/motion/ScrollHeading";
import { SkillBubbles } from "@/components/motion/SkillBubbles";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { TextGradientScroll } from "@/components/motion/TextGradientScroll";
import { skillBubbles } from "@/lib/skills";

export function Skills() {
  return (
    <section
      id="skills"
      className="section-pad border-y border-border-muted bg-surface-base"
      aria-labelledby="skills-heading"
    >
      <Container className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/icons/grid-mark.svg"
          alt="Skills section grid decorative mark"
          title="Skills section grid decorative mark"
          width={96}
          height={96}
          className="pointer-events-none absolute -top-2 right-4 hidden opacity-40 sm:block md:right-8"
        />
        <ScrollReveal>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <Eyebrow className="mb-0 text-accent-cyan">Skills</Eyebrow>
            <p className="font-mono text-[11px] tracking-[0.16em] text-accent-cyan uppercase">
              {String(skillBubbles.length).padStart(2, "0")} technologies
            </p>
          </div>
        </ScrollReveal>

        <ScrollWords
          id="skills-heading"
          as={2}
          text="Tools I craft with"
          className="mt-2 text-display-md uppercase"
        />

        <TextGradientScroll
          text="A living playground of the technologies I ship with every day — scroll in, then move your cursor to scatter them."
          className="mt-4 max-w-2xl text-base leading-relaxed text-text-secondary max-md:hidden sm:mt-5 sm:text-lg"
          shadowOpacity={0.2}
          offset={["start 0.9", "start 0.55"]}
        />
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-text-secondary md:hidden">
          Technologies I ship with every day — tap through the stack below.
        </p>

        <div className="section-content">
          <SkillBubbles />
        </div>
      </Container>
    </section>
  );
}
