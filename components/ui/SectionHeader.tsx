import { Eyebrow } from "./Eyebrow";
import { Heading } from "./Heading";
import { Text } from "./Text";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  titleId: string;
  description?: ReactNode;
  className?: string;
  titleClassName?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  titleId,
  description,
  className,
  titleClassName,
}: SectionHeaderProps) {
  return (
    <header className={cn(className)}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <Heading id={titleId} as={2} size="display-sm" className={titleClassName}>
        {title}
      </Heading>
      {description ? (
        <Text tone="muted" className="mt-4 max-w-xl">
          {description}
        </Text>
      ) : null}
    </header>
  );
}
