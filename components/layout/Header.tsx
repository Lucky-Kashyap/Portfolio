"use client";

import { useEffect, useId, useState } from "react";
import { Menu, X } from "lucide-react";
import { Container, IconButton, TextLink } from "@/components/ui";
import { BrandMark } from "@/components/ui/BrandMark";
import { NavLinks } from "@/components/layout/NavLinks";
import { navItems, site } from "@/lib/content";
import { cn } from "@/lib/utils";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuId = useId();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background,box-shadow] duration-fast",
        scrolled || open
          ? "border-b border-border-muted bg-surface-overlay backdrop-blur-md shadow-card"
          : "bg-transparent",
      )}
    >
      <Container className="flex h-header items-center justify-between gap-4">
        <TextLink
          href="#top"
          variant="brand"
          className="inline-flex items-center gap-2"
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
          <BrandMark size={28} className="rounded-xs" title="" />
          {site.mark}
        </TextLink>

        <nav aria-label="Primary" className="hidden md:block">
          <NavLinks items={navItems} />
        </nav>

        <IconButton
          className="md:hidden"
          label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
        </IconButton>
      </Container>

      <div
        id={menuId}
        className={cn(
          "border-t border-border-muted bg-surface-overlay md:hidden",
          open ? "block" : "hidden",
        )}
      >
        <nav aria-label="Mobile primary" className="container-site py-6">
          <NavLinks items={navItems} variant="navMobile" onNavigate={close} />
        </nav>
      </div>
    </header>
  );
}
