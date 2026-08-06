import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";
import { Container } from "./Container";

type SectionProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  containerClassName?: string;
  bordered?: boolean;
  atmosphere?: boolean;
  muted?: boolean;
};

export function Section({
  id,
  className,
  containerClassName,
  bordered = false,
  atmosphere = false,
  muted = false,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "section-pad",
        bordered && "border-y border-border-muted",
        atmosphere && "bg-atmosphere",
        muted && "bg-surface-raised/40",
        className,
      )}
      {...props}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
