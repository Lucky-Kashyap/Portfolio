import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

type EyebrowProps = HTMLAttributes<HTMLParagraphElement> & {
  children: ReactNode;
};

export function Eyebrow({ className, children, ...props }: EyebrowProps) {
  return (
    <p
      className={cn(
        "group/eyebrow mb-[0.75rem] inline-flex items-center gap-3 text-sm font-medium tracking-[0.18em] text-text-muted uppercase",
        className,
      )}
      {...props}
    >
      <span
        className="inline-block h-px w-6 origin-left bg-accent-cyan transition-transform duration-normal group-hover/eyebrow:scale-x-150"
        aria-hidden
      />
      <span className="transition-colors duration-fast group-hover/eyebrow:text-accent-cyan">
        {children}
      </span>
    </p>
  );
}
