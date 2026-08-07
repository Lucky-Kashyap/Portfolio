import type { ReactNode } from "react";
import {
  Check,
  Code2,
  Database,
  Gauge,
  GraduationCap,
  Layers,
  Palette,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { Card, Eyebrow, Text } from "@/components/ui";
import type { ExperienceItem } from "@/lib/content";
import { cn } from "@/lib/utils";

type StackGroupCardProps = {
  title: string;
  items: readonly string[];
};

const stackIcons: Record<string, ReactNode> = {
  Frontend: <Code2 size={16} aria-hidden />,
  "State & Data": <Database size={16} aria-hidden />,
  "Styling & Motion": <Palette size={16} aria-hidden />,
  Quality: <ShieldCheck size={16} aria-hidden />,
  Tools: <Wrench size={16} aria-hidden />,
  "Performance & SEO": <Gauge size={16} aria-hidden />,
};

export function StackGroupCard({ title, items }: StackGroupCardProps) {
  return (
    <Card variant="raised" padding="md" className="h-full">
      <div className="flex items-center gap-3">
        <span className="inline-flex size-9 items-center justify-center rounded-xs bg-surface-muted text-text-primary">
          {stackIcons[title] ?? <Layers size={16} aria-hidden />}
        </span>
        <p className="text-lg font-medium text-text-primary">{title}</p>
      </div>
      <Text tone="muted" size="sm" className="mt-4 leading-relaxed">
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
  icon?: ReactNode;
  /** Compact checklist — tighter spacing for shorter side panels */
  dense?: boolean;
  /** Split checklist into two columns from this breakpoint */
  columns?: 1 | 2;
};

export function InfoListCard({
  eyebrow,
  title,
  items,
  className,
  icon,
  dense = false,
  columns = 1,
}: InfoCardProps) {
  return (
    <Card
      padding={dense ? "md" : "lg"}
      className={className}
    >
      <div className={cn("flex items-start", dense ? "gap-3" : "gap-4")}>
        {icon ? (
          <span
            className={cn(
              "inline-flex shrink-0 items-center justify-center rounded-xs bg-surface-muted text-text-primary",
              dense ? "size-10" : "size-[44px]",
            )}
          >
            {icon}
          </span>
        ) : null}
        <div className="min-w-0">
          <Eyebrow className="mb-0 tracking-[0.14em]">{eyebrow}</Eyebrow>
          <p
            className={cn(
              "font-semibold tracking-tight text-text-primary",
              dense ? "mt-2 text-lg" : "mt-3 text-xl",
            )}
          >
            {title}
          </p>
        </div>
      </div>
      <ul
        className={cn(
          dense ? "mt-4 space-y-2.5" : "mt-5 space-y-2.5",
          columns === 2 && "sm:grid sm:grid-cols-2 sm:gap-x-4 sm:gap-y-2.5 sm:space-y-0",
        )}
      >
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5">
            <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-surface-muted text-text-primary">
              <Check size={12} strokeWidth={2.5} aria-hidden />
            </span>
            <Text tone="muted" size="sm" className="leading-snug">
              {item}
            </Text>
          </li>
        ))}
      </ul>
    </Card>
  );
}

type ExperienceCardProps = {
  item: ExperienceItem;
};

export function ExperienceCard({ item }: ExperienceCardProps) {
  return (
    <Card variant="raised" padding="lg" className="h-full">
      <p className="text-sm tracking-[0.12em] text-text-muted uppercase">
        {item.period} · {item.duration}
      </p>
      <p className="mt-4 text-2xl font-semibold tracking-tight text-text-primary">
        {item.role}
      </p>
      <Text className="mt-3">
        {item.company}
        <span className="text-text-muted"> · {item.employmentType}</span>
      </Text>
      <Text tone="muted" size="sm" className="mt-2">
        {item.location} · {item.workMode}
      </Text>
      {item.skills?.length ? (
        <div className="mt-6 flex flex-wrap gap-2">
          {item.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-xs border border-border-muted bg-surface-muted px-3 py-2 text-xs tracking-wide text-text-secondary"
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
  skills?: readonly string[];
};

export function EducationCard({
  institution,
  degree,
  field,
  period,
  skills,
}: EducationCardProps) {
  return (
    <Card padding="lg">
      <div className="flex items-start gap-4">
        <span className="inline-flex size-[44px] shrink-0 items-center justify-center rounded-xs bg-surface-muted text-text-primary">
          <GraduationCap size={20} aria-hidden />
        </span>
        <div>
          <Eyebrow className="mb-0 tracking-[0.14em]">Education</Eyebrow>
          <p className="mt-3 text-2xl font-semibold tracking-tight text-text-primary">
            {degree}
          </p>
        </div>
      </div>
      <Text className="mt-4">{field}</Text>
      <Text tone="muted" size="sm" className="mt-3">
        {institution}
      </Text>
      <Text tone="muted" size="sm" className="mt-1">
        {period}
      </Text>
      {skills?.length ? (
        <div className="mt-6 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="rounded-xs border border-border-muted bg-surface-muted px-3 py-2 text-xs tracking-wide text-text-secondary"
            >
              {skill}
            </span>
          ))}
        </div>
      ) : null}
    </Card>
  );
}

