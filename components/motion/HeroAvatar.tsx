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
  const useGif = site.aiAvatarGifEnabled && !reduced && !hasVideo;
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
      : "Play spoken introduction from avatar";

  return (
    <div className={cn("relative mx-auto w-full max-w-full", className)}>
      <button
        type="button"
        onClick={onAvatarActivate}
        data-cursor="hover"
        aria-pressed={isActive}
        aria-label={actionLabel}
        title={isActive ? "Click to stop intro" : "Click avatar to hear intro"}
        className="group relative block w-full overflow-hidden rounded-md bg-[#0c1118] text-left shadow-accent-lg outline-none transition-[box-shadow] duration-fast hover:shadow-[0_0_0_1px_rgba(125,211,252,0.35)] focus-visible:ring-2 focus-visible:ring-accent-cyan/60"
      >
        <div className="relative aspect-[4/5] w-full sm:aspect-[3/4]">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,#152033_0%,#0c1118_70%)]"
            aria-hidden
          />

          {hasVideo ? (
            <video
              ref={videoRef}
              className="absolute inset-0 size-full object-cover object-[center_18%]"
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
              {/*
                One intact portrait — no masked second layer.
                Fake CSS “hand wave” was rotating part of the face with the hand.
                Wave motion comes from the GIF (or a future intro.mp4).
              */}
              <Image
                src={useGif ? site.aiAvatarGif : site.aiAvatar}
                alt="Divyanshu Kashyap realistic AI avatar waving — Frontend Engineer specializing in React and Next.js"
                fill
                priority
                unoptimized={useGif}
                sizes="(max-width: 1024px) 90vw, 50vw"
                className={cn(
                  "object-cover object-[center_12%]",
                  speaking && !reduced && "scale-[1.015] transition-transform duration-slow",
                )}
              />

              {/* Blue shimmer — kept, sits above the portrait */}
              <div
                className={cn(
                  "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_40%_25%,rgba(125,211,252,0.16),transparent_55%)]",
                  !reduced && "animate-avatar-glow-pulse",
                )}
                aria-hidden
              />
              {!reduced ? (
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-1/5 animate-avatar-scan bg-gradient-to-b from-transparent via-accent-cyan/14 to-transparent"
                  aria-hidden
                />
              ) : null}
            </>
          )}

          <span
            className={cn(
              "absolute top-3 right-3 z-10 inline-flex size-8 items-center justify-center rounded-full border border-white/15 bg-black/45 text-text-primary backdrop-blur-sm transition-opacity duration-fast md:top-4 md:right-4 md:size-9",
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

          <div className="absolute bottom-4 left-3 right-3 z-10 min-h-[2.5rem] overflow-hidden md:bottom-5 md:left-4 md:right-4">
            <AnimatePresence mode="wait">
              <motion.p
                key={activeRole}
                initial={reduced ? false : { y: 18, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={reduced ? undefined : { y: -14, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="text-xl font-bold tracking-tight text-text-primary uppercase md:text-2xl lg:text-3xl"
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
