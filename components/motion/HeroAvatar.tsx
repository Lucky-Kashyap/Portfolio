"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { AutoplayVideo } from "@/components/ui/AutoplayVideo";
import { AvatarCanvas } from "@/components/motion/AvatarCanvas";
import { site } from "@/lib/content";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/useMotionPrefs";
import { useIsCompactViewport } from "@/hooks/useMediaQuery";

const Avatar3D = dynamic(
  () => import("@/components/motion/Avatar3D").then((m) => m.Avatar3D),
  { ssr: false },
);

type HeroAvatarProps = {
  className?: string;
  /** Fit first viewport — shorter frame, no idle tip bar */
  compact?: boolean;
};

type Chapter = (typeof site.avatarIntroChapters)[number];

function pickVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => /en-IN/i.test(v.lang)) ||
    voices.find(
      (v) =>
        /en-GB|en-US/i.test(v.lang) &&
        /male|david|ravi|google|neural|natural/i.test(v.name),
    ) ||
    voices.find((v) => /^en/i.test(v.lang)) ||
    null
  );
}

export function HeroAvatar({ className, compact = false }: HeroAvatarProps) {
  const [speaking, setSpeaking] = useState(false);
  const [chapterIndex, setChapterIndex] = useState(0);
  const [caption, setCaption] = useState("");
  const [chapterLabel, setChapterLabel] = useState("");
  const [progress, setProgress] = useState(0);
  const [roleIndex, setRoleIndex] = useState(0);
  const reduced = usePrefersReducedMotion();
  const compactViewport = useIsCompactViewport();
  const hasVideo = site.avatarVideoEnabled;
  /** Skip WebGL only on very small phones — shader portrait is lightweight */
  const use3d =
    site.aiAvatar3dEnabled && !reduced && !hasVideo && !compactViewport;
  const useGif =
    !use3d && site.aiAvatarGifEnabled && !reduced && !hasVideo;
  const roles = site.heroRoles?.length ? [...site.heroRoles] : [site.heroHeadline];
  const activeRole = roles[roleIndex % roles.length];
  const poster3d = site.aiAvatar3d ?? site.aiAvatar;
  const poster = site.aiAvatar;
  const chapters = site.avatarIntroChapters;
  const cancelRef = useRef(false);
  const progressTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      cancelRef.current = true;
      window.speechSynthesis?.cancel();
      if (progressTimer.current) window.clearInterval(progressTimer.current);
    };
  }, []);

  useEffect(() => {
    if (reduced || roles.length < 2 || speaking) return;
    const id = window.setInterval(() => {
      setRoleIndex((i) => (i + 1) % roles.length);
    }, 3200);
    return () => window.clearInterval(id);
  }, [reduced, roles.length, speaking]);

  const clearProgressTimer = () => {
    if (progressTimer.current) {
      window.clearInterval(progressTimer.current);
      progressTimer.current = null;
    }
  };

  const stopSpeech = () => {
    cancelRef.current = true;
    window.speechSynthesis?.cancel();
    clearProgressTimer();
    setSpeaking(false);
    setCaption("");
    setChapterLabel("");
    setProgress(0);
    setChapterIndex(0);
  };

  const speakChapter = (index: number, voice: SpeechSynthesisVoice | null) => {
    if (cancelRef.current || index >= chapters.length) {
      clearProgressTimer();
      setSpeaking(false);
      setCaption("");
      setChapterLabel("");
      setProgress(1);
      window.setTimeout(() => setProgress(0), 600);
      return;
    }

    const chapter: Chapter = chapters[index];
    setChapterIndex(index);
    setChapterLabel(chapter.label);
    setCaption(chapter.text);
    setProgress(index / chapters.length);

    const utterance = new SpeechSynthesisUtterance(chapter.text);
    utterance.rate = 1.02;
    utterance.pitch = 1;
    utterance.lang = "en-IN";
    if (voice) utterance.voice = voice;

    // Estimate progress within chapter for the progress bar
    const estimatedMs = Math.max(2800, chapter.text.split(/\s+/).length * 380);
    const started = performance.now();
    clearProgressTimer();
    progressTimer.current = window.setInterval(() => {
      const local = Math.min(1, (performance.now() - started) / estimatedMs);
      const overall = (index + local) / chapters.length;
      setProgress(overall);
    }, 80);

    utterance.onend = () => {
      if (cancelRef.current) return;
      speakChapter(index + 1, voice);
    };
    utterance.onerror = () => {
      if (cancelRef.current) return;
      stopSpeech();
    };

    window.speechSynthesis.speak(utterance);
  };

  const playSpeechIntro = () => {
    if (reduced || typeof window === "undefined" || !window.speechSynthesis) {
      return;
    }

    cancelRef.current = false;
    window.speechSynthesis.cancel();
    setSpeaking(true);
    setProgress(0);

    const start = () => {
      const voice = pickVoice();
      speakChapter(0, voice);
    };

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.addEventListener("voiceschanged", start, {
        once: true,
      });
      window.setTimeout(start, 280);
      return;
    }

    start();
  };

  const onStillActivate = () => {
    if (speaking) {
      stopSpeech();
      return;
    }
    playSpeechIntro();
  };

  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-full",
        compact && "flex h-full max-h-full items-center justify-center",
        className,
      )}
    >
      <div
        className={cn(
          "group relative block w-full max-h-full overflow-hidden text-left outline-none transition-[box-shadow] duration-fast",
          use3d
            ? "rounded-none bg-transparent shadow-none"
            : "rounded-md bg-[#0c1118] shadow-accent-lg hover:shadow-[0_0_0_1px_rgba(125,211,252,0.35)]",
        )}
      >
        <div
          className={cn(
            "relative w-full",
            compact
              ? "aspect-[3/4] max-h-[min(56svh,460px)] lg:max-h-[min(72svh,560px)]"
              : "aspect-[4/5] sm:aspect-[3/4]",
          )}
        >
          {!use3d ? (
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,#152033_0%,#0c1118_70%)]"
              aria-hidden
            />
          ) : null}

          {hasVideo ? (
            <AutoplayVideo
              src={site.avatarVideo}
              poster={poster}
              lazy={false}
              objectPosition="center 12%"
              className="absolute inset-0"
            />
          ) : (
            <button
              type="button"
              onClick={onStillActivate}
              data-cursor="hover"
              aria-pressed={speaking}
              aria-label={
                speaking
                  ? "Stop AI frontend introduction"
                  : "Play AI introduction — frontend development and services"
              }
              title={
                speaking
                  ? "Click to stop intro"
                  : "Click to hear AI intro about frontend & services"
              }
              className="absolute inset-0 block size-full text-left outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan/60 focus-visible:ring-inset"
            >
              <div className="absolute inset-0 overflow-hidden">
                {use3d ? (
                  <Avatar3D faceUrl={poster3d} speaking={speaking} />
                ) : useGif ? (
                  <AvatarCanvas
                    src={site.aiAvatarGif}
                    poster={poster}
                    focusY={0.08}
                  />
                ) : (
                  <Image
                    src={poster}
                    alt="Divyanshu Kashyap realistic AI avatar waving — Frontend Engineer specializing in React and Next.js"
                    fill
                    priority
                    sizes="(max-width: 1024px) 90vw, 50vw"
                    className={cn(
                      "object-cover object-[center_10%] transition-transform duration-slow",
                      speaking && !reduced && "scale-[1.03]",
                    )}
                  />
                )}
              </div>

              {!useGif && !use3d ? (
                <div
                  className={cn(
                    "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_40%_25%,rgba(125,211,252,0.16),transparent_55%)]",
                    !reduced && "animate-avatar-glow-pulse",
                  )}
                  aria-hidden
                />
              ) : null}

              {/* Talking pulse when AI intro is playing */}
              {speaking && !reduced ? (
                <motion.div
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(125,211,252,0.2),transparent_50%)]"
                  aria-hidden
                  animate={{ opacity: [0.25, 0.7, 0.25] }}
                  transition={{
                    duration: 0.9,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ) : null}

              <span
                className={cn(
                  "absolute top-3 right-3 z-10 inline-flex size-8 items-center justify-center rounded-full border border-white/15 bg-black/45 text-text-primary backdrop-blur-sm transition-opacity duration-fast md:top-4 md:right-4 md:size-9",
                  speaking
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100",
                )}
                aria-hidden
              >
                {speaking ? (
                  <Pause size={14} />
                ) : (
                  <Play size={14} className="ml-0.5" />
                )}
              </span>

              {/* Chapter chips while playing */}
              {speaking ? (
                <div className="absolute top-3 left-3 z-10 flex max-w-[70%] flex-wrap gap-1.5 md:top-4 md:left-4">
                  {chapters.map((ch, i) => (
                    <span
                      key={ch.id}
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-[9px] font-semibold tracking-[0.12em] uppercase backdrop-blur-sm",
                        i === chapterIndex
                          ? "border-accent-cyan/50 bg-accent-cyan/20 text-accent-cyan"
                          : i < chapterIndex
                            ? "border-white/15 bg-black/40 text-text-secondary"
                            : "border-white/10 bg-black/30 text-text-tertiary",
                      )}
                    >
                      {ch.label}
                    </span>
                  ))}
                </div>
              ) : null}
            </button>
          )}

          {!use3d ? (
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black via-black/55 to-transparent"
              aria-hidden
            />
          ) : (
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-surface-base/80 to-transparent"
              aria-hidden
            />
          )}

          {/* Non-compact: rotating role on the media */}
          {!speaking && !compact ? (
            <div className="pointer-events-none absolute bottom-3 left-3 right-3 z-10 md:bottom-4 md:left-4 md:right-4">
              <AnimatePresence mode="wait">
                <motion.p
                  key={activeRole}
                  initial={reduced ? false : { y: 18, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={reduced ? undefined : { y: -14, opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="font-bold tracking-tight text-text-primary uppercase text-xl md:text-2xl lg:text-3xl"
                  aria-live="polite"
                >
                  {activeRole}
                </motion.p>
              </AnimatePresence>
            </div>
          ) : null}

          {/* Speaking: caption + progress inside frame */}
          {speaking ? (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-3 pb-3 pt-10 md:px-4 md:pb-4">
              <div className="rounded-sm border border-white/10 bg-black/70 px-3 py-2.5 backdrop-blur-md">
                <p className="text-[10px] font-semibold tracking-[0.16em] text-accent-cyan uppercase">
                  {chapterLabel || "AI intro"}
                </p>
                {caption ? (
                  <p className="mt-1 line-clamp-2 text-xs leading-snug text-text-secondary md:text-sm">
                    {caption}
                  </p>
                ) : null}
              </div>
              <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-white/10" aria-hidden>
                <motion.div
                  className="h-full rounded-full bg-accent-cyan"
                  style={{ width: `${Math.round(progress * 100)}%` }}
                />
              </div>
            </div>
          ) : null}
        </div>

        {/* Full caption only when not compact (enough vertical room) */}
        {caption && !compact ? (
          <div
            className="border-t border-border-muted bg-surface-base/95 px-4 py-3"
            role="status"
            aria-live="polite"
          >
            <p className="text-[10px] font-semibold tracking-[0.16em] text-accent-cyan uppercase">
              {chapterLabel || "Speaking"}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
              {caption}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
