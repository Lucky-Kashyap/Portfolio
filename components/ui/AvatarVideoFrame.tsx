"use client";

import { AutoplayVideo } from "@/components/ui/AutoplayVideo";
import { cn } from "@/lib/utils";

type AvatarVideoFrameProps = {
  src: string;
  poster: string;
  objectPosition?: string;
  lazy?: boolean;
  caption?: string;
  className?: string;
};

/**
 * Reduced-motion hero avatar plane — soft float, no card chrome.
 * Play/pause only (shared video audio lock).
 */
export function AvatarVideoFrame({
  src,
  poster,
  objectPosition,
  lazy = true,
  caption,
  className,
}: AvatarVideoFrameProps) {
  return (
    <div
      className={cn(
        "group relative h-full w-full min-h-0 overflow-hidden bg-transparent",
        "rounded-[1.75rem] aspect-[3/4] lg:aspect-auto",
        className,
      )}
    >
      <div
        className={cn(
          "absolute inset-0",
          "animate-avatar-idle-float motion-reduce:animate-none",
        )}
      >
        <AutoplayVideo
          src={src}
          poster={poster}
          lazy={lazy}
          tapSurfaceUnmute
          objectFit="cover"
          objectPosition={objectPosition ?? "50% 22%"}
          muteControlSide="right"
          className="absolute inset-0"
        />

        <div
          className="pointer-events-none absolute inset-0 z-[3]"
          aria-hidden
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_78%_28%,rgba(232,196,124,0.2),transparent_58%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_18%_72%,rgba(125,211,252,0.1),transparent_55%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_48%,rgba(3,6,11,0.5)_100%)]" />
        </div>

        {caption ? (
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] bg-[linear-gradient(180deg,transparent_10%,rgba(3,6,11,0.88))] px-4 pb-4 pt-14"
            aria-hidden
          >
            <p className="font-display text-[clamp(1.25rem,3.2vw,2.25rem)] font-bold leading-[1.05] tracking-tight text-white uppercase">
              {caption}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
