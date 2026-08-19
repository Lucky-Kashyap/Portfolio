import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type QuoteProps = {
  children: ReactNode;
  cite?: string;
  className?: string;
};

export function Quote({ children, cite, className }: QuoteProps) {
  return (
    <blockquote
      className={cn(
        "border-l-2 border-action-primary pl-5 text-lg leading-relaxed text-text-secondary",
        className,
      )}
    >
      <p>{children}</p>
      {cite ? (
        <footer className="mt-3 text-sm text-text-muted">— {cite}</footer>
      ) : null}
    </blockquote>
  );
}
