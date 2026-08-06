"use client";

import { useRef } from "react";
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
      gsap.set(intro, { opacity: 0, y: 28 });
      gsap.set(nameRef.current, { clipPath: "inset(0 0 100% 0)", y: 28 });
      gsap.set(ctas, { opacity: 0, y: 20 });
      gsap.set(social, { opacity: 0, y: 16 });
      gsap.set(avatar, { opacity: 0, y: 40, scale: 0.96 });
      gsap.set(scrollRef.current, { opacity: 0 });

      tl.to(bgRef.current, { opacity: 1, duration: 1 }, 0)
        .to(intro, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, 0.12)
        .to(
          nameRef.current,
          { clipPath: "inset(0 0 0% 0)", y: 0, duration: 0.95 },
          0.28,
        )
        .to(avatar, { opacity: 1, y: 0, scale: 1, duration: 1 }, 0.2)
        .to(ctas, { opacity: 1, y: 0, duration: 0.55, stagger: 0.1 }, 0.65)
        .to(social, { opacity: 1, y: 0, duration: 0.45, stagger: 0.06 }, 0.85)
        .to(scrollRef.current, { opacity: 1, duration: 0.5 }, 1);

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
          { y: 80, scale: 0.96, opacity: 0.35, ease: "none" },
          0,
        )
        .to(bgRef.current, { y: 100, ease: "none" }, 0);

      if (scrollRef.current) {
        gsap.to(scrollRef.current.querySelector("[data-scroll-arrow]"), {
          y: 6,
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
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-surface-base pb-20 pt-[calc(2.5rem+var(--spacing-6))] md:pb-24"
      aria-labelledby="hero-heading"
    >
      <div
        ref={bgRef}
        className="pointer-events-none absolute inset-0 will-change-transform"
        aria-hidden
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_70%_20%,color-mix(in_srgb,#7dd3fc_12%,transparent),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_15%_80%,color-mix(in_srgb,#ffffff_6%,transparent),transparent_55%)]" />
        <p className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 select-none text-[clamp(4.5rem,22vw,16rem)] font-bold tracking-tighter text-text-primary/[0.04] uppercase">
          Creative
        </p>
      </div>

      <Container className="relative z-10 w-full">
        <div
          ref={contentRef}
          className="grid items-center gap-10 will-change-transform lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.7fr)] lg:gap-20 xl:gap-24"
        >
          <div className="min-w-0 order-2 lg:order-1">
            <p
              data-hero-intro
              className="mb-3 text-sm font-medium tracking-[0.2em] text-accent-cyan uppercase"
            >
              Hello! I&apos;m
            </p>

            <div ref={nameRef} className="overflow-hidden will-change-transform">
              <p
                className={cn(
                  "text-display-xl font-bold tracking-tight text-text-primary uppercase",
                  !reduced && "animate-hero-name-pulse",
                )}
              >
                <span className="block drop-shadow-[0_0_28px_rgba(125,211,252,0.22)]">
                  {first}
                </span>
                {last ? (
                  <span className="block text-text-secondary">{last}</span>
                ) : null}
              </p>
            </div>

            <h1
              id="hero-heading"
              data-hero-intro
              className="mt-5 text-display-sm font-bold tracking-tight text-accent-cyan uppercase md:text-display-md"
            >
              {site.heroHeadline}
            </h1>

            <p
              data-hero-intro
              className="mt-6 max-w-xl text-xl leading-relaxed text-text-secondary md:text-2xl"
            >
              {site.summary}
            </p>

            <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <div data-hero-cta>
                <Button
                  className="w-full min-h-[56px] px-8 text-lg sm:w-auto"
                  aria-label="View featured projects"
                  onClick={() => scrollToId("projects")}
                >
                  Explore Work
                </Button>
              </div>
              <div data-hero-cta>
                <Button
                  variant="secondary"
                  className="w-full min-h-[56px] px-8 text-lg sm:w-auto"
                  aria-label="Go to contact form"
                  onClick={() => scrollToId("contact")}
                >
                  Contact Me
                </Button>
              </div>
            </div>

            <SocialMagneticIcons
              className="mt-8"
              size="md"
              itemAttr="data-hero-social"
            />
          </div>

          <div
            data-hero-avatar
            className="order-1 mx-auto w-full max-w-[300px] lg:order-2 lg:mx-0 lg:max-w-[340px] xl:max-w-[360px]"
          >
            <HeroAvatar />
          </div>
        </div>
      </Container>

      <button
        ref={scrollRef}
        type="button"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-xs tracking-[0.18em] text-text-tertiary uppercase md:inline-flex"
        onClick={() => scrollToId("about")}
        aria-label="Scroll to about section"
      >
        Scroll down
        <span data-scroll-arrow aria-hidden>
          ↓
        </span>
      </button>
    </section>
  );
}
