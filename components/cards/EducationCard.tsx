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
import { Card, ChipGroup, Eyebrow, Text } from "@/components/ui";
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
              dense ? "size-9" : "size-[40px]",
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
          dense ? "mt-4 space-y-1" : "mt-5 space-y-1",
          columns === 2 && "sm:grid sm:grid-cols-2 sm:gap-x-4 sm:gap-y-1 sm:space-y-0",
        )}
      >
        {items.map((item) => (
          <li key={item}>
            <div
              data-cursor="hover"
              className={cn(
                "group/item flex items-start gap-2.5 rounded-xs px-2 py-1.5",
                "-mx-2 transition-[transform,background-color,color] duration-normal ease-standard",
                "hover:translate-x-1.5 hover:bg-accent-cyan/[0.06]",
              )}
            >
              <span
                className={cn(
                  "mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full",
                  "bg-surface-muted text-text-primary",
                  "transition-[background-color,color,box-shadow,transform] duration-normal ease-standard",
                  "group-hover/item:scale-110 group-hover/item:bg-accent-cyan/15 group-hover/item:text-accent-cyan",
                  "group-hover/item:shadow-[0_0_0_1px_rgba(125,211,252,0.45)]",
                )}
              >
                <Check
                  size={12}
                  strokeWidth={2.5}
                  aria-hidden
                  className="transition-transform duration-normal ease-standard group-hover/item:scale-110"
                />
              </span>
              <Text
                tone="muted"
                size="sm"
                className="leading-snug transition-colors duration-normal ease-standard group-hover/item:text-text-primary"
              >
                {item}
              </Text>
            </div>
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
        <ChipGroup
          items={item.skills}
          size="sm"
          className="mt-6"
        />
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
        <ChipGroup items={skills} size="sm" className="mt-6" />
      ) : null}
    </Card>
  );
}

