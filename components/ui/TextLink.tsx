import { cn } from "@/lib/utils";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type LinkVariant = "inline" | "nav" | "navMobile" | "brand" | "muted";

type TextLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: LinkVariant;
  external?: boolean;
  children: ReactNode;
};

const variants: Record<LinkVariant, string> = {
  inline:
    "text-text-primary underline-offset-4 hover:text-action-primary-deep hover:underline",
  nav: "text-sm font-medium tracking-[0.12em] text-text-tertiary uppercase hover:text-text-primary",
  navMobile:
    "block rounded-xs px-4 py-3 text-lg tracking-[0.08em] text-text-primary uppercase hover:bg-surface-raised",
  brand:
    "text-lg font-semibold tracking-[0.14em] text-text-primary uppercase hover:text-text-secondary",
  muted: "text-text-muted hover:text-text-primary",
};

export function TextLink({
  variant = "inline",
  external = false,
  className,
  children,
  ...props
}: TextLinkProps) {
  return (
    <a
      className={cn(variants[variant], className)}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : undefined)}
      {...props}
    >
      {children}
    </a>
  );
}
