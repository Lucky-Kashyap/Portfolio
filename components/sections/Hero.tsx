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
      gsap.set(intro, { opacity: 0, y: 24 });
      // No clipPath — it was cropping the last letter of the name
      gsap.set(nameRef.current, { opacity: 0, y: 22 });
      gsap.set(ctas, { opacity: 0, y: 18 });
      gsap.set(social, { opacity: 0, y: 14 });
      gsap.set(avatar, { opacity: 0, y: 32, scale: 0.97 });
      gsap.set(scrollRef.current, { opacity: 0 });

      tl.to(bgRef.current, { opacity: 1, duration: 0.9 }, 0)
        .to(intro, { opacity: 1, y: 0, duration: 0.65, stagger: 0.07 }, 0.1)
        .to(nameRef.current, { opacity: 1, y: 0, duration: 0.8 }, 0.2)
        .to(avatar, { opacity: 1, y: 0, scale: 1, duration: 0.9 }, 0.15)
        .to(ctas, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 }, 0.55)
        .to(social, { opacity: 1, y: 0, duration: 0.4, stagger: 0.05 }, 0.7)
        .to(scrollRef.current, { opacity: 1, duration: 0.45 }, 0.9);

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
          { y: 60, scale: 0.98, opacity: 0.4, ease: "none" },
          0,
        )
        .to(bgRef.current, { y: 80, ease: "none" }, 0);

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
      className="relative flex min-h-[100svh] items-center justify-center overflow-x-clip overflow-y-visible bg-surface-base pt-14 pb-12 md:pt-16 md:pb-16"
      aria-labelledby="hero-heading"
    >
      <div
        ref={bgRef}
        className="pointer-events-none absolute inset-0 will-change-transform"
        aria-hidden
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_70%_20%,color-mix(in_srgb,#7dd3fc_12%,transparent),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_15%_80%,color-mix(in_srgb,#ffffff_6%,transparent),transparent_55%)]" />
        <p className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 select-none text-[clamp(4rem,18vw,14rem)] font-bold tracking-tighter text-text-primary/[0.04] uppercase">
          Creative
        </p>
      </div>

      <Container className="relative z-10 w-full">
        <div
          ref={contentRef}
          className="grid w-full items-start gap-8 will-change-transform lg:grid-cols-2 lg:gap-12 xl:gap-16"
        >
          {/* Left — top-aligned with avatar (not vertically centered) */}
          <div className="min-w-0 order-2 lg:order-1 lg:pr-2 lg:pt-1">
            <p
              data-hero-intro
              className="mb-2 text-xs font-medium tracking-[0.22em] text-accent-cyan uppercase md:text-sm"
            >
              Hello! I&apos;m
            </p>

            {/* overflow-visible so last letter never clips */}
            <div ref={nameRef} className="will-change-transform">
              <p
                className={cn(
                  "font-bold tracking-[-0.03em] text-text-primary uppercase",
                  "text-[clamp(2.35rem,5.8vw,4.25rem)] leading-[1.02]",
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

            {/* Single H1 for SEO — role keyword */}
            <h1
              id="hero-heading"
              data-hero-intro
              className="mt-3 text-[clamp(1.35rem,2.8vw,2.15rem)] font-bold tracking-tight text-accent-cyan uppercase md:mt-4"
            >
              {site.heroHeadline}
            </h1>

            <p
              data-hero-intro
              className="mt-4 max-w-lg text-[clamp(1rem,1.5vw,1.25rem)] leading-relaxed text-text-secondary md:mt-5"
            >
              {site.summary}
            </p>

            <div className="mt-7 flex w-full flex-col gap-3 sm:w-auto sm:flex-row md:mt-8">
              <div data-hero-cta>
                <Button
                  className="w-full min-h-[48px] px-7 text-base sm:w-auto md:min-h-[52px]"
                  aria-label="View featured projects"
                  onClick={() => scrollToId("projects")}
                >
                  Explore Work
                </Button>
              </div>
              <div data-hero-cta>
                <Button
                  variant="secondary"
                  className="w-full min-h-[48px] px-7 text-base sm:w-auto md:min-h-[52px]"
                  aria-label="Go to contact form"
                  onClick={() => scrollToId("contact")}
                >
                  Contact Me
                </Button>
              </div>
            </div>

            <SocialMagneticIcons
              className="mt-7"
              size="md"
              itemAttr="data-hero-social"
            />
          </div>

          {/* Right — equal column, full-width avatar */}
          <div
            data-hero-avatar
            className="order-1 mx-auto w-full max-w-[320px] sm:max-w-[380px] lg:order-2 lg:mx-0 lg:max-w-none"
          >
            <HeroAvatar />
          </div>
        </div>
      </Container>

      <button
        ref={scrollRef}
        type="button"
        className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 items-center justify-center text-text-tertiary md:inline-flex"
        onClick={() => scrollToId("about")}
        aria-label="Scroll to about section"
      >
        <span data-scroll-arrow aria-hidden className="text-lg">
          ↓
        </span>
      </button>
    </section>
  );
}
