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
import { navItems, site } from "@/lib/content";
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
        title={label}
        data-cursor="hover"
        {...(external
          ? { target: "_blank", rel: "noopener noreferrer" }
          : undefined)}
        className="inline-flex size-7 items-center justify-center rounded-full text-text-tertiary transition-colors duration-fast hover:text-accent-cyan"
      >
        {children}
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
    const fallback = window.setTimeout(() => setReady(true), 4500);
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
            "pointer-events-auto transition-[background,backdrop-filter,border-color] duration-normal",
            scrolled
              ? "border-b border-white/5 bg-surface-base/40 backdrop-blur-sm"
              : "border-b border-transparent bg-transparent",
          )}
        >
          <div className="mx-auto flex h-8 max-w-site items-center justify-between gap-2 px-3 md:px-5">
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <a
                href={mailHref}
                data-cursor="hover"
                className="inline-flex max-w-[42vw] items-center gap-1.5 truncate text-[11px] text-text-tertiary transition-colors duration-fast hover:text-accent-cyan sm:max-w-none"
                aria-label="Email"
              >
                <Mail size={12} className="shrink-0 opacity-80" aria-hidden />
                <span className="truncate">{site.email}</span>
              </a>
              <a
                href={phoneHref}
                data-cursor="hover"
                className="hidden items-center gap-1.5 text-[11px] text-text-tertiary transition-colors duration-fast hover:text-accent-cyan sm:inline-flex"
                aria-label="Phone"
              >
                <Phone size={12} className="shrink-0 opacity-80" aria-hidden />
                <span>+91 {site.phone}</span>
              </a>
              <a
                href={phoneHref}
                data-cursor="hover"
                className="inline-flex size-7 items-center justify-center text-text-tertiary transition-colors duration-fast hover:text-accent-cyan sm:hidden"
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

              {/* Mobile menu on first view (float nav is hidden in hero) */}
              {!scrolled ? (
                <IconButton
                  className="!size-8 !min-h-8 !min-w-8 md:hidden"
                  size="md"
                  label={open ? "Close menu" : "Open menu"}
                  aria-expanded={open}
                  aria-controls={menuId}
                  onClick={() => setOpen((v) => !v)}
                >
                  {open ? <X size={16} aria-hidden /> : <Menu size={16} aria-hidden />}
                </IconButton>
              ) : null}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Compact floating section nav — only after leaving hero */}
      <AnimatePresence>
        {scrolled ? (
          <motion.div
            key="float-nav"
            className="pointer-events-none fixed inset-x-0 top-9 z-50 flex justify-center px-3"
            initial={reduced ? false : { y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduced ? undefined : { y: -10, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="pointer-events-auto flex max-w-full items-center gap-1 rounded-full border border-white/10 bg-surface-base/75 px-1.5 py-1 shadow-soft backdrop-blur-xl md:gap-2 md:px-2">
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
                <BrandMark size={22} className="rounded-full" title="" />
                <span className="hidden text-[10px] tracking-[0.14em] sm:inline">
                  {site.mark}
                </span>
              </TextLink>

              <span
                className="mx-0.5 hidden h-4 w-px bg-white/10 md:block"
                aria-hidden
              />

              <nav aria-label="Primary" className="hidden md:block">
                <IconNavLinks items={navItems} activeId={active} />
              </nav>

              <IconButton
                className="!size-8 !min-h-8 !min-w-8 md:hidden"
                size="md"
                label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                aria-controls={menuId}
                onClick={() => setOpen((v) => !v)}
              >
                <span className="relative inline-flex size-4 items-center justify-center">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={open ? "close" : "open"}
                      initial={
                        reduced ? false : { opacity: 0, rotate: -40, scale: 0.7 }
                      }
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={
                        reduced
                          ? undefined
                          : { opacity: 0, rotate: 40, scale: 0.7 }
                      }
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0 inline-flex items-center justify-center"
                    >
                      {open ? (
                        <X size={16} aria-hidden />
                      ) : (
                        <Menu size={16} aria-hidden />
                      )}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </IconButton>
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
            className={cn(
              "fixed inset-x-3 z-50 overflow-hidden rounded-md border border-border-muted/70 bg-surface-base/95 shadow-soft backdrop-blur-xl md:hidden",
              scrolled ? "top-[4.75rem]" : "top-10",
            )}
          >
            <nav aria-label="Mobile primary" className="px-2 py-3">
              <NavLinks
                items={navItems}
                variant="navMobile"
                activeId={active}
                onNavigate={close}
              />
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
