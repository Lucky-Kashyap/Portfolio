"use client";

import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Magnetic } from "@/components/motion/Magnetic";

type Variant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  loading?: boolean;
  fullWidth?: boolean;
  magnetic?: boolean;
  children: ReactNode;
};

const variants: Record<Variant, string> = {
  primary:
    "relative overflow-hidden bg-action-primary text-text-inverse shadow-soft transition-[box-shadow,background] duration-fast hover:bg-action-primary-hover hover:shadow-accent-lg active:scale-[0.98] disabled:bg-surface-raised disabled:text-state-disabled disabled:shadow-none before:pointer-events-none before:absolute before:inset-0 before:translate-x-[-120%] before:bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.28),transparent)] before:transition-transform before:duration-500 hover:before:translate-x-[120%]",
  secondary:
    "border border-border-muted bg-surface-raised text-text-primary shadow-card transition-[border-color,box-shadow] duration-fast hover:border-border-default hover:shadow-soft active:scale-[0.98] disabled:text-state-disabled",
  ghost:
    "bg-transparent text-text-secondary transition-colors duration-fast hover:text-text-primary active:scale-[0.98] disabled:text-state-disabled",
};

export function Button({
  variant = "primary",
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
        "inline-flex min-h-[48px] min-w-[48px] cursor-pointer items-center justify-center gap-2 rounded-xs px-6 text-lg font-medium tracking-wide touch-manipulation",
        variants[variant],
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
    <Magnetic strength={0.3} className="inline-flex">
      {button}
    </Magnetic>
  );
}
