"use client";

import { usePrefersReducedMotion } from "@/hooks/useMotionPrefs";
import { scrollToId } from "@/lib/scroll";
import { cn } from "@/lib/utils";

type NavItem = {
  id: string;
  label: string;
};

type NavLinksProps = {
  items: readonly NavItem[];
  variant?: "nav" | "navMobile";
  onNavigate?: () => void;
  activeId?: string;
};

function NavLabel({ label, reduced }: { label: string; reduced: boolean }) {
  if (reduced) return <span>{label}</span>;

  return (
    <span className="inline-flex" aria-hidden>
      {label.split("").map((char, i) => (
        <span
          key={`${char}-${i}`}
          className="nav-char inline-block"
          style={{ ["--i" as string]: i }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}

export function NavLinks({
  items,
  variant = "nav",
  onNavigate,
  activeId,
}: NavLinksProps) {
  const reduced = usePrefersReducedMotion();
  const isMobile = variant === "navMobile";

  return (
    <ul
      className={
        isMobile
          ? "flex flex-col gap-1"
          : "flex flex-nowrap items-center justify-center gap-x-0.5"
      }
    >
      {items.map((item, index) => {
        const active = activeId === item.id;
        const num = String(index + 1).padStart(2, "0");

        return (
          <li
            key={item.id}
            style={
              isMobile && !reduced
                ? { transitionDelay: `${index * 45}ms` }
                : undefined
            }
          >
            <a
              href={`#${item.id}`}
              data-cursor="hover"
              aria-current={active ? "true" : undefined}
              className={cn(
                "nav-link group relative inline-flex items-center overflow-hidden",
                isMobile
                  ? "w-full gap-4 rounded-xs px-4 py-3.5 text-lg tracking-[0.08em] text-text-primary uppercase"
                  : "gap-1 rounded-full px-2 py-1.5 text-[11px] font-medium tracking-[0.1em] text-text-tertiary uppercase whitespace-nowrap",
                active && !isMobile && "text-text-primary",
                active && isMobile && "bg-surface-raised text-text-primary",
                !isMobile && "hover:text-text-primary",
                isMobile && "hover:bg-surface-raised/80",
              )}
              onClick={(event) => {
                event.preventDefault();
                scrollToId(item.id);
                onNavigate?.();
              }}
            >
              <span
                className={cn(
                  "font-mono text-[9px] tracking-normal text-accent-cyan transition-[opacity,transform,color] duration-fast",
                  isMobile
                    ? "opacity-70"
                    : "hidden",
                )}
                aria-hidden
              >
                {num}
              </span>

              <span className="relative z-10">
                <span className="sr-only">{item.label}</span>
                <NavLabel label={item.label} reduced={reduced} />
              </span>

              {/* Desktop: draw underline */}
              {!isMobile ? (
                <span
                  className={cn(
                    "pointer-events-none absolute inset-x-2 bottom-0.5 h-px origin-left bg-accent-cyan transition-transform duration-normal ease-standard",
                    active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                  )}
                  aria-hidden
                />
              ) : null}

              {/* Desktop: soft fill sweep */}
              {!isMobile ? (
                <span
                  className="pointer-events-none absolute inset-0 -z-0 origin-left scale-x-0 bg-[linear-gradient(90deg,color-mix(in_srgb,#7dd3fc_14%,transparent),transparent_80%)] transition-transform duration-normal ease-standard group-hover:scale-x-100"
                  aria-hidden
                />
              ) : null}

              {/* Mobile: left accent bar */}
              {isMobile ? (
                <span
                  className={cn(
                    "pointer-events-none absolute top-2 bottom-2 left-0 w-0.5 origin-top scale-y-0 rounded-full bg-accent-cyan transition-transform duration-normal ease-standard group-hover:scale-y-100",
                    active && "scale-y-100",
                  )}
                  aria-hidden
                />
              ) : null}

              {/* Mobile: arrow slides in */}
              {isMobile ? (
                <span
                  className="ml-auto translate-x-2 text-accent-cyan opacity-0 transition-[transform,opacity] duration-fast group-hover:translate-x-0 group-hover:opacity-100"
                  aria-hidden
                >
                  →
                </span>
              ) : null}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
