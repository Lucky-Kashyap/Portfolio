"use client";

import { ProjectCard } from "@/components/cards/ProjectCard";
import { Container, Eyebrow, Heading, Text } from "@/components/ui";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { SnapRail } from "@/components/motion/SnapRail";
import { about, projects } from "@/lib/content";
import { cn } from "@/lib/utils";

export function Projects() {
  const [featured, ...rest] = projects;
  const orphanLast = rest.length % 2 === 1;

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="cv-auto section-pad scroll-mt-28 overflow-x-clip md:scroll-mt-32"
    >
      <Container>
        <ScrollReveal>
          <Eyebrow className="mb-3">Projects</Eyebrow>
          <Heading id="projects-heading" as={2} size="display-sm">
            Selected work
          </Heading>
          <Text tone="muted" className="mt-3 max-w-xl text-sm leading-relaxed sm:text-base">
            {about.impact}
          </Text>
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

      <Container className="section-content hidden lg:block">
        <div className="space-y-4 md:space-y-5">
          {featured ? (
            <ScrollReveal y={28}>
              <ProjectCard project={featured} index={0} featured />
            </ScrollReveal>
          ) : null}
          <ul className="grid list-none gap-4 p-0 sm:grid-cols-2 md:gap-5">
            {rest.map((project, i) => {
              const isLast = i === rest.length - 1;
              return (
                <li
                  key={project.title}
                  className={cn(
                    "min-h-0",
                    // Avoid empty half-row when odd count
                    isLast && orphanLast && "sm:col-span-2 sm:mx-auto sm:w-full sm:max-w-[calc(50%-0.625rem)]",
                  )}
                >
                  <ScrollReveal delay={0.04 * (i % 4)} y={24}>
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
