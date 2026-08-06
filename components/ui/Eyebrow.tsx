import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

type EyebrowProps = HTMLAttributes<HTMLParagraphElement> & {
  children: ReactNode;
};

export function Eyebrow({ className, children, ...props }: EyebrowProps) {
  return (
    <p
      className={cn(
        "mb-3 text-sm font-medium tracking-[0.18em] text-text-muted uppercase",
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
}
