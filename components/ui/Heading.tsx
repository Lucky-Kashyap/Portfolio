import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

type Level = 1 | 2 | 3 | 4;

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  as?: Level;
  size?: "display-lg" | "display-md" | "display-sm" | "xl" | "lg";
  children: ReactNode;
};

const sizeClass = {
  "display-lg": "text-display-lg font-semibold leading-tight tracking-tight",
  "display-md": "text-display-md font-semibold leading-tight tracking-tight",
  "display-sm": "text-display-sm font-semibold leading-tight",
  xl: "text-xl font-medium leading-snug",
  lg: "text-lg font-medium leading-snug",
} as const;

export function Heading({
  as = 2,
  size = "display-sm",
  className,
  children,
  ...props
}: HeadingProps) {
  const Tag = `h${as}` as const;

  return (
    <Tag
      className={cn(sizeClass[size], "text-text-primary", className)}
      {...props}
    >
      {children}
    </Tag>
  );
}
