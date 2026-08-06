import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type IconButtonVariant = "ghost" | "raised" | "primary";
type IconButtonSize = "md" | "lg";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  label: string;
  children: ReactNode;
};

const variantClass: Record<IconButtonVariant, string> = {
  ghost:
    "border border-border-muted bg-transparent text-text-primary hover:bg-surface-raised",
  raised:
    "border border-border-muted bg-surface-raised text-text-primary shadow-accent hover:border-border-default",
  primary:
    "bg-action-primary text-text-secondary shadow-accent hover:bg-action-primary-hover hover:shadow-accent-lg",
};

const sizeClass: Record<IconButtonSize, string> = {
  md: "size-11",
  lg: "size-14",
};

export function IconButton({
  variant = "ghost",
  size = "md",
  label,
  className,
  children,
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={cn(
        "inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm touch-manipulation active:scale-[0.98]",
        variantClass[variant],
        sizeClass[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
