import { cn } from "@/lib/utils";
import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from "react";

type CardVariant = "raised" | "base" | "interactive" | "accent";
type CardPadding = "none" | "sm" | "md" | "lg";

/** Shared raised-surface chrome — use on raw card shells outside `<Card>`. */
export const cardSurfaceClass =
  "border border-border-muted bg-surface-raised shadow-card transition-[border-color,box-shadow] duration-fast hover:border-accent-cyan/40 hover:shadow-soft";

const variantClass: Record<CardVariant, string> = {
  raised: cardSurfaceClass,
  base: "border border-border-muted bg-surface-muted transition-[border-color,box-shadow] duration-fast hover:border-accent-cyan/35 hover:shadow-soft",
  interactive:
    "group/card border border-border-muted bg-surface-raised shadow-card transition-[border-color,transform,box-shadow] duration-normal hover:-translate-y-1 hover:border-accent-cyan/40 hover:shadow-accent",
  accent:
    "border border-border-muted bg-surface-raised shadow-card transition-[border-color,box-shadow,transform] duration-fast hover:-translate-y-0.5 hover:border-accent-cyan/40 hover:shadow-soft",
};

const paddingClass: Record<CardPadding, string> = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-6 md:p-8",
};

type Shared = {
  variant?: CardVariant;
  padding?: CardPadding;
  className?: string;
  children: ReactNode;
};

type DivCardProps = Shared &
  HTMLAttributes<HTMLDivElement> & {
    href?: undefined;
  };

type AnchorCardProps = Shared &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

export type CardProps = DivCardProps | AnchorCardProps;

export function Card({
  variant = "raised",
  padding = "md",
  className,
  children,
  ...props
}: CardProps) {
  const classes = cn(
    "rounded-sm",
    variantClass[variant],
    paddingClass[padding],
    className,
  );

  if ("href" in props && props.href) {
    const { href, ...rest } = props;
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }

  const divProps = props as HTMLAttributes<HTMLDivElement>;
  return (
    <div className={classes} {...divProps}>
      {children}
    </div>
  );
}
