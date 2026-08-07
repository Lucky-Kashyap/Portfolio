"use client";

import dynamic from "next/dynamic";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { Container, Eyebrow, Heading, Text } from "@/components/ui";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { SnapRail } from "@/components/motion/SnapRail";
import { about, projects } from "@/lib/content";
import { cn } from "@/lib/utils";

const ProjectsWebGL = dynamic(
  () =>
    import("@/components/three/ProjectsWebGL").then((m) => m.ProjectsWebGL),
  { ssr: false, loading: () => null },
);

export function Projects() {
  const [featured, ...rest] = projects;
  const orphanLast = rest.length % 2 === 1;

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="section-pad relative scroll-mt-28 overflow-x-clip bg-atmosphere md:scroll-mt-32"
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

      <Container>
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
      </Container>

      <div className="section-content lg:hidden">
        <SnapRail count={projects.length} label="Project gallery">
          {projects.map((project, index) => (
            <div key={project.title} className="h-full">
              <ProjectCard project={project} index={index} rail />
            </div>
          ))}
        </SnapRail>
      </div>

      <Container className="section-content relative z-10 hidden lg:block">
        <div className="space-y-5 md:space-y-6">
          {featured ? (
            <ScrollReveal y={32}>
              <ProjectCard project={featured} index={0} featured />
            </ScrollReveal>
          ) : null}
          <ul className="grid list-none gap-5 p-0 sm:grid-cols-2 md:gap-6">
            {rest.map((project, i) => {
              const isLast = i === rest.length - 1;
              return (
                <li
                  key={project.title}
                  className={cn(
                    "min-h-0",
                    isLast &&
                      orphanLast &&
                      "sm:col-span-2 sm:mx-auto sm:w-full sm:max-w-[calc(50%-0.75rem)]",
                  )}
                >
                  <ScrollReveal delay={0.04 * (i % 4)} y={28}>
                    <ProjectCard project={project} index={i + 1} />
                  </ScrollReveal>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </section>
  );
}
