import { cn } from "@/lib/utils";
import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from "react";

type CardVariant = "raised" | "base" | "interactive" | "accent";
type CardPadding = "none" | "sm" | "md" | "lg";

const variantClass: Record<CardVariant, string> = {
  raised: "border border-border-muted bg-surface-raised",
  base: "border border-border-muted bg-surface-base",
  interactive:
    "border border-border-muted bg-surface-raised transition-[border-color,transform,box-shadow] duration-fast hover:-translate-y-0.5 hover:border-border-default hover:shadow-accent",
  accent:
    "border border-border-muted bg-surface-base transition-[border-color,box-shadow] duration-fast hover:border-action-primary/50 hover:shadow-accent",
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
    "rounded-lg",
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
