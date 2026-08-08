"use client";

import type { ReactNode } from "react";
import { Magnetic } from "@/components/motion/Magnetic";
import { site } from "@/lib/content";
import { cn } from "@/lib/utils";

function GitHubIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.39.6.11.82-.26.82-.58 0-.28-.01-1.03-.02-2.02-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .11-.78.42-1.3.76-1.6-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.62-5.48 5.92.43.37.81 1.1.81 2.22 0 1.6-.01 2.89-.01 3.29 0 .32.22.7.82.58A12.01 12.01 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.8 0 0 .77 0 1.73v20.54C0 23.23.8 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

function LeetCodeIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.357-.195-1.824-.662l-4.332-4.363c-.467-.467-.702-1.15-.702-1.823s.235-1.357.702-1.824l4.319-4.38c.467-.467 1.111-.662 1.824-.662s1.357.195 1.823.662l2.697 2.606c.514.515 1.365.497 1.9-.038.535-.536.553-1.387.039-1.901l-2.609-2.636a5.055 5.055 0 0 0-2.445-1.337l2.467-2.503c.516-.514.498-1.366-.037-1.901-.535-.535-1.387-.552-1.902-.038l-10.1 10.101c-.853.853-1.28 1.99-1.28 3.146 0 1.157.426 2.294 1.28 3.146l4.332 4.363c.853.854 1.99 1.28 3.146 1.28 1.157 0 2.294-.426 3.146-1.28l2.609-2.637c.514-.514.496-1.365-.039-1.9s-1.386-.553-1.899-.039zM20.811 13.01H10.33c-.706 0-1.28.572-1.28 1.279s.574 1.278 1.28 1.278h10.48c.707 0 1.28-.572 1.28-1.278s-.573-1.28-1.28-1.28z" />
    </svg>
  );
}

function MailIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function PhoneIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

type SocialItem = {
  href: string;
  label: string;
  icon: (props: { size?: number }) => ReactNode;
  external?: boolean;
};

const DEFAULT_SOCIALS: SocialItem[] = [
  { href: site.github, label: "GitHub", icon: GitHubIcon, external: true },
  { href: site.linkedin, label: "LinkedIn", icon: LinkedInIcon, external: true },
  { href: site.leetcode, label: "LeetCode", icon: LeetCodeIcon, external: true },
  { href: `mailto:${site.email}`, label: "Email", icon: MailIcon },
];

/** Sticky header / contact strip — mail, call, GitHub, LinkedIn, LeetCode */
export const HEADER_SOCIALS: SocialItem[] = [
  { href: `mailto:${site.email}`, label: "Email", icon: MailIcon },
  {
    href: `tel:${site.phone.replace(/\s/g, "")}`,
    label: "Call",
    icon: PhoneIcon,
  },
  { href: site.github, label: "GitHub", icon: GitHubIcon, external: true },
  { href: site.linkedin, label: "LinkedIn", icon: LinkedInIcon, external: true },
  { href: site.leetcode, label: "LeetCode", icon: LeetCodeIcon, external: true },
];

type SocialMagneticIconsProps = {
  className?: string;
  size?: "sm" | "md" | "lg" | "header";
  /** Attribute for GSAP entrance targeting (hero). */
  itemAttr?: string;
  items?: SocialItem[];
};

const sizeClass = {
  sm: "size-[44px]",
  md: "size-[52px]",
  lg: "size-[60px]",
  header: "size-[34px]",
} as const;

const iconPx = {
  sm: 18,
  md: 20,
  lg: 22,
  header: 15,
} as const;

export function SocialMagneticIcons({
  className,
  size = "md",
  itemAttr,
  items = DEFAULT_SOCIALS,
}: SocialMagneticIconsProps) {
  const isHeader = size === "header";

  return (
    <ul
      className={cn(
        "flex flex-wrap items-center",
        isHeader ? "gap-1.5" : "gap-3 md:gap-4",
        className,
      )}
      aria-label="Social links"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const attrs = itemAttr
          ? ({ [itemAttr]: "" } as Record<string, string>)
          : undefined;

        return (
          <li key={item.label}>
            <Magnetic strength={isHeader ? 0.4 : 0.55}>
              <a
                {...attrs}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                data-cursor="hover"
                aria-label={item.label}
                title={item.label}
                className={cn(
                  "group inline-flex items-center justify-center rounded-full border transition-[background,color,box-shadow,border-color,transform] duration-normal ease-standard active:scale-95",
                  isHeader
                    ? "border-border-muted bg-surface-raised text-text-secondary hover:border-accent-cyan/70 hover:bg-accent-cyan hover:text-surface-base hover:shadow-[0_0_16px_rgba(125,211,252,0.35)]"
                    : "border-transparent bg-[#e8e4dc] text-[#1a1a1a] shadow-soft hover:bg-accent-cyan hover:text-surface-base hover:shadow-[0_0_24px_rgba(125,211,252,0.45)]",
                  sizeClass[size],
                )}
              >
                <span className="inline-flex size-[45%] items-center justify-center [&_svg]:size-full">
                  <Icon size={iconPx[size]} />
                </span>
              </a>
            </Magnetic>
          </li>
        );
      })}
    </ul>
  );
}

export { GitHubIcon, LinkedInIcon, LeetCodeIcon, MailIcon, PhoneIcon };
