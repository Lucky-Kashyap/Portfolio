"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AutoplayVideo } from "@/components/ui/AutoplayVideo";
import { site } from "@/lib/content";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/useMotionPrefs";
import { onPortfolioReady } from "@/lib/boot";

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

function roundPx(n: number) {
  return Math.round(n * 2) / 2;
}

function FloatingHeroRole({ reduced }: { reduced: boolean }) {
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
    <div className="relative min-h-[1.15em] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.p
          key={active}
          initial={reduced ? false : { y: 18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduced ? undefined : { y: -14, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-[clamp(1.35rem,3.6vw,2.65rem)] font-bold leading-[1.05] tracking-tight text-white uppercase drop-shadow-[0_4px_24px_rgba(0,0,0,0.65)]"
        >
          {active}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

/**
 * Floating hero avatar — stays locked to the Hero slot and fades out on scroll.
 * About section has no AI avatar for now.
 */
export function AvatarScrollStage() {
  const reduced = usePrefersReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);
  const heroRoleRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (reduced || !mounted) return;

    const hero = document.querySelector(
      '[data-avatar-slot="hero"]',
    ) as HTMLElement | null;
    const frame = frameRef.current;
    const heroRole = heroRoleRef.current;
    const heroPoster = document.querySelector(
      '[data-avatar-slot-poster="hero"]',
    ) as HTMLElement | null;

    if (!hero || !frame) return;

    if (heroPoster) {
      heroPoster.style.opacity = "1";
      heroPoster.style.transition = "opacity 0.35s ease";
    }

    let raf = 0;

    const place = (
      top: number,
      left: number,
      width: number,
      height: number,
      opacity: number,
    ) => {
      // Clamp to the layout viewport so narrow phones never clip the frame
      const vw = window.innerWidth || width;
      const safeW = Math.min(Math.max(width, 0), vw);
      const safeL = Math.max(0, Math.min(left, vw - safeW));
      frame.style.transform = `translate3d(${roundPx(safeL)}px, ${roundPx(top)}px, 0)`;
      frame.style.width = `${roundPx(safeW)}px`;
      frame.style.height = `${roundPx(height)}px`;
      frame.style.opacity = String(opacity);
      frame.style.visibility = opacity > 0.02 ? "visible" : "hidden";
      frame.style.pointerEvents = opacity > 0.5 ? "auto" : "none";
    };

    const update = () => {
      raf = 0;
      const from = hero.getBoundingClientRect();
      if (from.width < 4) return;

      const vh = window.innerHeight || 1;
      // Fade out as hero leaves the viewport — no About morph
      const fadeStart = vh * 0.15;
      const fadeEnd = -from.height * 0.35;
      const fadeT = clamp01((from.bottom - fadeEnd) / (fadeStart - fadeEnd + from.height));
      const opacity = clamp01((from.bottom - fadeEnd) / Math.max(1, from.height * 0.55));

      place(from.top, from.left, from.width, from.height, opacity);

      if (heroRole) {
        heroRole.style.visibility = "visible";
        heroRole.style.opacity = String(Math.min(1, opacity * fadeT));
      }
      if (heroPoster) {
        heroPoster.style.opacity = "1";
      }
    };

    const schedule = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    const start = () => {
      const boot = hero.getBoundingClientRect();
      if (boot.width > 4) {
        place(boot.top, boot.left, boot.width, boot.height, 1);
      }
      schedule();
    };

    const stopReady = onPortfolioReady(start);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    const lenis = window.__lenis;
    lenis?.on("scroll", schedule);

    return () => {
      cancelAnimationFrame(raf);
      stopReady();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      lenis?.off("scroll", schedule);
    };
  }, [reduced, mounted]);

  if (reduced || !mounted) return null;

  return createPortal(
    <div
      ref={frameRef}
      className={cn(
        "pointer-events-auto fixed top-0 left-0 z-[45] overflow-hidden",
        "bg-transparent",
        "will-change-[transform,width,height,opacity]",
        "backface-hidden transform-gpu",
      )}
      style={{
        width: 1,
        height: 1,
        opacity: 0,
        borderRadius: 28,
      }}
      data-avatar-floating
    >
      <div className="absolute inset-0 animate-avatar-idle-float motion-reduce:animate-none">
        <AutoplayVideo
          src={site.heroAvatarVideo}
          poster={site.heroAvatarPoster}
          posterAlt={`${site.brand} — AI avatar video preview`}
          lazy={false}
          tapSurfaceUnmute
          objectFit="cover"
          objectPosition={site.heroAvatarObjectPosition}
          muteControlSide="right"
          className="absolute inset-0 z-[2]"
        />

        <div
          className="pointer-events-none absolute inset-0 z-[3]"
          aria-hidden
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_78%_28%,rgba(232,196,124,0.22),transparent_58%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_18%_72%,rgba(125,211,252,0.1),transparent_55%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_48%,rgba(3,6,11,0.55)_100%)]" />
        </div>

        <div
          ref={heroRoleRef}
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[6] px-4 pb-5 pt-16 sm:px-5 sm:pb-6 md:px-6"
          aria-hidden
        >
          <FloatingHeroRole reduced={reduced} />
        </div>
      </div>
    </div>,
    document.body,
  );
}

/** Hero measurement slot — poster underneath so layout never looks blank. */
export function AvatarSlot({
  id = "hero",
  className,
  children,
}: {
  id?: "hero";
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      data-avatar-slot={id}
      className={cn(
        "relative w-full overflow-hidden rounded-[1.75rem] bg-transparent",
        className,
      )}
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        data-avatar-slot-poster={id}
        src={site.heroAvatarPoster}
        alt={`${site.brand} — AI avatar portrait`}
        title={`${site.brand} — AI avatar portrait`}
        className="absolute inset-0 size-full rounded-[1.75rem] object-cover"
        style={{ objectPosition: site.heroAvatarObjectPosition }}
        draggable={false}
      />
      {children ?? (
        <div className="relative aspect-[3/4] w-full lg:aspect-auto lg:h-full lg:min-h-[22rem]" />
      )}
    </div>
  );
}
