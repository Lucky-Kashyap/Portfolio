"use client";

import dynamic from "next/dynamic";
import { Container, Eyebrow, Heading, Text } from "@/components/ui";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { ProjectHoverList } from "@/components/projects/ProjectHoverList";
import { about, projects } from "@/lib/content";

const ProjectsWebGL = dynamic(
  () =>
    import("@/components/three/ProjectsWebGL").then((m) => m.ProjectsWebGL),
  { ssr: false, loading: () => null },
);

export function Projects() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="relative scroll-mt-28 overflow-x-clip bg-atmosphere py-10 md:scroll-mt-32 md:py-14 lg:py-16"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-cyan/40 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-8 right-0 hidden h-[280px] w-[280px] opacity-40 xl:block"
        aria-hidden
      >
        <ProjectsWebGL className="h-full w-full" />
      </div>

      <Container className="relative z-10">
        <ScrollReveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow className="mb-3">Projects</Eyebrow>
              <Heading
                id="projects-heading"
                as={2}
                size="display-sm"
                className="font-display"
              >
                Selected work
              </Heading>
              <Text
                tone="muted"
                className="mt-3 max-w-xl text-sm leading-relaxed text-text-secondary sm:text-base"
              >
                {about.impact}
              </Text>
            </div>
            <p className="font-mono text-xs tracking-[0.18em] text-accent-cyan uppercase">
              {String(projects.length).padStart(2, "0")} builds
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-6 md:mt-8">
          <ProjectHoverList projects={projects} />
        </div>
      </Container>
    </section>
  );
}
