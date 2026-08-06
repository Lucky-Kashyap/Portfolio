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
    "border border-border-muted bg-transparent text-text-primary transition-[transform,background,border-color] duration-fast hover:-translate-y-0.5 hover:bg-surface-raised hover:border-accent-cyan/40",
  raised:
    "border border-border-muted bg-surface-raised text-text-primary shadow-card transition-[transform,border-color,box-shadow] duration-fast hover:-translate-y-0.5 hover:border-border-default hover:shadow-soft",
  primary:
    "bg-action-primary text-text-inverse shadow-soft transition-[transform,background,box-shadow] duration-fast hover:-translate-y-0.5 hover:bg-action-primary-hover hover:shadow-accent-lg",
};

const sizeClass: Record<IconButtonSize, string> = {
  md: "size-[44px] min-h-[44px] min-w-[44px]",
  lg: "size-[56px] min-h-[56px] min-w-[56px]",
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
        "inline-flex items-center justify-center rounded-xs touch-manipulation active:scale-[0.98]",
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
