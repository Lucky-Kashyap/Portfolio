"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Container, Text } from "@/components/ui";
import { SocialMagneticIcons } from "@/components/motion/SocialMagneticIcons";
import { navItems, site } from "@/lib/content";
import { scrollToId } from "@/lib/scroll";
import { gsap, registerGsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/useMotionPrefs";

export function Footer() {
  const year = new Date().getFullYear();
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      registerGsap();
      const root = ref.current;
      if (!root || reduced) return;

      const items = root.querySelectorAll("[data-footer-item]");
      gsap.fromTo(
        items,
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.07,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root,
            start: "top 92%",
            once: true,
          },
        },
      );
    },
    { dependencies: [reduced], scope: ref },
  );

  return (
    <footer
      ref={ref}
      className="relative overflow-hidden border-t border-border-muted py-6 md:py-8"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_120%,color-mix(in_srgb,#7dd3fc_10%,transparent),transparent_70%)]"
        aria-hidden
      />

      <Container className="relative z-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <div data-footer-item>
            <p className="text-[11px] tracking-[0.2em] text-accent-cyan uppercase">
              Let&apos;s build
            </p>
            <a
              href="#contact"
              data-cursor="hover"
              className="group mt-1.5 inline-block text-[clamp(1.35rem,3vw,1.85rem)] font-bold tracking-tight text-text-primary uppercase transition-colors duration-fast hover:text-accent-cyan"
              onClick={(event) => {
                event.preventDefault();
                scrollToId("contact");
              }}
            >
              <span className="inline-block transition-transform duration-fast group-hover:-translate-y-0.5">
                Get in touch
              </span>
              <span
                className="ml-2 inline-block text-accent-cyan transition-transform duration-fast group-hover:translate-x-1.5"
                aria-hidden
              >
                →
              </span>
            </a>
          </div>

          <nav
            data-footer-item
            aria-label="Footer"
            className="flex flex-wrap gap-x-4 gap-y-1.5"
          >
            {navItems.slice(0, 5).map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                data-cursor="hover"
                className="creative-link text-xs tracking-[0.12em] text-text-tertiary uppercase hover:text-text-primary"
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

        <div className="mt-5 flex flex-col gap-4 border-t border-border-muted pt-5 sm:mt-6 sm:flex-row sm:items-center sm:justify-between">
          <div data-footer-item>
            <p className="text-xs tracking-[0.12em] text-text-muted uppercase">
              {site.mark}
            </p>
            <Text tone="muted" size="sm" className="mt-1">
              Based in {site.location} · © {year} {site.brand}
            </Text>
          </div>

          <div data-footer-item>
            <SocialMagneticIcons size="sm" />
          </div>
        </div>
      </Container>
    </footer>
  );
}
