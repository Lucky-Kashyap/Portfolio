"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, Menu, Phone, X } from "lucide-react";
import { IconButton, TextLink } from "@/components/ui";
import { BrandMark } from "@/components/ui/BrandMark";
import { IconNavLinks } from "@/components/layout/IconNavLinks";
import { NavLinks } from "@/components/layout/NavLinks";
import {
  GitHubIcon,
  LeetCodeIcon,
  LinkedInIcon,
} from "@/components/motion/SocialMagneticIcons";
import { Magnetic } from "@/components/motion/Magnetic";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { navItems, site } from "@/lib/content";
import { BOOT_SAFETY_MS } from "@/lib/boot";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/useMotionPrefs";

const SOCIALS = [
  { href: site.github, label: "GitHub", icon: GitHubIcon, external: true },
  { href: site.linkedin, label: "LinkedIn", icon: LinkedInIcon, external: true },
  { href: site.leetcode, label: "LeetCode", icon: LeetCodeIcon, external: true },
] as const;

function TopLink({
  href,
  label,
  children,
  external,
}: {
  href: string;
  label: string;
  children: ReactNode;
  external?: boolean;
}) {
  return (
    <Magnetic strength={0.35}>
      <a
        href={href}
        aria-label={label}
        data-cursor="hover"
        {...(external
          ? { target: "_blank", rel: "noopener noreferrer" }
          : undefined)}
        className="group relative inline-flex size-7 items-center justify-center rounded-full text-text-secondary transition-colors duration-fast hover:text-accent-cyan"
      >
        {children}
        <span className="pointer-events-none absolute top-[calc(100%+8px)] left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-xs border border-border-muted bg-surface-base px-2 py-1 text-[10px] font-medium tracking-[0.14em] text-text-secondary uppercase opacity-0 shadow-soft transition-opacity duration-fast group-hover:opacity-100 group-focus-visible:opacity-100">
          {label}
        </span>
      </a>
    </Magnetic>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [ready, setReady] = useState(false);
  const menuId = useId();
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) {
      setReady(true);
      return;
    }
    const onReady = () => setReady(true);
    window.addEventListener("portfolio:ready", onReady);
    const fallback = window.setTimeout(() => setReady(true), BOOT_SAFETY_MS);
    return () => {
      window.removeEventListener("portfolio:ready", onReady);
      window.clearTimeout(fallback);
    };
  }, [reduced]);

  useEffect(() => {
    const onScroll = () => {
      // Keep first viewport clean — float nav only after leaving the hero
      const heroH =
        document.getElementById("top")?.offsetHeight ?? window.innerHeight;
      setScrolled(window.scrollY > heroH * 0.72);

      const ids = navItems.map((item) => item.id);
      let current = "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= 120) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!scrolled) setOpen(false);
  }, [scrolled]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);
  const phoneHref = `tel:${site.phone.replace(/\s/g, "")}`;
  const mailHref = `mailto:${site.email}`;

  return (
    <>
      <motion.header
        className="pointer-events-none fixed inset-x-0 top-0 z-50"
        initial={reduced ? false : { y: -16, opacity: 0 }}
        animate={
          ready || reduced ? { y: 0, opacity: 1 } : { y: -16, opacity: 0 }
        }
        transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Accent line */}
        <div className="pointer-events-none relative h-px w-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-accent-cyan to-transparent"
            animate={reduced ? { left: "38%" } : { left: ["-30%", "100%"] }}
            transition={
              reduced
                ? undefined
                : { duration: 3.2, repeat: Infinity, ease: "linear" }
            }
          />
        </div>

        {/* Slim contact strip — never a heavy full-bleed bar */}
        <div
          className={cn(
            "header-strip pointer-events-auto transition-[background,backdrop-filter,border-color] duration-normal",
            scrolled
              ? "border-b border-border-muted/60 bg-surface-base/40 backdrop-blur-sm"
              : "border-b border-transparent bg-transparent",
          )}
        >
          <div className="container-site flex h-8 items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <a
                href={mailHref}
                data-cursor="hover"
                className="inline-flex max-w-[42vw] items-center gap-1.5 truncate text-[11px] text-text-secondary transition-colors duration-fast hover:text-accent-cyan sm:max-w-none"
                aria-label="Email"
              >
                <Mail size={12} className="shrink-0" aria-hidden />
                <span className="truncate">{site.email}</span>
              </a>
              <a
                href={phoneHref}
                data-cursor="hover"
                className="hidden items-center gap-1.5 text-[11px] text-text-secondary transition-colors duration-fast hover:text-accent-cyan sm:inline-flex"
                aria-label="Phone"
              >
                <Phone size={12} className="shrink-0" aria-hidden />
                <span>+91 {site.phone}</span>
              </a>
              <a
                href={phoneHref}
                data-cursor="hover"
                className="inline-flex size-7 items-center justify-center text-text-secondary transition-colors duration-fast hover:text-accent-cyan sm:hidden"
                aria-label="Call"
              >
                <Phone size={13} aria-hidden />
              </a>
            </div>

            <div className="flex shrink-0 items-center gap-0.5">
              <ul className="flex items-center" aria-label="Social links">
                {SOCIALS.map(({ href, label, icon: Icon, external }) => (
                  <li key={label}>
                    <TopLink href={href} label={label} external={external}>
                      <Icon size={13} />
                    </TopLink>
                  </li>
                ))}
              </ul>

              <ThemeToggle />

              {/* Mobile menu lives in the strip — float nav is desktop-only */}
              <IconButton
                className="!size-7 !min-h-7 !min-w-7 md:hidden"
                size="md"
                label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                aria-controls={menuId}
                onClick={() => setOpen((v) => !v)}
              >
                {open ? <X size={15} aria-hidden /> : <Menu size={15} aria-hidden />}
              </IconButton>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Floating section nav — desktop only, after leaving hero */}
      <AnimatePresence>
        {scrolled ? (
          <motion.div
            key="float-nav"
            className="pointer-events-none fixed inset-x-0 top-9 z-50 hidden justify-center md:flex"
            initial={reduced ? false : { y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduced ? undefined : { y: -10, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="container-site pointer-events-none flex justify-center">
              <div className="pointer-events-auto flex max-w-full items-center gap-2 rounded-full border border-border-muted/80 bg-surface-base/75 px-2 py-1 shadow-soft backdrop-blur-xl">
                <TextLink
                  href="#top"
                  variant="brand"
                  className="brand-mark-wrap inline-flex shrink-0 items-center gap-1.5 rounded-full px-1.5 py-1 no-underline"
                  data-cursor="hover"
                  onClick={(event) => {
                    event.preventDefault();
                    close();
                    if (window.__lenis) {
                      window.__lenis.scrollTo(0, { duration: 1.1 });
                    } else {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                >
                  <BrandMark size={22} className="rounded-full" />
                  <span className="text-[10px] tracking-[0.14em]">
                    {site.mark}
                  </span>
                </TextLink>

                <span className="mx-0.5 h-4 w-px bg-border-muted" aria-hidden />

                <nav aria-label="Primary">
                  <IconNavLinks items={navItems} activeId={active} />
                </nav>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open ? (
          <motion.div
            id={menuId}
            key="mobile-nav"
            initial={reduced ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="container-site fixed inset-x-0 top-10 z-50 md:hidden"
          >
            <div className="overflow-hidden rounded-md border border-border-muted/70 bg-surface-base/95 shadow-soft backdrop-blur-xl">
              <nav aria-label="Mobile primary" className="px-2 py-3">
                <NavLinks
                  items={navItems}
                  variant="navMobile"
                  activeId={active}
                  onNavigate={close}
                />
              </nav>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
