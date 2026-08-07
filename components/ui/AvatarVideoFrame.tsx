"use client";

import { AutoplayVideo } from "@/components/ui/AutoplayVideo";
import { cn } from "@/lib/utils";

type AvatarVideoFrameProps = {
  src: string;
  poster: string;
  /** Hero large vs About portrait */
  variant?: "hero" | "about";
  objectPosition?: string;
  lazy?: boolean;
  caption?: string;
  className?: string;
};

/**
 * Polished portrait frame for marketing-style AI avatar videos.
 */
export function AvatarVideoFrame({
  src,
  poster,
  variant = "about",
  objectPosition,
  lazy = true,
  caption,
  className,
}: AvatarVideoFrameProps) {
  const isHero = variant === "hero";

  return (
    <div
      className={cn(
        "group relative w-full overflow-hidden",
        "rounded-2xl border border-white/14",
        "bg-[#0a1018]",
        "shadow-[0_28px_70px_rgba(0,0,0,0.55),0_0_0_1px_rgba(125,211,252,0.08)]",
        "transition-[box-shadow,transform] duration-500 ease-out",
        "hover:shadow-[0_32px_80px_rgba(0,0,0,0.6),0_0_0_1px_rgba(125,211,252,0.22)]",
        isHero ? "aspect-[4/5]" : "aspect-[3/4]",
        className,
      )}
    >
      {/* Atmosphere behind media */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_28%,rgba(125,211,252,0.14),transparent_55%)]"
        aria-hidden
      />

      <AutoplayVideo
        src={src}
        poster={poster}
        lazy={lazy}
        speechOnUnmute
        tapSurfaceUnmute
        objectPosition={objectPosition ?? (isHero ? "50% 14%" : "50% 12%")}
        muteControlSide={caption ? "right" : "left"}
        className="absolute inset-0"
      />

      {caption ? (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] bg-[linear-gradient(180deg,transparent,rgba(8,12,20,0.95))] px-4 pb-3.5 pt-14"
          aria-hidden
        >
          <p className="text-sm font-bold tracking-tight text-white uppercase md:text-base">
            {caption}
          </p>
        </div>
      ) : null}
    </div>
  );
}
