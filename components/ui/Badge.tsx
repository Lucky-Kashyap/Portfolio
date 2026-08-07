"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type ChipSize = "md" | "sm";

const sizeClass: Record<ChipSize, string> = {
  md: "px-4 py-2 text-sm text-text-primary",
  sm: "px-3 py-2 text-xs tracking-wide text-text-secondary",
};

type ChipProps = {
  children: ReactNode;
  className?: string;
  size?: ChipSize;
  index?: number;
  animate?: boolean;
};

function Chip({
  children,
  className,
  size = "md",
  index = 0,
  animate = true,
}: ChipProps) {
  const reduced = useReducedMotion();
  const enableMotion = animate && !reduced;

  return (
    <motion.li
      className={cn(
        "rounded-xs border border-border-muted bg-surface-raised will-change-transform",
        "transition-[border-color,box-shadow,background-color] duration-fast",
        "hover:border-accent-cyan/45 hover:bg-surface-muted hover:shadow-soft",
        "focus-within:border-accent-cyan/45",
        sizeClass[size],
        className,
      )}
      initial={enableMotion ? { opacity: 0, y: 10, scale: 0.94 } : false}
      whileInView={enableMotion ? { opacity: 1, y: 0, scale: 1 } : undefined}
      viewport={{ once: true, amount: 0.4 }}
      transition={{
        duration: 0.38,
        delay: index * 0.045,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={
        enableMotion
          ? { y: -2, scale: 1.03, transition: { duration: 0.18 } }
          : undefined
      }
      whileTap={enableMotion ? { scale: 0.98 } : undefined}
    >
      {children}
    </motion.li>
  );
}

type ChipGroupProps = {
  items: readonly string[];
  className?: string;
  size?: ChipSize;
  /** Disable entrance / hover motion (e.g. inside another animated parent). */
  animate?: boolean;
};

export function ChipGroup({
  items,
  className,
  size = "md",
  animate = true,
}: ChipGroupProps) {
  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {items.map((item, index) => (
        <Chip key={item} size={size} index={index} animate={animate}>
          {item}
        </Chip>
      ))}
    </ul>
  );
}
