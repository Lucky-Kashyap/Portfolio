"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Volume2, VolumeX } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { site } from "@/lib/content";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/useMotionPrefs";
import { playAvatarSpeech, stopAvatarSpeech } from "@/lib/avatar-speech";

const Avatar3D = dynamic(
  () => import("@/components/motion/Avatar3D").then((m) => m.Avatar3D),
  { ssr: false },
);

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/**
 * Shared Three.js AI avatar portaled to `document.body` (Lenis-safe).
 * Morphs Hero → About; tap unmute plays Hindi intro.
 */
export function AvatarScrollStage() {
  const reduced = usePrefersReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const hiddenRef = useRef(false);
  const [mounted, setMounted] = useState(false);
  const [captionVisible, setCaptionVisible] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    hiddenRef.current = hidden;
  }, [hidden]);

  useEffect(() => {
    return () => stopAvatarSpeech();
  }, []);

  const toggleSpeech = () => {
    if (speaking) {
      stopAvatarSpeech();
      setSpeaking(false);
      return;
    }
    setSpeaking(true);
    void playAvatarSpeech().then(() => setSpeaking(false));
  };

  useGSAP(
    () => {
      if (reduced || !mounted) return;
      registerGsap();

      const hero = document.querySelector('[data-avatar-slot="hero"]');
      const about = document.querySelector('[data-avatar-slot="about"]');
      const range = document.querySelector("[data-avatar-scroll-range]");
      const frame = frameRef.current;
      if (!hero || !about || !range || !frame) return;

      const apply = (raw?: number) => {
        const p = easeInOutCubic(
          gsap.utils.clamp(0, 1, raw ?? progressRef.current),
        );
        progressRef.current = p;

        const from = hero.getBoundingClientRect();
        const to = about.getBoundingClientRect();
        if (from.width < 4 || to.width < 4) return;

        gsap.set(frame, {
          top: lerp(from.top, to.top, p),
          left: lerp(from.left, to.left, p),
          width: lerp(from.width, to.width, p),
          height: lerp(from.height, to.height, p),
          borderRadius: 16,
          opacity: hiddenRef.current ? 0 : 1,
          visibility: "visible",
        });

        setCaptionVisible((prev) => {
          const next = p > 0.75;
          return prev === next ? prev : next;
        });
      };

      requestAnimationFrame(() => apply(0));

      const st = ScrollTrigger.create({
        trigger: range,
        start: "top top",
        endTrigger: about,
        end: "top 30%",
        scrub: 0.55,
        invalidateOnRefresh: true,
        onUpdate: (self) => apply(self.progress),
        onLeave: () => apply(1),
        onLeaveBack: () => apply(0),
        onRefresh: (self) => apply(self.progress),
      });

      const stick = ScrollTrigger.create({
        trigger: about,
        start: "top 80%",
        end: "bottom top",
        onUpdate: () => {
          if (progressRef.current >= 0.98) apply(1);
        },
        onEnter: () => apply(Math.max(progressRef.current, 0.85)),
      });

      const hideSt = ScrollTrigger.create({
        trigger: about,
        start: "bottom top",
        onEnter: () => {
          setHidden(true);
          gsap.to(frame, { opacity: 0, duration: 0.2, overwrite: "auto" });
        },
        onLeaveBack: () => {
          setHidden(false);
          apply(1);
          gsap.to(frame, { opacity: 1, duration: 0.15, overwrite: "auto" });
        },
      });

      const ticker = () => {
        if (progressRef.current > 0.02 || progressRef.current >= 0.98) {
          apply();
        }
      };
      gsap.ticker.add(ticker);

      const refresh = () => {
        ScrollTrigger.refresh();
        apply(st.progress);
      };
      window.addEventListener("portfolio:ready", refresh);
      window.addEventListener("resize", refresh);
      window.setTimeout(refresh, 200);
      window.setTimeout(refresh, 800);

      return () => {
        gsap.ticker.remove(ticker);
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

  const faceUrl = site.aiAvatar3d ?? site.aiAvatar ?? site.heroAvatarPoster;

  return createPortal(
    <div
      ref={frameRef}
      className={cn(
        "pointer-events-auto fixed z-[45] overflow-hidden",
        "border border-white/14 bg-[#070b12]",
        "shadow-[0_28px_70px_rgba(0,0,0,0.55),0_0_0_1px_rgba(125,211,252,0.12)]",
        "will-change-[top,left,width,height]",
      )}
      style={{ top: 0, left: -9999, width: 1, height: 1, opacity: 0 }}
      data-avatar-floating
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={faceUrl}
        alt=""
        className="absolute inset-0 size-full object-cover opacity-80"
        style={{ objectPosition: "50% 12%" }}
        draggable={false}
      />

      {!hidden ? (
        <Avatar3D
          faceUrl={faceUrl}
          speaking={speaking}
          onActivate={toggleSpeech}
          className="z-[2]"
        />
      ) : null}

      <div
        className="pointer-events-none absolute inset-0 z-[3] bg-[radial-gradient(ellipse_at_50%_30%,transparent_35%,rgba(0,0,0,0.45)_100%)]"
        aria-hidden
      />

      <button
        type="button"
        onClick={toggleSpeech}
        data-cursor="hover"
        className={cn(
          "absolute bottom-3 z-20 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/55 px-3 py-1.5 text-[10px] font-semibold tracking-[0.12em] text-white uppercase backdrop-blur-md transition-colors duration-fast",
          captionVisible ? "right-3" : "left-3",
          speaking
            ? "border-accent-cyan/45 text-accent-cyan"
            : "hover:border-accent-cyan/40",
        )}
        aria-pressed={speaking}
        aria-label={speaking ? "Mute avatar" : "Unmute avatar intro"}
      >
        {speaking ? <Volume2 size={12} /> : <VolumeX size={12} />}
        <span>{speaking ? "Sound on" : "Tap to unmute"}</span>
      </button>

      {captionVisible ? (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] bg-[linear-gradient(180deg,transparent,rgba(8,12,20,0.95))] px-4 pb-3.5 pt-14"
          aria-hidden
        >
          <p className="text-sm font-bold tracking-tight text-white uppercase md:text-base">
            Frontend Engineer
          </p>
        </div>
      ) : null}
    </div>,
    document.body,
  );
}

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
      className={cn("relative w-full", className)}
      aria-hidden
    >
      {children ?? (
        <div
          className={cn(
            "w-full rounded-2xl",
            id === "hero" ? "aspect-[4/5]" : "aspect-[3/4]",
          )}
        />
      )}
    </div>
  );
}
