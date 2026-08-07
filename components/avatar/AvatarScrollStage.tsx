"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useGSAP } from "@gsap/react";
import { AutoplayVideo } from "@/components/ui/AutoplayVideo";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { site } from "@/lib/content";
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

/**
 * One shared AutoplayVideo (never unmounted during morph).
 * Portaled to body for Lenis; Hero → About with identical aspect slots.
 * Slot posters stay invisible during morph so the avatar never doubles.
 */
export function AvatarScrollStage() {
  const reduced = usePrefersReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useGSAP(
    () => {
      if (reduced || !mounted) return;
      registerGsap();

      const hero = document.querySelector('[data-avatar-slot="hero"]');
      const about = document.querySelector('[data-avatar-slot="about"]');
      const range = document.querySelector("[data-avatar-scroll-range]");
      const frame = frameRef.current;
      const caption = captionRef.current;
      const aboutPoster = document.querySelector(
        '[data-avatar-slot-poster="about"]',
      ) as HTMLElement | null;
      const heroPoster = document.querySelector(
        '[data-avatar-slot-poster="hero"]',
      ) as HTMLElement | null;

      if (!hero || !about || !range || !frame) return;

      // Layout-only targets — never show a second face under the floating video
      if (heroPoster) gsap.set(heroPoster, { opacity: 0 });
      if (aboutPoster) gsap.set(aboutPoster, { opacity: 0 });

      let lastP = -1;

      const setAboutPoster = (visible: boolean) => {
        if (!aboutPoster) return;
        gsap.to(aboutPoster, {
          opacity: visible ? 1 : 0,
          duration: 0.2,
          overwrite: "auto",
        });
      };

      const apply = (raw?: number) => {
        const p = easeInOutCubic(
          gsap.utils.clamp(0, 1, raw ?? progressRef.current),
        );
        progressRef.current = p;

        const from = hero.getBoundingClientRect();
        const to = about.getBoundingClientRect();
        if (from.width < 4 || to.width < 4) return;

        if (Math.abs(p - lastP) < 0.001 && raw === undefined && p < 0.995) {
          return;
        }
        lastP = p;

        // Keep slot posters hidden while floating video is the source of truth
        if (p < 0.98) setAboutPoster(false);

        gsap.set(frame, {
          top: roundPx(lerp(from.top, to.top, p)),
          left: roundPx(lerp(from.left, to.left, p)),
          width: roundPx(lerp(from.width, to.width, p)),
          height: roundPx(lerp(from.height, to.height, p)),
          borderRadius: 16,
          opacity: 1,
          visibility: "visible",
          force3D: true,
        });

        if (caption) {
          caption.style.opacity = p > 0.88 ? "1" : "0";
        }
      };

      requestAnimationFrame(() => apply(0));

      // Morph finishes later — avatar parks in About when the section is in view
      const st = ScrollTrigger.create({
        trigger: range,
        start: "top top",
        endTrigger: about,
        end: "center center",
        scrub: 0.85,
        invalidateOnRefresh: true,
        onUpdate: (self) => apply(self.progress),
        onLeave: () => apply(1),
        onLeaveBack: () => apply(0),
        onRefresh: (self) => apply(self.progress),
      });

      const stick = ScrollTrigger.create({
        trigger: about,
        start: "center center",
        end: "bottom+=60 top",
        onUpdate: () => {
          if (progressRef.current >= 0.995) apply(1);
        },
      });

      const hideSt = ScrollTrigger.create({
        trigger: about,
        start: "bottom+=10 top",
        onEnter: () => {
          gsap.to(frame, { opacity: 0, duration: 0.2, overwrite: "auto" });
          setAboutPoster(true);
        },
        onLeaveBack: () => {
          setAboutPoster(false);
          apply(1);
          gsap.to(frame, { opacity: 1, duration: 0.15, overwrite: "auto" });
        },
      });

      const refresh = () => {
        ScrollTrigger.refresh();
        apply(st.progress);
      };
      window.addEventListener("portfolio:ready", refresh);
      window.addEventListener("resize", refresh);
      const t1 = window.setTimeout(refresh, 150);
      const t2 = window.setTimeout(refresh, 700);

      return () => {
        window.clearTimeout(t1);
        window.clearTimeout(t2);
        st.kill();
        stick.kill();
        hideSt.kill();
        window.removeEventListener("portfolio:ready", refresh);
        window.removeEventListener("resize", refresh);
      };
    },
    { dependencies: [reduced, mounted] },
  );

  if (reduced || !mounted) return null;

  return createPortal(
    <div
      ref={frameRef}
      className={cn(
        "pointer-events-auto fixed z-[45] overflow-hidden",
        "border border-white/14 bg-[#070b12]",
        "shadow-[0_28px_70px_rgba(0,0,0,0.55),0_0_0_1px_rgba(125,211,252,0.12)]",
        "will-change-[top,left,width,height,opacity]",
        "backface-hidden transform-gpu",
      )}
      style={{ top: 0, left: -9999, width: 1, height: 1, opacity: 0 }}
      data-avatar-floating
    >
      <AutoplayVideo
        src={site.heroAvatarVideo}
        poster={site.heroAvatarPoster}
        lazy={false}
        speechOnUnmute={false}
        tapSurfaceUnmute
        objectPosition={site.heroAvatarObjectPosition}
        muteControlSide="left"
        className="absolute inset-0 z-[2]"
      />

      <div
        ref={captionRef}
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] bg-[linear-gradient(180deg,transparent,rgba(8,12,20,0.95))] px-4 pb-3.5 pt-14 opacity-0 transition-opacity duration-300"
        aria-hidden
      >
        <p className="text-sm font-bold tracking-tight text-white uppercase md:text-base">
          Frontend Engineer
        </p>
      </div>
    </div>,
    document.body,
  );
}

/**
 * Layout target for the floating avatar.
 * Poster is hidden during morph (no double face); About poster fades in only
 * after the floating video leaves the section.
 */
export function AvatarSlot({
  id,
  className,
  children,
}: {
  id: "hero" | "about";
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      data-avatar-slot={id}
      className={cn(
        "relative w-full overflow-hidden rounded-2xl border border-white/10 bg-[#070b12]",
        className,
      )}
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        data-avatar-slot-poster={id}
        src={site.heroAvatarPoster}
        alt=""
        className="absolute inset-0 size-full object-cover opacity-0"
        style={{ objectPosition: site.heroAvatarObjectPosition }}
        draggable={false}
      />
      {children ?? (
        <div className="relative aspect-[3/4] w-full max-h-[min(48svh,400px)]" />
      )}
    </div>
  );
}
