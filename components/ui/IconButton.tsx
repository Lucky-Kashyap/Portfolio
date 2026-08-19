"use client";

import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Magnetic } from "@/components/motion/Magnetic";

type IconButtonVariant = "ghost" | "raised" | "primary";
type IconButtonSize = "md" | "lg";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  label: string;
  magnetic?: boolean;
  children: ReactNode;
};

const variantClass: Record<IconButtonVariant, string> = {
  ghost:
    "border border-border-muted bg-transparent text-text-primary transition-[background,border-color,box-shadow] duration-normal ease-standard hover:bg-surface-raised hover:border-accent-cyan/70 hover:shadow-[0_0_0_1px_rgba(125,211,252,0.2)]",
  raised:
    "border border-border-muted bg-surface-raised text-text-primary shadow-card transition-[border-color,box-shadow] duration-normal ease-standard hover:border-accent-cyan/70 hover:shadow-[0_0_0_1px_rgba(125,211,252,0.22),0_12px_36px_rgba(3,6,11,0.4)]",
  primary:
    "bg-action-primary text-text-inverse shadow-soft transition-[background,box-shadow] duration-fast hover:bg-action-primary-hover hover:shadow-accent-lg",
};

const sizeClass: Record<IconButtonSize, string> = {
  md: "size-[44px] min-h-[44px] min-w-[44px]",
  lg: "size-[56px] min-h-[56px] min-w-[56px]",
};

export function IconButton({
  variant = "ghost",
  size = "md",
  label,
  magnetic = true,
  className,
  children,
  type = "button",
  disabled,
  ...props
}: IconButtonProps) {
  const button = (
    <button
      type={type}
      aria-label={label}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center rounded-full touch-manipulation active:scale-[0.98]",
        variantClass[variant],
        sizeClass[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );

  if (!magnetic || disabled) return button;

  return (
    <Magnetic strength={0.45} className="inline-flex">
      {button}
    </Magnetic>
  );
}
