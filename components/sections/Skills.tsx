"use client";

import { Container } from "@/components/ui";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ScrollWords } from "@/components/motion/ScrollHeading";
import { SkillBubbles } from "@/components/motion/SkillBubbles";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { TextGradientScroll } from "@/components/motion/TextGradientScroll";

export function Skills() {
  return (
    <section
      id="skills"
      className="section-pad border-y border-border-muted bg-surface-base"
      aria-labelledby="skills-heading"
    >
      <Container>
        <ScrollReveal>
          <Eyebrow className="text-accent-cyan">Skills</Eyebrow>
        </ScrollReveal>

        <ScrollWords
          id="skills-heading"
          as={2}
          text="Tools I craft with"
          className="mt-2 text-display-md uppercase"
        />

        <TextGradientScroll
          text="Hover the playground — each bubble is a technology I ship with daily."
          className="mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary"
          shadowOpacity={0.2}
          offset={["start 0.95", "start 0.5"]}
        />

        <div className="section-content">
          <SkillBubbles />
        </div>
      </Container>
    </section>
  );
}
