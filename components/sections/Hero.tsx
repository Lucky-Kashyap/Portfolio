"use client";

import { useRef, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import { Button, Container, AvatarVideoFrame } from "@/components/ui";
import { AvatarSlot } from "@/components/avatar/AvatarScrollStage";
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
        outline &&
          "text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.35)]",
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
          initial={reduced ? false : { y: 22, opacity: 0, filter: "blur(6px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={reduced ? undefined : { y: -18, opacity: 0, filter: "blur(4px)" }}
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
      gsap.set(avatar, { opacity: 0, y: 28, scale: 0.94 });

      tl.to(bgRef.current, { opacity: 1, duration: 0.7 }, 0)
        .to(
          creativeRef.current,
          { opacity: 1, scale: 1, duration: 1.1 },
          0.05,
        )
        .to(intro, { opacity: 1, y: 0, duration: 0.5, stagger: 0.07 }, 0.1)
        .to(avatar, { opacity: 1, y: 0, scale: 1, duration: 0.9 }, 0.15)
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
        .to(bgRef.current, { y: 110, ease: "none" }, 0)
        .to(
          q("[data-hero-copy]"),
          { y: 56, opacity: 0.12, filter: "blur(4px)", ease: "none" },
          0,
        )
        .to(
          creativeRef.current,
          { opacity: 0, scale: 1.18, y: 40, ease: "none" },
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
      className="relative flex h-[100svh] max-h-[100svh] min-h-[100svh] items-center overflow-hidden bg-surface-base pt-10 pb-6 min-[380px]:pt-12 min-[380px]:pb-8 md:pt-14 md:pb-10"
      aria-labelledby="hero-heading"
    >
      <div
        ref={bgRef}
        className="pointer-events-none absolute inset-0 will-change-transform"
        aria-hidden
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_70%_20%,color-mix(in_srgb,#7dd3fc_14%,transparent),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_15%_80%,color-mix(in_srgb,#ffffff_6%,transparent),transparent_55%)]" />
        <p
          ref={creativeRef}
          className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 select-none text-center text-[clamp(3.25rem,15vw,11rem)] font-bold tracking-tighter text-accent-cyan/[0.07] uppercase"
        >
          Creative
        </p>
      </div>

      <Container className="relative z-10 flex h-full w-full min-h-0 items-center">
        <div
          ref={contentRef}
          className="grid w-full min-h-0 items-center gap-5 will-change-transform lg:grid-cols-2 lg:gap-10 xl:gap-12"
        >
          <div
            data-hero-copy
            className="order-2 flex min-w-0 flex-col justify-center lg:order-1 lg:pr-2"
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
                  "font-bold tracking-[-0.03em] text-text-primary uppercase",
                  "text-[clamp(1.85rem,4.6vw,3.35rem)] leading-[1.02]",
                )}
              >
                <span className="block pr-1 drop-shadow-[0_0_28px_rgba(125,211,252,0.22)]">
                  <LetterName text={first} reduced={reduced} />
                </span>
                {last ? (
                  <span className="mt-0.5 block pr-1">
                    <LetterName text={last} outline reduced={reduced} />
                  </span>
                ) : null}
              </h1>
            </div>

            <div data-hero-intro>
              <AnimatedHeroRoles reduced={reduced} />
            </div>

            <HeroSummary reduced={reduced} />

            <div className="mt-5 flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row md:mt-6">
              <div data-hero-cta>
                <Button
                  className="w-full min-h-[44px] px-6 text-sm sm:w-auto md:min-h-[48px] md:text-base"
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

          <div
            data-hero-avatar
            className="order-1 mx-auto flex w-full max-w-[min(100%,240px)] items-center justify-center min-[350px]:max-w-[280px] sm:max-w-[320px] lg:order-2 lg:mx-0 lg:max-w-none lg:justify-end"
          >
            <div className="w-full max-h-[min(56svh,460px)] lg:max-h-[min(72svh,560px)]">
              {reduced ? (
                <AvatarVideoFrame
                  variant="hero"
                  src={site.heroAvatarVideo}
                  poster={site.heroAvatarPoster}
                  lazy={false}
                  objectPosition="50% 14%"
                />
              ) : (
                <AvatarSlot
                  id="hero"
                  className="mx-auto max-h-[min(56svh,460px)] lg:max-h-[min(72svh,560px)]"
                >
                  <div className="aspect-[4/5] max-h-[min(56svh,460px)] w-full lg:max-h-[min(72svh,560px)]" />
                </AvatarSlot>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
