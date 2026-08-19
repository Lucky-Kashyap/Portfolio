"use client";

import { useRef, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import {
  AvailabilityBadge,
  Button,
  Container,
  AvatarVideoFrame,
} from "@/components/ui";
import { AvatarSlot } from "@/components/avatar/AvatarScrollStage";
import { SocialMagneticIcons } from "@/components/motion/SocialMagneticIcons";
import { HeroScene } from "@/components/three/HeroScene";
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

function LetterName({
  text,
  className,
  outline = false,
  reduced,
}: {
  text: string;
  className?: string;
  outline?: boolean;
  reduced: boolean;
}) {
  const letters = text.split("");

  return (
    <span
      className={cn(
        "inline-flex flex-wrap justify-start",
        outline && "text-stroke-heading",
        className,
      )}
      aria-label={text}
    >
      {letters.map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          className={cn("inline-block", char === " " && "w-[0.28em]")}
          initial={reduced ? false : { y: "0.65em", opacity: 0, rotateX: -40 }}
          animate={{ y: 0, opacity: 1, rotateX: 0 }}
          transition={{
            duration: 0.55,
            delay: reduced ? 0 : 0.12 + i * 0.035,
            ease: [0.22, 1, 0.36, 1],
          }}
          aria-hidden
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
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
    }, 2600);
    return () => window.clearInterval(id);
  }, [reduced, roles.length]);

  const active = roles[index % roles.length];

  return (
    <div className="relative mt-2 min-h-[1.35em] overflow-hidden md:mt-3">
      <AnimatePresence mode="wait">
        <motion.p
          key={active}
          initial={reduced ? false : { y: 22, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduced ? undefined : { y: -18, opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="text-[clamp(1.05rem,2.4vw,1.75rem)] font-bold tracking-tight text-accent-cyan uppercase"
        >
          {active}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

function HeroSummary({ reduced }: { reduced: boolean }) {
  const parts = site.summary.split("intelligent");
  const hasWord = parts.length > 1;

  return (
    <motion.p
      data-hero-intro
      initial={reduced ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="mt-3 max-w-md text-[clamp(0.9rem,1.35vw,1.05rem)] leading-relaxed text-text-secondary md:mt-4"
    >
      {hasWord ? (
        <>
          {parts[0]}
          <motion.span
            className="font-semibold text-text-primary"
            animate={
              reduced
                ? undefined
                : {
                    opacity: [0.75, 1, 0.75],
                    textShadow: [
                      "0 0 0px rgba(125,211,252,0)",
                      "0 0 18px rgba(125,211,252,0.35)",
                      "0 0 0px rgba(125,211,252,0)",
                    ],
                  }
            }
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          >
            intelligent
          </motion.span>
          {parts.slice(1).join("intelligent")}
        </>
      ) : (
        site.summary
      )}
    </motion.p>
  );
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const creativeRef = useRef<HTMLParagraphElement>(null);
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
      gsap.set(creativeRef.current, { opacity: 0, scale: 1.08 });
      gsap.set(intro, { opacity: 0, y: 18 });
      gsap.set(nameRef.current, { opacity: 1 });
      gsap.set(ctas, { opacity: 0, y: 14 });
      gsap.set(social, { opacity: 0, y: 12 });
      // Force x/xPercent to 0 — leftover -translate-x-1/2 from older full-bleed
      // styles can stick in GSAP's transform cache and clip the video on narrow phones.
      gsap.set(avatar, {
        opacity: 0,
        y: 28,
        scale: 0.94,
        x: 0,
        xPercent: 0,
      });

      tl.to(bgRef.current, { opacity: 1, duration: 0.7 }, 0)
        .to(
          creativeRef.current,
          { opacity: 1, scale: 1, duration: 1.1 },
          0.05,
        )
        .to(intro, { opacity: 1, y: 0, duration: 0.5, stagger: 0.07 }, 0.1)
        .to(
          avatar,
          { opacity: 1, y: 0, scale: 1, x: 0, xPercent: 0, duration: 0.9 },
          0.15,
        )
        .to(ctas, { opacity: 1, y: 0, duration: 0.45, stagger: 0.08 }, 0.48)
        .to(social, { opacity: 1, y: 0, duration: 0.35, stagger: 0.04 }, 0.62);

      if (creativeRef.current) {
        gsap.to(creativeRef.current, {
          y: 18,
          duration: 4.5,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      }

      // Text / bg handoff — avatar video stays in hero frame
      const scrub = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 0.65,
        },
      });

      scrub
        .to(bgRef.current, { y: 48, ease: "none" }, 0)
        .to(
          q("[data-hero-copy]"),
          { y: 24, opacity: 0.55, ease: "none" },
          0,
        )
        .to(
          creativeRef.current,
          { opacity: 0, scale: 1.08, y: 24, ease: "none" },
          0,
        );

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
      className="relative flex min-h-[100svh] items-start overflow-x-clip overflow-y-visible bg-surface-base pt-[4.75rem] pb-8 min-[380px]:pt-[5.25rem] md:h-[100svh] md:max-h-[100svh] md:items-center md:overflow-hidden md:pt-16 md:pb-10 lg:pb-12"
      aria-labelledby="hero-heading"
    >
      <div
        ref={bgRef}
        className="pointer-events-none absolute inset-0 will-change-transform"
        aria-hidden
      >
        <HeroScene />
        <div className="absolute inset-0 z-[2] bg-[radial-gradient(ellipse_60%_50%_at_75%_25%,color-mix(in_srgb,#7dd3fc_12%,transparent),transparent_58%)]" />
        <div className="absolute inset-0 z-[2] bg-[radial-gradient(ellipse_45%_40%_at_10%_85%,color-mix(in_srgb,#e8c47c_6%,transparent),transparent_55%)]" />
        <div className="absolute inset-0 z-[2] bg-[radial-gradient(ellipse_42%_48%_at_82%_42%,color-mix(in_srgb,#e8c47c_14%,transparent),transparent_62%)]" />
        <p
          ref={creativeRef}
          className="text-stroke-heading-soft absolute right-[-4%] top-[38%] z-[2] -translate-y-1/2 select-none text-right font-display text-[clamp(3.5rem,16vw,12rem)] font-bold tracking-tighter uppercase md:right-[2%] lg:right-[4%]"
        >
          Creative
        </p>
      </div>

      <Container className="relative z-10 flex h-full w-full min-h-0 items-start md:items-center">
        <div
          ref={contentRef}
          className="grid w-full min-h-0 items-start gap-4 will-change-transform sm:gap-5 lg:grid-cols-2 lg:items-stretch lg:gap-8 xl:gap-10"
        >
          <div
            data-hero-copy
            className="order-2 flex min-w-0 flex-col justify-center px-0 lg:order-1 lg:pr-2"
          >
            <motion.p
              data-hero-intro
              className="mb-1.5 text-[11px] font-medium tracking-[0.22em] text-accent-cyan uppercase md:mb-2 md:text-xs"
              initial={reduced ? false : { opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              Hello! I&apos;m
            </motion.p>

            <div ref={nameRef} className="will-change-transform [perspective:800px]">
              <h1
                id="hero-heading"
                className={cn(
                  "font-display font-bold tracking-[-0.03em] text-text-primary uppercase",
                  "text-[clamp(1.85rem,4.6vw,3.35rem)] leading-[1.02]",
                )}
              >
                <span className="block pr-1 drop-shadow-[0_0_28px_rgba(125,211,252,0.22)]">
                  <LetterName
                    key={ready ? "first-in" : "first-pre"}
                    text={first}
                    reduced={reduced || !ready}
                  />
                </span>
                {last ? (
                  <span className="mt-0.5 block pr-1">
                    <LetterName
                      key={ready ? "last-in" : "last-pre"}
                      text={last}
                      outline
                      reduced={reduced || !ready}
                    />
                  </span>
                ) : null}
              </h1>
            </div>

            <div data-hero-intro>
              <AnimatedHeroRoles reduced={reduced || !ready} />
            </div>

      <HeroSummary reduced={reduced || !ready} />

            <div data-hero-intro className="mt-4">
              <AvailabilityBadge size="sm" />
            </div>

            <div className="mt-5 flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row md:mt-6">
              <div data-hero-cta>
                <Button
                  size="lg"
                  className="w-full sm:w-auto"
                  aria-label="View featured projects"
                  data-cursor-label="VIEW"
                  onClick={() => scrollToId("projects")}
                >
                  Explore Work
                </Button>
              </div>
              <div data-hero-cta>
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto"
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

          {/* Mobile: stay inside container (avoid 100vw breakout clipping); desktop: stretch */}
          <div
            data-hero-avatar
            className="order-1 flex w-full min-w-0 items-stretch justify-center lg:order-2 lg:h-auto lg:min-h-0 lg:justify-end"
          >
            <div className="relative w-full min-w-0 lg:h-full lg:max-w-none lg:pl-2 xl:pl-4">
              {/* Warm rim light around the figure */}
              <div
                className="pointer-events-none absolute -inset-6 z-0 hidden lg:block"
                aria-hidden
              >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_70%_at_70%_40%,rgba(232,196,124,0.2),transparent_68%)] blur-2xl" />
                <div className="absolute inset-0 animate-avatar-glow-pulse bg-[radial-gradient(ellipse_40%_45%_at_75%_30%,rgba(125,211,252,0.16),transparent_70%)]" />
              </div>

              <div className="relative z-[1] h-full w-full min-w-0">
                {reduced ? (
                  <AvatarVideoFrame
                    src={site.heroAvatarVideo}
                    poster={site.heroAvatarPoster}
                    lazy={false}
                    objectPosition={site.heroAvatarObjectPosition}
                    caption={site.heroHeadline}
                    className="max-lg:max-h-[min(42svh,340px)] lg:min-h-full"
                  />
                ) : (
                  <AvatarSlot
                    id="hero"
                    className="mx-auto h-full w-full min-w-0 max-lg:max-h-[min(42svh,340px)]"
                  >
                    <div className="aspect-[5/4] w-full min-[400px]:aspect-[4/5] lg:aspect-auto lg:h-full lg:min-h-[26rem]" />
                  </AvatarSlot>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
