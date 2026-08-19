"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  claimVideoAudio,
  releaseVideoAudio,
  subscribeVideoAudio,
} from "@/lib/video-audio";

type AutoplayVideoProps = {
  src: string;
  poster?: string;
  className?: string;
  objectPosition?: string;
  /** cover crops to fill; contain keeps full frame (no side cut) */
  objectFit?: "cover" | "contain";
  lazy?: boolean;
  showMuteControl?: boolean;
  muteControlSide?: "left" | "right";
  /** Whole media surface toggles play (not only the icon). */
  tapSurfaceUnmute?: boolean;
};

/**
 * Autoplay muted video. Play icon unmutes / activates — only one instance
 * active at a time (shared audio lock).
 */
export function AutoplayVideo({
  src,
  poster,
  className,
  objectPosition = "50% 50%",
  objectFit = "cover",
  lazy = true,
  showMuteControl = true,
  muteControlSide = "left",
  tapSurfaceUnmute = true,
}: AutoplayVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const id = useId();
  const [active, setActive] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [failed, setFailed] = useState(false);
  const userPausedRef = useRef(false);

  const muteAmbient = () => {
    const el = ref.current;
    setActive(false);
    if (el) {
      el.muted = true;
      el.defaultMuted = true;
      el.volume = 0;
      el.loop = true;
    }
    releaseVideoAudio(id);
  };

  const pause = () => {
    const el = ref.current;
    userPausedRef.current = true;
    setActive(false);
    if (el) {
      el.pause();
      el.muted = true;
      el.defaultMuted = true;
      el.volume = 0;
    }
    releaseVideoAudio(id);
  };

  const play = () => {
    const el = ref.current;
    userPausedRef.current = false;
    claimVideoAudio(id);
    setActive(true);
    if (el) {
      el.muted = false;
      el.defaultMuted = false;
      el.volume = 1;
      el.loop = false;
      el.currentTime = 0;
      el.play().catch(() => {});
    }
  };

  const toggle = () => {
    if (active) pause();
    else play();
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

    if (!lazy) {
      el.play().catch(() => {});
      return () => {
        muteAmbient();
      };
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            if (!userPausedRef.current) {
              el.muted = true;
              el.loop = true;
              el.play().catch(() => {});
            }
          } else {
            el.pause();
            muteAmbient();
          }
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      muteAmbient();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lazy, id, src]);

  useEffect(() => {
    return subscribeVideoAudio((activeId) => {
      if (activeId !== id && activeId !== null) {
        // Another video took audio — mute us, keep ambient motion
        muteAmbient();
        const el = ref.current;
        if (el && !userPausedRef.current && el.paused) {
          el.loop = true;
          el.play().catch(() => {});
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (active) {
      el.muted = false;
      el.defaultMuted = false;
      el.volume = 1;
      el.loop = false;
      el.play().catch(() => {});
      const onEnded = () => {
        userPausedRef.current = false;
        muteAmbient();
        el.currentTime = 0;
        el.play().catch(() => {});
      };
      el.addEventListener("ended", onEnded);
      return () => el.removeEventListener("ended", onEnded);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

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
      onClick={tapSurfaceUnmute ? toggle : undefined}
      onKeyDown={
        tapSurfaceUnmute
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggle();
              }
            }
          : undefined
      }
      role={tapSurfaceUnmute ? "button" : undefined}
      tabIndex={tapSurfaceUnmute ? 0 : undefined}
      aria-label={
        tapSurfaceUnmute
          ? active
            ? "Pause avatar video"
            : "Play avatar video"
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
            toggle();
          }}
          aria-pressed={active}
          aria-label={active ? "Pause" : "Play"}
          title={active ? "Pause" : "Play"}
          className={cn(
            "absolute top-3 z-10 inline-flex size-9 items-center justify-center rounded-full border border-white/20 bg-[rgba(11,18,32,0.78)] text-white shadow-[0_8px_20px_rgba(0,0,0,0.35)] backdrop-blur-sm transition hover:border-accent-cyan/45 hover:bg-[rgba(11,18,32,0.92)] sm:size-10",
            muteControlSide === "right" ? "right-3" : "left-3",
            active && "border-accent-cyan/40 text-accent-cyan",
          )}
        >
          {active ? <PauseIcon /> : <PlayIcon />}
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
      <path
        d="M4.5 3.5h2.4v9H4.5v-9Zm4.6 0h2.4v9H9.1v-9Z"
        fill="currentColor"
      />
    </svg>
  );
}
