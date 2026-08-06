import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

type TextProps = HTMLAttributes<HTMLParagraphElement> & {
  tone?: "primary" | "muted" | "secondary";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
};

const toneClass = {
  primary: "text-text-primary",
  muted: "text-text-muted",
  secondary: "text-text-secondary",
} as const;

const sizeClass = {
  sm: "text-sm leading-relaxed",
  md: "text-md leading-relaxed",
  lg: "text-lg leading-relaxed",
} as const;

export function Text({
  tone = "primary",
  size = "md",
  className,
  children,
  ...props
}: TextProps) {
  return (
    <p className={cn(toneClass[tone], sizeClass[size], className)} {...props}>
      {children}
    </p>
  );
}
