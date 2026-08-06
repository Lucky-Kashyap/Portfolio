import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  loading?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
};

const variants: Record<Variant, string> = {
  primary:
    "bg-action-primary text-text-inverse shadow-soft hover:bg-action-primary-hover hover:shadow-accent-lg active:scale-[0.98] disabled:bg-surface-raised disabled:text-state-disabled disabled:shadow-none",
  secondary:
    "border border-border-muted bg-surface-raised text-text-primary shadow-card hover:border-border-default hover:shadow-soft active:scale-[0.98] disabled:text-state-disabled",
  ghost:
    "bg-transparent text-text-secondary hover:text-text-primary active:scale-[0.98] disabled:text-state-disabled",
};

export function Button({
  variant = "primary",
  loading = false,
  fullWidth = false,
  className,
  children,
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      className={cn(
        "inline-flex min-h-12 min-w-12 cursor-pointer items-center justify-center gap-2 rounded-xs px-6 text-lg font-medium tracking-wide touch-manipulation",
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
}
