"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  claimVideoAudio,
  releaseVideoAudio,
  subscribeVideoAudio,
} from "@/lib/video-audio";

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
}: {
  src: string;
  poster?: string;
  className?: string;
  objectPosition?: string;
  seekTo?: number;
  lazy?: boolean;
  /** Decorative / non-interactive embeds can hide the unmute control. */
  showMuteControl?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const id = useId();
  const [muted, setMuted] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    setReduceMotion(!!reduce);
    if (reduce) return;

    const applySeek = () => {
      if (seekTo != null && el.currentTime < seekTo) el.currentTime = seekTo;
    };
    el.addEventListener("loadedmetadata", applySeek, { once: true });

    const remute = () => {
      setMuted(true);
      releaseVideoAudio(id);
    };

    if (!lazy) {
      el.play().catch(() => {});
      return () => {
        el.removeEventListener("loadedmetadata", applySeek);
        remute();
      };
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.play().catch(() => {});
          } else {
            el.pause();
            remute();
          }
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      el.removeEventListener("loadedmetadata", applySeek);
      remute();
    };
  }, [seekTo, lazy, id]);

  // Another video claimed audio — remute this one.
  useEffect(() => {
    return subscribeVideoAudio((activeId) => {
      if (activeId !== id) setMuted(true);
    });
  }, [id]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.muted = muted;
    el.defaultMuted = muted;
    if (!muted) {
      el.volume = 1;
      const play = el.play();
      if (play) play.catch(() => {});
    }
  }, [muted]);

  const toggleMute = () => {
    const el = ref.current;
    if (muted) {
      claimVideoAudio(id);
      if (el) {
        el.muted = false;
        el.defaultMuted = false;
        el.volume = 1;
        el.play().catch(() => {});
      }
      setMuted(false);
    } else {
      releaseVideoAudio(id);
      if (el) {
        el.muted = true;
        el.defaultMuted = true;
      }
      setMuted(true);
    }
  };

  if (reduceMotion) {
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
    <div className={cn("relative size-full overflow-hidden", className)}>
      <video
        ref={ref}
        src={src}
        poster={poster}
        muted={muted}
        loop
        playsInline
        preload={lazy ? "none" : "metadata"}
        className="absolute inset-0 size-full object-cover"
        style={{ objectPosition }}
      />
      {showMuteControl ? (
        <button
          type="button"
          onClick={toggleMute}
          aria-pressed={!muted}
          aria-label={muted ? "Unmute video" : "Mute video"}
          className="absolute bottom-3 left-3 z-10 inline-flex items-center gap-2 rounded-full border border-white/20 bg-[rgba(11,18,48,0.72)] px-3 py-1.5 text-[11px] font-semibold tracking-wide text-white shadow-[0_8px_20px_rgba(0,0,0,0.35)] backdrop-blur-sm transition hover:border-accent-cyan/50 hover:bg-[rgba(11,18,48,0.88)]"
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
