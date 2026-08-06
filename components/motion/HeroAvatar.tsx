"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { site } from "@/lib/content";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/useMotionPrefs";

type HeroAvatarProps = {
  className?: string;
};

export function HeroAvatar({ className }: HeroAvatarProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [caption, setCaption] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const reduced = usePrefersReducedMotion();
  const hasVideo = site.avatarVideoEnabled;
  const roles = site.heroRoles?.length ? [...site.heroRoles] : [site.heroHeadline];
  const activeRole = roles[roleIndex % roles.length];

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  useEffect(() => {
    if (reduced || roles.length < 2) return;
    const id = window.setInterval(() => {
      setRoleIndex((i) => (i + 1) % roles.length);
    }, 3200);
    return () => window.clearInterval(id);
  }, [reduced, roles.length]);

  const stopSpeech = () => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
    setCaption("");
  };

  const playSpeechIntro = () => {
    if (reduced || typeof window === "undefined" || !window.speechSynthesis) {
      return;
    }

    stopSpeech();

    const speak = () => {
      const utterance = new SpeechSynthesisUtterance(site.avatarIntro);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.lang = "en-IN";

      const voices = window.speechSynthesis.getVoices();
      const preferred =
        voices.find((v) => /en-IN/i.test(v.lang)) ||
        voices.find(
          (v) =>
            /en-GB|en-US/i.test(v.lang) &&
            /male|david|ravi|google/i.test(v.name),
        ) ||
        voices.find((v) => /^en/i.test(v.lang));
      if (preferred) utterance.voice = preferred;

      utterance.onstart = () => {
        setSpeaking(true);
        setCaption(site.avatarIntro);
      };
      utterance.onend = () => {
        setSpeaking(false);
        setCaption("");
      };
      utterance.onerror = () => {
        setSpeaking(false);
        setCaption("");
      };

      window.speechSynthesis.speak(utterance);
    };

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.addEventListener("voiceschanged", speak, {
        once: true,
      });
      window.setTimeout(speak, 250);
      return;
    }

    speak();
  };

  const toggleVideo = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      try {
        await video.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  const onAvatarActivate = () => {
    if (hasVideo) {
      void toggleVideo();
      return;
    }
    if (speaking) {
      stopSpeech();
      return;
    }
    playSpeechIntro();
  };

  const isActive = hasVideo ? playing : speaking;
  const actionLabel = hasVideo
    ? playing
      ? "Pause avatar introduction video"
      : "Play avatar introduction video"
    : speaking
      ? "Stop spoken introduction"
      : "Play spoken introduction from AI avatar";

  return (
    <div className={cn("relative mx-auto w-full max-w-full", className)}>
      <button
        type="button"
        onClick={onAvatarActivate}
        data-cursor="hover"
        aria-pressed={isActive}
        aria-label={actionLabel}
        title={isActive ? "Click to stop intro" : "Click avatar to hear intro"}
        className="group relative block w-full overflow-hidden rounded-md bg-[#0c1118] text-left shadow-accent-lg outline-none transition-[box-shadow,transform] duration-fast hover:shadow-[0_0_0_1px_rgba(125,211,252,0.35)] focus-visible:ring-2 focus-visible:ring-accent-cyan/60"
      >
        <div className="relative aspect-[3/4] w-full">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,#152033_0%,#0c1118_70%)]"
            aria-hidden
          />
          {hasVideo ? (
            <video
              ref={videoRef}
              className="absolute inset-0 size-full object-cover object-top"
              poster={site.aiAvatar}
              playsInline
              preload="metadata"
              onEnded={() => setPlaying(false)}
              aria-hidden
            >
              <source src={site.avatarVideo} type="video/mp4" />
              <source src="/avatar/intro.webm" type="video/webm" />
            </video>
          ) : (
            <>
              <div
                className="absolute inset-0"
                style={{
                  clipPath:
                    "polygon(36% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 58%, 14% 57%, 40% 53%, 49% 36%, 46% 14%, 36% 4%)",
                }}
              >
                <Image
                  src={site.aiAvatar}
                  alt="Divyanshu Kashyap 3D AI avatar waving — Frontend Engineer specializing in React and Next.js"
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 420px"
                  className={cn(
                    "object-cover object-top transition-transform duration-slow",
                    speaking && !reduced && "scale-[1.015]",
                  )}
                />
              </div>

              <div
                className={cn(
                  "absolute inset-0 origin-[38%_46%] will-change-transform",
                  !reduced && "animate-avatar-hand-wave",
                )}
                style={{
                  clipPath:
                    "polygon(0% 5%, 35% 2%, 45% 11%, 49% 33%, 42% 52%, 14% 56%, 0% 48%)",
                }}
                aria-hidden
              >
                <Image
                  src={site.aiAvatar}
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 420px"
                  className="object-cover object-top drop-shadow-[0_0_16px_rgba(125,211,252,0.3)]"
                />
              </div>

              <div
                className={cn(
                  "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_35%_25%,rgba(125,211,252,0.18),transparent_52%)]",
                  !reduced && "animate-avatar-glow-pulse",
                )}
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.09] mix-blend-screen"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(125,211,252,0.45) 1px, transparent 1px)",
                  backgroundSize: "100% 5px",
                }}
                aria-hidden
              />
              {!reduced ? (
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-1/5 animate-avatar-scan bg-gradient-to-b from-transparent via-accent-cyan/18 to-transparent"
                  aria-hidden
                />
              ) : null}
              <div
                className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-accent-cyan/20 shadow-[inset_0_0_48px_rgba(125,211,252,0.12)]"
                aria-hidden
              />
            </>
          )}

          <p className="absolute top-4 left-4 z-10 rounded-xs border border-accent-cyan/35 bg-surface-base/80 px-3 py-1.5 text-[11px] font-medium tracking-[0.2em] text-accent-cyan uppercase backdrop-blur-sm">
            AI avatar
          </p>

          <span
            className={cn(
              "absolute top-4 right-4 z-10 inline-flex size-9 items-center justify-center rounded-full border border-white/15 bg-black/45 text-text-primary backdrop-blur-sm transition-opacity duration-fast",
              isActive
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100",
            )}
            aria-hidden
          >
            {isActive ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
          </span>

          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black via-black/55 to-transparent"
            aria-hidden
          />

          <div className="absolute bottom-5 left-4 right-4 z-10 min-h-[2.75rem] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={activeRole}
                initial={reduced ? false : { y: 22, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={reduced ? undefined : { y: -18, opacity: 0 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="text-2xl font-bold tracking-tight text-text-primary uppercase md:text-3xl"
                aria-live="polite"
              >
                {activeRole}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {(caption || (hasVideo && playing)) && (
          <div
            className="border-t border-border-muted bg-surface-base/90 px-4 py-3 text-sm leading-relaxed text-text-secondary"
            role="status"
            aria-live="polite"
          >
            {caption || site.avatarIntro}
          </div>
        )}
      </button>
    </div>
  );
}
