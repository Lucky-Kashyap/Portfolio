"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  claimVideoAudio,
  releaseVideoAudio,
  subscribeVideoAudio,
} from "@/lib/video-audio";
import {
  getAvatarSpeechLocale,
  playAvatarSpeech,
  stopAvatarSpeech,
  subscribeAvatarSpeechSection,
  type AvatarSpeechLocale,
} from "@/lib/avatar-speech";

type AutoplayVideoProps = {
  src: string;
  poster?: string;
  className?: string;
  objectPosition?: string;
  /** cover crops to fill; contain keeps full frame (no side cut) */
  objectFit?: "cover" | "contain";
  seekTo?: number;
  lazy?: boolean;
  showMuteControl?: boolean;
  muteControlSide?: "left" | "right";
  /**
   * When true (default), unmute also plays Web Speech intro chapters.
   * Needed when the MP4 has no audio track (placeholders / GIF encodes).
   */
  speechOnUnmute?: boolean;
  /**
   * Force locale, or `auto` to follow hero (en) / about (hi) from scroll morph.
   */
  speechLocale?: AvatarSpeechLocale | "auto";
  /** Make the whole media surface toggle sound (not only the pill). */
  tapSurfaceUnmute?: boolean;
};

/**
 * Autoplay background video with tap-to-unmute.
 * Shared audio lock so only one video / speech track runs at a time.
 */
export function AutoplayVideo({
  src,
  poster,
  className,
  objectPosition = "50% 50%",
  objectFit = "cover",
  seekTo,
  lazy = true,
  showMuteControl = true,
  muteControlSide = "left",
  speechOnUnmute = true,
  speechLocale = "auto",
  tapSurfaceUnmute = true,
}: AutoplayVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const id = useId();
  const [muted, setMuted] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [failed, setFailed] = useState(false);
  const [hasEmbeddedAudio, setHasEmbeddedAudio] = useState(false);
  const speakingRef = useRef(false);
  const speechLocaleRef = useRef(speechLocale);
  speechLocaleRef.current = speechLocale;

  const resolveLocale = (): AvatarSpeechLocale => {
    const pref = speechLocaleRef.current;
    if (pref === "en" || pref === "hi") return pref;
    return getAvatarSpeechLocale();
  };

  const remuteAll = () => {
    const el = ref.current;
    setMuted(true);
    if (el) {
      el.muted = true;
      el.defaultMuted = true;
    }
    if (speakingRef.current) {
      stopAvatarSpeech();
      speakingRef.current = false;
    }
    releaseVideoAudio(id);
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    setReduceMotion(!!reduce);
    if (reduce) return;

    el.muted = true;
    el.defaultMuted = true;

    const onMeta = () => {
      if (seekTo != null && el.currentTime < seekTo) el.currentTime = seekTo;
      // Best-effort: detect audio track (Chromium / Firefox quirks)
      const anyEl = el as HTMLVideoElement & {
        mozHasAudio?: boolean;
        webkitAudioDecodedByteCount?: number;
        audioTracks?: { length: number };
      };
      const detected =
        (anyEl.audioTracks && anyEl.audioTracks.length > 0) ||
        anyEl.mozHasAudio === true ||
        (typeof anyEl.webkitAudioDecodedByteCount === "number" &&
          anyEl.webkitAudioDecodedByteCount > 0);
      if (detected) setHasEmbeddedAudio(true);
    };
    el.addEventListener("loadedmetadata", onMeta);

    if (!lazy) {
      el.play().catch(() => {});
      return () => {
        el.removeEventListener("loadedmetadata", onMeta);
        remuteAll();
      };
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.play().catch(() => {});
          } else {
            el.pause();
            remuteAll();
          }
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      el.removeEventListener("loadedmetadata", onMeta);
      remuteAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seekTo, lazy, id, src]);

  useEffect(() => {
    return subscribeVideoAudio((activeId) => {
      if (activeId !== id && activeId !== null) {
        remuteAll();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Hero ↔ About language switch — stop English/Hindi so they never overlap
  useEffect(() => {
    if (speechLocale !== "auto") return;
    let last = getAvatarSpeechLocale();
    return subscribeAvatarSpeechSection((locale) => {
      if (locale === last) return;
      last = locale;
      remuteAll();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speechLocale, id]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.muted = muted;
    el.defaultMuted = muted;
    if (!muted) {
      el.volume = 1;
      el.play().catch(() => {});
    }
  }, [muted]);

  const unmute = async () => {
    const el = ref.current;
    // Stop any other narration before starting this one
    stopAvatarSpeech();
    claimVideoAudio(id);
    setMuted(false);

    if (el) {
      el.muted = false;
      el.defaultMuted = false;
      el.volume = 1;
      el.currentTime = 0;
      el.play().catch(() => {});
    }

    const shouldSpeak = speechOnUnmute && !hasEmbeddedAudio;
    if (shouldSpeak) {
      speakingRef.current = true;
      await playAvatarSpeech(resolveLocale());
      speakingRef.current = false;
    }
  };

  const toggleMute = () => {
    if (muted) {
      void unmute();
    } else {
      remuteAll();
    }
  };

  if (reduceMotion || failed) {
    return poster ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={poster}
        alt=""
        className={cn(
          "size-full",
          objectFit === "contain" ? "object-contain" : "object-cover",
          className,
        )}
        style={{ objectPosition }}
      />
    ) : null;
  }

  return (
    <div
      className={cn(
        "relative size-full overflow-hidden",
        tapSurfaceUnmute && "cursor-pointer",
        className,
      )}
      onClick={tapSurfaceUnmute ? toggleMute : undefined}
      onKeyDown={
        tapSurfaceUnmute
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleMute();
              }
            }
          : undefined
      }
      role={tapSurfaceUnmute ? "button" : undefined}
      tabIndex={tapSurfaceUnmute ? 0 : undefined}
      aria-label={
        tapSurfaceUnmute
          ? muted
            ? "Play avatar introduction with sound"
            : "Mute avatar"
          : undefined
      }
    >
      <video
        ref={ref}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload={lazy ? "none" : "metadata"}
        className={cn(
          "absolute inset-0 size-full",
          objectFit === "contain" ? "object-contain" : "object-cover",
        )}
        style={{ objectPosition }}
        onError={() => setFailed(true)}
      />

      {/* Soft vignette only when cover-cropped */}
      {objectFit === "cover" ? (
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,transparent_40%,rgba(0,0,0,0.35)_100%)]"
          aria-hidden
        />
      ) : null}

      {showMuteControl ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleMute();
          }}
          aria-pressed={!muted}
          aria-label={muted ? "Unmute video" : "Mute video"}
          className={cn(
            "absolute top-3 z-10 inline-flex items-center gap-2 rounded-full border border-white/20 bg-[rgba(11,18,32,0.78)] px-3 py-1.5 text-[11px] font-semibold tracking-wide text-white shadow-[0_8px_20px_rgba(0,0,0,0.35)] backdrop-blur-sm transition hover:border-accent-cyan/45 hover:bg-[rgba(11,18,32,0.92)]",
            muteControlSide === "right" ? "right-3" : "left-3",
            !muted && "border-accent-cyan/40 text-accent-cyan",
          )}
        >
          {muted ? <PlayIcon /> : <PauseIcon />}
          <span>{muted ? "Tap to unmute" : "Sound on"}</span>
        </button>
      ) : null}
    </div>
  );
}

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M5 3.6v8.8l7.2-4.4L5 3.6Z" fill="currentColor" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M4.5 3.5h2.4v9H4.5v-9Zm4.6 0h2.4v9H9.1v-9Z" fill="currentColor" />
    </svg>
  );
}
