"use client";

import {
  Award,
  Briefcase,
  Code2,
  FolderKanban,
  HelpCircle,
  Layers,
  Mail,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { Magnetic } from "@/components/motion/Magnetic";
import { scrollToId } from "@/lib/scroll";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/useMotionPrefs";

const NAV_ICONS: Record<string, LucideIcon> = {
  about: UserRound,
  experience: Briefcase,
  skills: Code2,
  certifications: Award,
  services: Layers,
  projects: FolderKanban,
  faq: HelpCircle,
  contact: Mail,
};

type NavItem = {
  id: string;
  label: string;
};

type IconNavLinksProps = {
  items: readonly NavItem[];
  activeId?: string;
  onNavigate?: () => void;
  className?: string;
};

export function IconNavLinks({
  items,
  activeId,
  onNavigate,
  className,
}: IconNavLinksProps) {
  const reduced = usePrefersReducedMotion();

  return (
    <ul
      className={cn("flex flex-nowrap items-center justify-center gap-1", className)}
      aria-label="Primary"
    >
      {items.map((item) => {
        const Icon = NAV_ICONS[item.id] ?? Layers;
        const active = activeId === item.id;

        const link = (
          <a
            href={`#${item.id}`}
            data-cursor="hover"
            aria-current={active ? "true" : undefined}
            aria-label={item.label}
            title={item.label}
            className={cn(
              "group relative inline-flex size-8 items-center justify-center rounded-full transition-[background,color,transform] duration-fast",
              active
                ? "bg-accent-cyan/15 text-accent-cyan"
                : "text-text-tertiary hover:bg-white/5 hover:text-text-primary",
            )}
            onClick={(event) => {
              event.preventDefault();
              scrollToId(item.id);
              onNavigate?.();
            }}
          >
            <Icon size={16} strokeWidth={1.75} aria-hidden />
            <span className="pointer-events-none absolute top-[calc(100%+10px)] left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-xs border border-border-muted bg-surface-base px-2 py-1 text-[10px] font-medium tracking-[0.14em] text-text-secondary uppercase opacity-0 shadow-soft transition-opacity duration-fast group-hover:opacity-100 group-focus-visible:opacity-100">
              {item.label}
            </span>
          </a>
        );

        return (
          <li key={item.id}>
            {reduced ? link : <Magnetic strength={0.35}>{link}</Magnetic>}
          </li>
        );
      })}
    </ul>
  );
}
