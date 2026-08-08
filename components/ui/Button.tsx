"use client";

import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Magnetic } from "@/components/motion/Magnetic";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  magnetic?: boolean;
  children: ReactNode;
};

const variants: Record<Variant, string> = {
  primary:
    "relative overflow-hidden border border-transparent bg-action-primary text-text-inverse shadow-soft transition-[box-shadow,background-color,border-color,transform] duration-fast hover:bg-action-primary-hover hover:shadow-accent active:scale-[0.98] disabled:border-border-muted disabled:bg-surface-raised disabled:text-state-disabled disabled:shadow-none before:pointer-events-none before:absolute before:inset-0 before:translate-x-[-120%] before:bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.22),transparent)] before:transition-transform before:duration-500 hover:before:translate-x-[120%]",
  secondary:
    "border border-border-muted bg-surface-raised/80 text-text-primary transition-[border-color,background-color,box-shadow,transform] duration-normal ease-standard hover:border-accent-cyan/70 hover:bg-surface-raised hover:shadow-[0_0_0_1px_rgba(125,211,252,0.22),0_12px_36px_rgba(3,6,11,0.4)] active:scale-[0.98] disabled:text-state-disabled",
  ghost:
    "border border-transparent bg-transparent text-text-secondary transition-[color,background-color,transform] duration-fast hover:bg-surface-raised/50 hover:text-text-primary active:scale-[0.98] disabled:text-state-disabled",
};

/** Explicit px — theme spacing remaps h-10/h-11 to 64/88px */
const sizes: Record<Size, string> = {
  sm: "h-[36px] px-[14px] text-xs tracking-[0.04em]",
  md: "h-[40px] px-4 text-sm tracking-[0.03em]",
  lg: "h-[44px] px-5 text-sm tracking-[0.03em]",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  magnetic = true,
  className,
  children,
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const button = (
    <button
      type={type}
      className={cn(
        "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-sm font-semibold touch-manipulation",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        isDisabled && "cursor-not-allowed opacity-70",
        className,
      )}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <span className="text-state-loading">Working…</span> : children}
    </button>
  );

  if (!magnetic || isDisabled || fullWidth) return button;

  return (
    <Magnetic strength={0.28} className="inline-flex shrink-0">
      {button}
    </Magnetic>
  );
}
