import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

type GridProps = HTMLAttributes<HTMLElement> & {
  as?: "div" | "ul";
  cols?: 1 | 2 | 3;
  gap?: "sm" | "md" | "lg";
  children: ReactNode;
};

const colsClass = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
} as const;

const gapClass = {
  sm: "gap-[1.5rem] md:gap-[2rem]",
  md: "gap-[1.75rem] md:gap-[2.5rem]",
  lg: "gap-[2.5rem] md:gap-[3.5rem]",
} as const;

export function Grid({
  as: Tag = "div",
  cols = 3,
  gap = "md",
  className,
  children,
  ...props
}: GridProps) {
  return (
    <Tag className={cn("grid", colsClass[cols], gapClass[gap], className)} {...props}>
      {children}
    </Tag>
  );
}

type StackProps = HTMLAttributes<HTMLDivElement> & {
  gap?: "sm" | "md" | "lg";
  children: ReactNode;
};

export function Stack({
  gap = "md",
  className,
  children,
  ...props
}: StackProps) {
  return (
    <div
      className={cn(
        "flex flex-col",
        gap === "sm" && "gap-5",
        gap === "md" && "gap-8",
        gap === "lg" && "gap-10",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
