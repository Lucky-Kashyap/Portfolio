import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  uppercase?: boolean;
};

export function Badge({
  className,
  children,
  uppercase = true,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border border-border-muted px-3 py-1 text-xs tracking-wide text-text-muted",
        uppercase && "uppercase",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

type ChipProps = HTMLAttributes<HTMLLIElement> & {
  children: ReactNode;
};

export function Chip({ className, children, ...props }: ChipProps) {
  return (
    <li
      className={cn(
        "rounded-xs border border-border-muted bg-surface-raised px-4 py-2 text-sm text-text-primary",
        className,
      )}
      {...props}
    >
      {children}
    </li>
  );
}

type ChipGroupProps = {
  items: readonly string[];
  className?: string;
};

export function ChipGroup({ items, className }: ChipGroupProps) {
  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {items.map((item) => (
        <Chip key={item}>{item}</Chip>
      ))}
    </ul>
  );
}
