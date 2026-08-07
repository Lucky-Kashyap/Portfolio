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
import { setAvatarSpeechSection } from "@/lib/avatar-speech";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/useMotionPrefs";

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function roundPx(n: number) {
  return Math.round(n * 2) / 2;
}

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
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
 * One shared video morphs Hero → About.
 * Slots always show the poster underneath so there is never a blank card.
 * The floating video sits on top and moves with scroll.
 */
export function AvatarScrollStage() {
  const reduced = usePrefersReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);
  const heroRoleRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (reduced || !mounted) return;

    const hero = document.querySelector(
      '[data-avatar-slot="hero"]',
    ) as HTMLElement | null;
    const about = document.querySelector(
      '[data-avatar-slot="about"]',
    ) as HTMLElement | null;
    const frame = frameRef.current;
    const heroRole = heroRoleRef.current;
    const caption = captionRef.current;
    const aboutPoster = document.querySelector(
      '[data-avatar-slot-poster="about"]',
    ) as HTMLElement | null;
    const heroPoster = document.querySelector(
      '[data-avatar-slot-poster="hero"]',
    ) as HTMLElement | null;

    if (!hero || !about || !frame) return;

    // Posters always fill slots — never show empty card holes
    if (heroPoster) {
      heroPoster.style.opacity = "1";
      heroPoster.style.transition = "opacity 0.35s ease";
    }
    if (aboutPoster) {
      aboutPoster.style.opacity = "1";
      aboutPoster.style.transition = "opacity 0.35s ease";
    }

    let raf = 0;
    let running = true;
    let parkedPast = false;

    const place = (
      top: number,
      left: number,
      width: number,
      height: number,
      opacity: number,
    ) => {
      frame.style.transform = `translate3d(${roundPx(left)}px, ${roundPx(top)}px, 0)`;
      frame.style.width = `${roundPx(width)}px`;
      frame.style.height = `${roundPx(height)}px`;
      frame.style.opacity = String(opacity);
      frame.style.visibility = opacity > 0.02 ? "visible" : "hidden";
      frame.style.pointerEvents = opacity > 0.5 ? "auto" : "none";
    };

    // Park on hero immediately (no blank first frame)
    const boot = hero.getBoundingClientRect();
    if (boot.width > 4) {
      place(boot.top, boot.left, boot.width, boot.height, 1);
    }

    const update = () => {
      const from = hero.getBoundingClientRect();
      const to = about.getBoundingClientRect();
      if (from.width < 4 || to.width < 4) return;

      const vh = window.innerHeight || 1;

      // Morph while About travels through the viewport
      const startTop = vh * 0.85;
      const endTop = Math.min(vh * 0.28, 200);
      const raw = 1 - (to.top - endTop) / Math.max(1, startTop - endTop);
      const p = easeInOutCubic(clamp01(raw));

      // Scrolled fully past About — leave poster, fade floating video out
      if (to.bottom < vh * 0.08) {
        if (!parkedPast) {
          parkedPast = true;
          place(to.top, to.left, to.width, to.height, 0);
        }
        if (caption) caption.style.opacity = "0";
        if (heroRole) heroRole.style.opacity = "0";
        return;
      }

      parkedPast = false;

      const top = lerp(from.top, to.top, p);
      const left = lerp(from.left, to.left, p);
      const width = lerp(from.width, to.width, p);
      const height = lerp(from.height, to.height, p);

      // Keep video fully opaque while morphing — posters underneath prevent gaps
      place(top, left, width, height, 1);

      // Hero = English script; About = Hindi — never both
      setAvatarSpeechSection(p < 0.45 ? "hero" : "about");

      if (heroRole) {
        const roleOp = clamp01(1 - p / 0.45);
        heroRole.style.opacity = String(roleOp);
        heroRole.style.transform = `translateY(${(1 - roleOp) * 12}px)`;
      }

      if (caption) {
        const cap = clamp01((p - 0.7) / 0.25);
        caption.style.opacity = String(cap);
        caption.style.transform = `translateY(${(1 - cap) * 8}px)`;
      }

      // Softly dim the slot being left / entered so only one “face” reads
      if (heroPoster) {
        heroPoster.style.opacity = String(1 - p * 0.35);
      }
      if (aboutPoster) {
        aboutPoster.style.opacity = String(0.65 + p * 0.35);
      }
    };

    const loop = () => {
      if (!running) return;
      update();
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    window.addEventListener("portfolio:ready", update);
    window.addEventListener("resize", update);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("portfolio:ready", update);
      window.removeEventListener("resize", update);
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
          lazy={false}
          speechOnUnmute
          speechLocale="auto"
          tapSurfaceUnmute
          objectFit="cover"
          objectPosition={site.heroAvatarObjectPosition}
          muteControlSide="right"
          className="absolute inset-0 z-[2]"
        />

        {/* Warm rim + soft float mask — cinematic edge light */}
        <div
          className="pointer-events-none absolute inset-0 z-[3]"
          aria-hidden
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_78%_28%,rgba(232,196,124,0.22),transparent_58%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_18%_72%,rgba(125,211,252,0.1),transparent_55%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_48%,rgba(3,6,11,0.55)_100%)]" />
        </div>

        {/* Hero role overlay — fades as morph begins */}
        <div
          ref={heroRoleRef}
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[6] px-4 pb-5 pt-16 sm:px-5 sm:pb-6 md:px-6"
          aria-hidden
        >
          <FloatingHeroRole reduced={reduced} />
        </div>

        <div
          ref={captionRef}
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] bg-[linear-gradient(180deg,transparent_20%,rgba(3,6,11,0.9))] px-4 pb-4 pt-12 opacity-0"
          aria-hidden
        >
          <p className="text-sm font-bold tracking-tight text-white uppercase md:text-base">
            {site.heroHeadline}
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}

/** Measurement slot — always filled with poster so layout never looks blank. */
export function AvatarSlot({
  id,
  className,
  children,
}: {
  id: "hero" | "about";
  className?: string;
  children?: ReactNode;
}) {
  const isHero = id === "hero";

  return (
    <div
      data-avatar-slot={id}
      className={cn(
        "relative w-full overflow-hidden bg-transparent",
        isHero ? "rounded-[1.75rem]" : "rounded-2xl",
        className,
      )}
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        data-avatar-slot-poster={id}
        src={site.heroAvatarPoster}
        alt=""
        className={cn(
          "absolute inset-0 size-full object-cover",
          isHero ? "rounded-[1.75rem]" : "rounded-2xl",
        )}
        style={{ objectPosition: site.heroAvatarObjectPosition }}
        draggable={false}
      />
      {children ?? (
        <div className="relative aspect-[3/4] w-full lg:aspect-auto lg:h-full lg:min-h-[22rem]" />
      )}
    </div>
  );
}
