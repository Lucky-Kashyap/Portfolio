"use client";

import { Container, Text } from "@/components/ui";
import { SocialMagneticIcons } from "@/components/motion/SocialMagneticIcons";
import { navItems, site } from "@/lib/content";
import { scrollToId } from "@/lib/scroll";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-border-muted py-10 md:py-12">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_120%,color-mix(in_srgb,#7dd3fc_10%,transparent),transparent_70%)]"
        aria-hidden
      />

      <Container className="relative z-10">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm tracking-[0.2em] text-accent-cyan uppercase">
              Let&apos;s build
            </p>
            <a
              href="#contact"
              data-cursor="hover"
              className="group mt-3 inline-block text-display-sm font-bold tracking-tight text-text-primary uppercase transition-colors duration-fast hover:text-accent-cyan"
              onClick={(event) => {
                event.preventDefault();
                scrollToId("contact");
              }}
            >
              <span className="inline-block transition-transform duration-fast group-hover:-translate-y-1">
                Get in touch
              </span>
              <span
                className="ml-2 inline-block text-accent-cyan transition-transform duration-fast group-hover:translate-x-2"
                aria-hidden
              >
                →
              </span>
            </a>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2">
            {navItems.slice(0, 5).map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                data-cursor="hover"
                className="creative-link text-sm tracking-[0.12em] text-text-tertiary uppercase hover:text-text-primary"
                onClick={(event) => {
                  event.preventDefault();
                  scrollToId(item.id);
                }}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-6 border-t border-border-muted pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm tracking-[0.12em] text-text-muted uppercase">
              {site.mark}
            </p>
            <Text tone="muted" size="sm" className="mt-2">
              Based in {site.location}
            </Text>
            <Text tone="muted" size="sm" className="mt-1">
              © {year} {site.brand}. All rights reserved.
            </Text>
          </div>

          <SocialMagneticIcons size="sm" />
        </div>
      </Container>
    </footer>
  );
}
