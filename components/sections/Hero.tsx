"use client";

import { useRef, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import { Button, Container } from "@/components/ui";
import { HeroAvatar } from "@/components/motion/HeroAvatar";
import { SocialMagneticIcons } from "@/components/motion/SocialMagneticIcons";
import { site } from "@/lib/content";
import { scrollToId } from "@/lib/scroll";
import { gsap, registerGsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import {
  usePortfolioReady,
  usePrefersReducedMotion,
} from "@/hooks/useMotionPrefs";

function splitName(full: string) {
  const parts = full.trim().split(/\s+/);
  if (parts.length < 2) return { first: full, last: "" };
  return { first: parts[0], last: parts.slice(1).join(" ") };
}

function AnimatedHeroRoles({ reduced }: { reduced: boolean }) {
  const roles = site.heroRoles?.length
    ? [...site.heroRoles]
    : [site.heroHeadline];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduced || roles.length < 2) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % roles.length);
    }, 2800);
    return () => window.clearInterval(id);
  }, [reduced, roles.length]);

  const active = roles[index % roles.length];

  return (
    <div className="relative mt-2 min-h-[1.35em] overflow-hidden md:mt-3">
      <AnimatePresence mode="wait">
        <motion.h1
          key={active}
          id="hero-heading"
          initial={reduced ? false : { y: 22, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduced ? undefined : { y: -18, opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="text-[clamp(1.15rem,2.4vw,1.85rem)] font-bold tracking-tight text-accent-cyan uppercase"
        >
          {active}
        </motion.h1>
      </AnimatePresence>
    </div>
  );
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLButtonElement>(null);
  const reduced = usePrefersReducedMotion();
  const ready = usePortfolioReady(reduced);
  const { first, last } = splitName(site.brand);

  useGSAP(
    () => {
      registerGsap();
      const section = sectionRef.current;
      if (!section || !ready) return;

      const q = gsap.utils.selector(section);
      const intro = q("[data-hero-intro]");
      const ctas = q("[data-hero-cta]");
      const social = q("[data-hero-social]");
      const avatar = q("[data-hero-avatar]");

      if (reduced) {
        gsap.set(
          [intro, ctas, social, avatar, nameRef.current, bgRef.current],
          { clearProps: "all" },
        );
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      gsap.set(bgRef.current, { opacity: 0 });
      gsap.set(intro, { opacity: 0, y: 18 });
      gsap.set(nameRef.current, { opacity: 0, y: 16 });
      gsap.set(ctas, { opacity: 0, y: 14 });
      gsap.set(social, { opacity: 0, y: 12 });
      gsap.set(avatar, { opacity: 0, y: 20, scale: 0.98 });
      gsap.set(scrollRef.current, { opacity: 0 });

      tl.to(bgRef.current, { opacity: 1, duration: 0.8 }, 0)
        .to(intro, { opacity: 1, y: 0, duration: 0.55, stagger: 0.06 }, 0.08)
        .to(nameRef.current, { opacity: 1, y: 0, duration: 0.7 }, 0.15)
        .to(avatar, { opacity: 1, y: 0, scale: 1, duration: 0.8 }, 0.12)
        .to(ctas, { opacity: 1, y: 0, duration: 0.45, stagger: 0.07 }, 0.45)
        .to(social, { opacity: 1, y: 0, duration: 0.35, stagger: 0.04 }, 0.58)
        .to(scrollRef.current, { opacity: 1, duration: 0.4 }, 0.75);

      const scrub = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      scrub
        .to(
          contentRef.current,
          { y: 40, scale: 0.985, opacity: 0.45, ease: "none" },
          0,
        )
        .to(bgRef.current, { y: 60, ease: "none" }, 0);

      if (scrollRef.current) {
        gsap.to(scrollRef.current.querySelector("[data-scroll-arrow]"), {
          y: 5,
          repeat: -1,
          yoyo: true,
          duration: 0.9,
          ease: "sine.inOut",
        });
      }

      return () => {
        tl.kill();
        scrub.scrollTrigger?.kill();
        scrub.kill();
      };
    },
    { dependencies: [ready, reduced], scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative flex h-[100svh] max-h-[100svh] min-h-[100svh] items-center overflow-hidden bg-surface-base pt-12 pb-8 md:pt-14 md:pb-10"
      aria-labelledby="hero-heading"
    >
      <div
        ref={bgRef}
        className="pointer-events-none absolute inset-0 will-change-transform"
        aria-hidden
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_70%_20%,color-mix(in_srgb,#7dd3fc_12%,transparent),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_15%_80%,color-mix(in_srgb,#ffffff_6%,transparent),transparent_55%)]" />
        <p className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 select-none text-[clamp(3.5rem,16vw,12rem)] font-bold tracking-tighter text-text-primary/[0.035] uppercase">
          Creative
        </p>
      </div>

      <Container className="relative z-10 flex h-full w-full min-h-0 items-center">
        <div
          ref={contentRef}
          className="grid w-full min-h-0 items-center gap-5 will-change-transform lg:grid-cols-2 lg:gap-10 xl:gap-12"
        >
          {/* Left — same vertical center as avatar */}
          <div className="min-w-0 order-2 flex flex-col justify-center lg:order-1 lg:pr-2">
            <p
              data-hero-intro
              className="mb-1.5 text-[11px] font-medium tracking-[0.22em] text-accent-cyan uppercase md:mb-2 md:text-xs"
            >
              Hello! I&apos;m
            </p>

            <div ref={nameRef} className="will-change-transform">
              <p
                className={cn(
                  "font-bold tracking-[-0.03em] text-text-primary uppercase",
                  "text-[clamp(1.85rem,4.6vw,3.35rem)] leading-[1.02]",
                  !reduced && "animate-hero-name-pulse",
                )}
              >
                <span className="block pr-1 drop-shadow-[0_0_28px_rgba(125,211,252,0.22)]">
                  {first}
                </span>
                {last ? (
                  <span className="block pr-1 text-text-secondary">{last}</span>
                ) : null}
              </p>
            </div>

            {/* Animated roles visible in first viewport (no scroll needed) */}
            <div data-hero-intro>
              <AnimatedHeroRoles reduced={reduced} />
            </div>

            <p
              data-hero-intro
              className="mt-3 max-w-md text-[clamp(0.9rem,1.35vw,1.05rem)] leading-relaxed text-text-secondary md:mt-4"
            >
              {site.summary}
            </p>

            <div className="mt-5 flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row md:mt-6">
              <div data-hero-cta>
                <Button
                  className="w-full min-h-[44px] px-6 text-sm sm:w-auto md:min-h-[48px] md:text-base"
                  aria-label="View featured projects"
                  onClick={() => scrollToId("projects")}
                >
                  Explore Work
                </Button>
              </div>
              <div data-hero-cta>
                <Button
                  variant="secondary"
                  className="w-full min-h-[44px] px-6 text-sm sm:w-auto md:min-h-[48px] md:text-base"
                  aria-label="Go to contact form"
                  onClick={() => scrollToId("contact")}
                >
                  Contact Me
                </Button>
              </div>
            </div>

            <SocialMagneticIcons
              className="mt-5"
              size="sm"
              itemAttr="data-hero-social"
            />
          </div>

          {/* Right — equal column, height capped to first viewport */}
          <div
            data-hero-avatar
            className="order-1 mx-auto flex w-full max-w-[260px] items-center justify-center sm:max-w-[300px] lg:order-2 lg:mx-0 lg:max-w-none lg:justify-end"
          >
            <div className="w-full max-h-[min(52svh,420px)] lg:max-h-[min(68svh,520px)]">
              <HeroAvatar compact />
            </div>
          </div>
        </div>
      </Container>

      <button
        ref={scrollRef}
        type="button"
        className="absolute bottom-3 left-1/2 z-20 hidden -translate-x-1/2 items-center justify-center text-text-tertiary md:inline-flex"
        onClick={() => scrollToId("about")}
        aria-label="Scroll to about section"
      >
        <span data-scroll-arrow aria-hidden className="text-base">
          ↓
        </span>
      </button>
    </section>
  );
}
