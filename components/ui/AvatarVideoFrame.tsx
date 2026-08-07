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
 * Bare avatar video plane — soft float, no hard card chrome.
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
        "group relative h-full w-full min-h-0 overflow-hidden bg-transparent",
        isHero ? "rounded-[1.75rem]" : "rounded-2xl",
        "aspect-[3/4] lg:aspect-auto",
        !isHero && className,
        isHero && cn("motion-reduce:animate-none", className),
      )}
    >
      <div
        className={cn(
          "absolute inset-0",
          isHero && "animate-avatar-idle-float motion-reduce:animate-none",
        )}
      >
        <AutoplayVideo
          src={src}
          poster={poster}
          lazy={lazy}
          speechOnUnmute
          speechLocale={isHero ? "en" : "hi"}
          tapSurfaceUnmute
          objectFit="cover"
          objectPosition={objectPosition ?? "50% 22%"}
          muteControlSide="right"
          className="absolute inset-0"
        />

        {isHero ? (
          <div
            className="pointer-events-none absolute inset-0 z-[3]"
            aria-hidden
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_78%_28%,rgba(232,196,124,0.2),transparent_58%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_48%,rgba(3,6,11,0.5)_100%)]" />
          </div>
        ) : null}

        {caption ? (
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] bg-[linear-gradient(180deg,transparent_10%,rgba(3,6,11,0.88))] px-4 pb-4 pt-14"
            aria-hidden
          >
            <p
              className={cn(
                "font-bold tracking-tight text-white uppercase",
                isHero
                  ? "font-display text-[clamp(1.25rem,3.2vw,2.25rem)] leading-[1.05]"
                  : "text-sm md:text-base",
              )}
            >
              {caption}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
