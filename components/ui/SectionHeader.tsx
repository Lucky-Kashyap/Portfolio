"use client";

import { Eyebrow } from "./Eyebrow";
import { Text } from "./Text";
import { ScrollWords } from "@/components/motion/ScrollHeading";
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
      <Eyebrow className="mb-4">{eyebrow}</Eyebrow>
      <ScrollWords
        id={titleId}
        as={2}
        text={title}
        className={cn("mt-2", titleClassName)}
      />
      {description ? (
        <Text tone="muted" className="mt-6 max-w-2xl text-lg leading-relaxed">
          {description}
        </Text>
      ) : null}
    </header>
  );
}
