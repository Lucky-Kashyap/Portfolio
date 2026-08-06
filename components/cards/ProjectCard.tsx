import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Badge, Card, Heading, Text } from "@/components/ui";
import type { Project } from "@/lib/content";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const hasLink = Boolean(project.href);

  const content = (
    <>
      <div className="relative mb-6 aspect-[16/10] overflow-hidden rounded-xs border border-border-muted bg-surface-muted shadow-card">
        <Image
          src={project.image}
          alt={`${project.title} project preview`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>
      <Heading as={3} size="xl" className="mt-4">
        {project.title}
      </Heading>
      <Text tone="muted" className="mt-3 flex-1">
        {project.description}
      </Text>
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium tracking-wide text-text-primary uppercase">
        {hasLink ? (
          <>
            Live Project
            <ArrowUpRight size={16} aria-hidden />
          </>
        ) : (
          "Link coming soon"
        )}
      </span>
    </>
  );

  if (hasLink) {
    return (
      <Card
        href={project.href}
        variant="interactive"
        className="flex h-full flex-col"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${project.title} — Live Project (opens in new tab)`}
      >
        {content}
      </Card>
    );
  }

  return (
    <Card
      variant="interactive"
      className="flex h-full flex-col"
      aria-label={`${project.title} project preview`}
    >
      {content}
    </Card>
  );
}
