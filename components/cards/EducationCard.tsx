import { Card, Eyebrow, Text, Stack } from "@/components/ui";
import type { ExperienceItem } from "@/lib/content";

type StackGroupCardProps = {
  title: string;
  items: readonly string[];
};

export function StackGroupCard({ title, items }: StackGroupCardProps) {
  return (
    <Card variant="raised" padding="sm">
      <p className="text-sm font-medium text-text-secondary">{title}</p>
      <Text tone="muted" size="sm" className="mt-2">
        {items.join(" · ")}
      </Text>
    </Card>
  );
}

type InfoCardProps = {
  eyebrow: string;
  title: string;
  items: readonly string[];
  className?: string;
};

export function InfoListCard({
  eyebrow,
  title,
  items,
  className,
}: InfoCardProps) {
  return (
    <Card className={className ?? "mt-8"}>
      <Eyebrow className="mb-0 tracking-[0.14em]">{eyebrow}</Eyebrow>
      <p className="mt-4 text-xl font-medium text-text-secondary">{title}</p>
      <Stack gap="sm" className="mt-4">
        {items.map((item) => (
          <Text key={item} tone="muted" size="sm">
            · {item}
          </Text>
        ))}
      </Stack>
    </Card>
  );
}

type ExperienceCardProps = {
  item: ExperienceItem;
};

export function ExperienceCard({ item }: ExperienceCardProps) {
  return (
    <Card variant="raised" className="h-full">
      <p className="text-sm tracking-[0.12em] text-text-muted uppercase">
        {item.period} · {item.duration}
      </p>
      <p className="mt-3 text-xl font-medium text-text-secondary">{item.role}</p>
      <Text className="mt-2">
        {item.company}
        <span className="text-text-muted"> · {item.employmentType}</span>
      </Text>
      <Text tone="muted" size="sm" className="mt-2">
        {item.location} · {item.workMode}
      </Text>
      {item.skills?.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {item.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-sm border border-border-muted px-3 py-1 text-xs tracking-wide text-text-muted"
            >
              {skill}
            </span>
          ))}
        </div>
      ) : null}
    </Card>
  );
}

type EducationCardProps = {
  institution: string;
  degree: string;
  field: string;
  period: string;
};

export function EducationCard({
  institution,
  degree,
  field,
  period,
}: EducationCardProps) {
  return (
    <Card>
      <Eyebrow className="mb-0 tracking-[0.14em]">Education</Eyebrow>
      <p className="mt-4 text-xl font-medium text-text-secondary">{degree}</p>
      <Text className="mt-2">{field}</Text>
      <Text tone="muted" size="sm" className="mt-3">
        {institution}
      </Text>
      <Text tone="muted" size="sm" className="mt-1">
        {period}
      </Text>
    </Card>
  );
}
