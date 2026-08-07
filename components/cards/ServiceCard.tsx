"use client";

import { motion } from "framer-motion";
import { Card, Heading, Text } from "@/components/ui";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { usePrefersReducedMotion } from "@/hooks/useMotionPrefs";
import { cn } from "@/lib/utils";

type ServiceCardProps = {
  index: number;
  title: string;
  description: string;
};

export function ServiceCard({ index, title, description }: ServiceCardProps) {
  const reduced = usePrefersReducedMotion();

  return (
    <motion.div
      className="h-full w-full"
      whileHover={
        reduced
          ? undefined
          : { y: -6, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }
      }
    >
      <Card
        variant="accent"
        className={cn(
          "group relative flex h-full flex-col overflow-hidden",
          "before:pointer-events-none before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-fast",
          "before:bg-[radial-gradient(circle_at_top_right,color-mix(in_srgb,#7dd3fc_12%,transparent),transparent_55%)]",
          "hover:before:opacity-100",
        )}
        data-cursor="hover"
      >
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xs bg-surface-muted text-sm text-text-muted transition-transform duration-fast group-hover:rotate-6">
          {String(index + 1).padStart(2, "0")}
        </span>
        <Heading as={3} size="xl" className="mt-4 min-h-[2.75rem]">
          {title}
        </Heading>
        <Text tone="muted" className="mt-3 flex-1">
          {description}
        </Text>
      </Card>
    </motion.div>
  );
}

type ServiceCardRevealProps = ServiceCardProps & {
  delay?: number;
};

export function ServiceCardReveal({
  delay = 0,
  ...props
}: ServiceCardRevealProps) {
  const dir = props.index % 2 === 0 ? -24 : 24;
  return (
    <ScrollReveal delay={delay} x={dir} y={36} className="h-full w-full">
      <ServiceCard {...props} />
    </ScrollReveal>
  );
}
