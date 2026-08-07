import { ProjectCard } from "@/components/cards/ProjectCard";
import { Grid, Section, SectionHeader } from "@/components/ui";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { projects } from "@/lib/content";

export function Projects() {
  return (
    <Section id="projects" aria-labelledby="projects-heading" reveal={false}>
      <ScrollReveal>
        <SectionHeader
          eyebrow="Projects"
          title="Featured Projects"
          titleId="projects-heading"
          description="Open-source and learning builds — Front-End Domination, React + MySQL, Angular e-commerce, Tailwind Paytm, Shery.js, Vanilla JS apps, Premier UI, and Feliciano restaurant."
        />
      </ScrollReveal>

      <Grid as="ul" cols={2} gap="md" className="section-content items-stretch">
        {projects.map((project, index) => (
          <li key={project.title} className="flex h-full min-h-0 w-full">
            <ProjectCard project={project} index={index} />
          </li>
        ))}
      </Grid>
    </Section>
  );
}
