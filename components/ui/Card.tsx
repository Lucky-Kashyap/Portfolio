import { cn } from "@/lib/utils";
import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from "react";

type CardVariant = "raised" | "base" | "interactive" | "accent";
type CardPadding = "none" | "sm" | "md" | "lg";

/** Shared raised-surface chrome — use on raw card shells outside `<Card>`. */
export const cardSurfaceClass =
  "border border-border-muted bg-surface-raised shadow-card transition-[border-color,box-shadow,transform] duration-normal ease-standard hover:border-accent-cyan/70 hover:shadow-[0_0_0_1px_rgba(125,211,252,0.28),0_18px_50px_rgba(3,6,11,0.55)]";

const variantClass: Record<CardVariant, string> = {
  raised: cardSurfaceClass,
  base: "border border-border-muted bg-surface-muted transition-[border-color,box-shadow,transform] duration-normal ease-standard hover:border-accent-cyan/65 hover:shadow-[0_0_0_1px_rgba(125,211,252,0.22),0_12px_36px_rgba(3,6,11,0.4)]",
  interactive:
    "group/card border border-border-muted bg-surface-raised shadow-card transition-[border-color,transform,box-shadow] duration-normal ease-standard hover:-translate-y-1 hover:border-accent-cyan/70 hover:shadow-accent",
  accent:
    "border border-border-muted bg-surface-raised shadow-card transition-[border-color,box-shadow,transform] duration-normal ease-standard hover:-translate-y-0.5 hover:border-accent-cyan/70 hover:shadow-[0_0_0_1px_rgba(125,211,252,0.28),0_18px_50px_rgba(3,6,11,0.55)]",
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
      <a href={href} className={classes} data-cursor="hover" {...rest}>
        {children}
      </a>
    );
  }

  const divProps = props as HTMLAttributes<HTMLDivElement>;
  return (
    <div className={classes} data-cursor="hover" {...divProps}>
      {children}
    </div>
  );
}
