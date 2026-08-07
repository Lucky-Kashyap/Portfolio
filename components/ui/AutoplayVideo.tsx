"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  claimVideoAudio,
  releaseVideoAudio,
  subscribeVideoAudio,
} from "@/lib/video-audio";
import { playAvatarSpeech, stopAvatarSpeech } from "@/lib/avatar-speech";

type AutoplayVideoProps = {
  src: string;
  poster?: string;
  className?: string;
  objectPosition?: string;
  seekTo?: number;
  lazy?: boolean;
  showMuteControl?: boolean;
  muteControlSide?: "left" | "right";
  /**
   * When true (default), unmute also plays Web Speech intro chapters.
   * Needed when the MP4 has no audio track (placeholders / GIF encodes).
   */
  speechOnUnmute?: boolean;
  /** Make the whole media surface toggle sound (not only the pill). */
  tapSurfaceUnmute?: boolean;
};

/**
 * Autoplay background video with tap-to-unmute.
 * Shared audio lock so only one video has sound at a time.
 */
export function AutoplayVideo({
  src,
  poster,
  className,
  objectPosition = "50% 50%",
  seekTo,
  lazy = true,
  showMuteControl = true,
  muteControlSide = "left",
  speechOnUnmute = true,
  tapSurfaceUnmute = true,
}: AutoplayVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const id = useId();
  const [muted, setMuted] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [failed, setFailed] = useState(false);
  const [hasEmbeddedAudio, setHasEmbeddedAudio] = useState(false);
  const speakingRef = useRef(false);

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
      await playAvatarSpeech();
      speakingRef.current = false;
      // Keep "Sound on" until user mutes — restart speech if they tap again later
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
        className={cn("size-full object-cover", className)}
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
        className="absolute inset-0 size-full object-cover"
        style={{ objectPosition }}
        onError={() => setFailed(true)}
      />

      {/* Soft vignette — keeps face readable without boxing the media */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,transparent_40%,rgba(0,0,0,0.35)_100%)]"
        aria-hidden
      />

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
            "absolute bottom-3 z-10 inline-flex items-center gap-2 rounded-full border border-white/20 bg-[rgba(11,18,32,0.78)] px-3 py-1.5 text-[11px] font-semibold tracking-wide text-white shadow-[0_8px_20px_rgba(0,0,0,0.35)] backdrop-blur-sm transition hover:border-accent-cyan/45 hover:bg-[rgba(11,18,32,0.92)]",
            muteControlSide === "right" ? "right-3" : "left-3",
            !muted && "border-accent-cyan/40 text-accent-cyan",
          )}
        >
          {muted ? <MuteIcon /> : <UnmuteIcon />}
          <span>{muted ? "Tap to unmute" : "Sound on"}</span>
        </button>
      ) : null}
    </div>
  );
}

function MuteIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M2 6.5h2.2L7.5 4v8L4.2 9.5H2V6.5Z" fill="currentColor" />
      <path
        d="M10 6.2 14.2 10.4M14.2 6.2 10 10.4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function UnmuteIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M2 6.5h2.2L7.5 4v8L4.2 9.5H2V6.5Z" fill="currentColor" />
      <path
        d="M9.5 6.2c.7.6 1.1 1.4 1.1 2.3s-.4 1.7-1.1 2.3M11.4 4.5c1.3 1.1 2.1 2.7 2.1 4.5s-.8 3.4-2.1 4.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
