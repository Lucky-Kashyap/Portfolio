import { ProjectCard } from "@/components/cards/ProjectCard";
import { Grid, Section, SectionHeader } from "@/components/ui";
import { projects } from "@/lib/content";

export function Projects() {
  return (
    <Section id="projects" aria-labelledby="projects-heading">
      <SectionHeader
        eyebrow="Projects"
        title="Featured Projects"
        titleId="projects-heading"
        description="Selected work. Live links will be added as you share them."
      />

      <Grid as="ul" cols={3} gap="md" className="mt-10">
        {projects.map((project) => (
          <li key={project.title}>
            <ProjectCard project={project} />
          </li>
        ))}
      </Grid>
    </Section>
  );
}
