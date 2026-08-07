"use client";

import { useEffect, useState } from "react";
import { useLenis } from "lenis/react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { TextLink } from "@/components/ui";
import { Magnetic } from "@/components/motion/Magnetic";
import { site } from "@/lib/content";
import { scrollToTop } from "@/lib/scroll";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/useMotionPrefs";

function WhatsAppIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}

function updateScrollMetrics(
  scrollY: number,
  setProgress: (v: number) => void,
  setShowTop: (v: boolean) => void,
) {
  const doc = document.documentElement;
  const max = Math.max(1, doc.scrollHeight - window.innerHeight);
  const value = Math.min(1, Math.max(0, scrollY / max));
  setProgress(value);
  setShowTop(scrollY > Math.max(640, window.innerHeight * 0.85));
}

export function FloatingActions() {
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);
  const [ready, setReady] = useState(false);
  const reduced = usePrefersReducedMotion();
  const lenis = useLenis();

  useEffect(() => {
    if (reduced) {
      setReady(true);
      return;
    }
    const onReady = () => setReady(true);
    window.addEventListener("portfolio:ready", onReady);
    const fallback = window.setTimeout(() => setReady(true), 4500);
    return () => {
      window.removeEventListener("portfolio:ready", onReady);
      window.clearTimeout(fallback);
    };
  }, [reduced]);

  useEffect(() => {
    const onScroll = () => {
      updateScrollMetrics(window.scrollY, setProgress, setShowTop);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!lenis) return;
    const onLenisScroll = ({ scroll }: { scroll: number }) => {
      updateScrollMetrics(scroll, setProgress, setShowTop);
    };
    lenis.on("scroll", onLenisScroll);
    return () => {
      lenis.off("scroll", onLenisScroll);
    };
  }, [lenis]);

  const whatsapp =
    site.whatsapp ||
    (site.phone ? `https://wa.me/91${site.phone.replace(/\s/g, "")}` : "");

  const progressDeg = Math.round(progress * 360);

  return (
    <motion.div
      className="fixed right-3 bottom-3 z-50 flex flex-col items-end gap-3.5 md:right-4 md:bottom-4 md:gap-4"
      initial={reduced ? false : { opacity: 0, y: 20 }}
      animate={
        ready || reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
      }
      transition={{ duration: 0.55, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <AnimatePresence>
        {showTop ? (
          <motion.div
            key="scroll-top"
            initial={reduced ? false : { opacity: 0, scale: 0.85, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, scale: 0.85, y: 8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <Magnetic strength={0.4}>
              <button
                type="button"
                onClick={scrollToTop}
                aria-label="Back to top"
                data-cursor="hover"
                className="group/top relative inline-flex size-9 items-center justify-center rounded-full"
              >
                {/* Thin progress ring outside the face — conic, no SVG dash jitter */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -inset-[3px] rounded-full"
                  style={{
                    background: reduced
                      ? "color-mix(in srgb, #7dd3fc 50%, transparent)"
                      : `conic-gradient(from -90deg, #7dd3fc ${progressDeg}deg, color-mix(in srgb, #ffffff 12%, transparent) 0deg)`,
                    WebkitMask:
                      "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))",
                    mask: "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))",
                  }}
                />
                <span
                  className={cn(
                    "relative z-10 inline-flex size-9 items-center justify-center rounded-full border border-white/15 bg-surface-base/95 text-text-primary shadow-soft backdrop-blur-md",
                    "transition-[border-color,box-shadow] duration-fast",
                    "group-hover/top:border-accent-cyan/45 group-hover/top:shadow-[0_0_0_3px_rgba(125,211,252,0.1)]",
                  )}
                >
                  <ArrowUp
                    size={14}
                    strokeWidth={2.25}
                    aria-hidden
                    className={cn(
                      !reduced &&
                        "transition-transform duration-fast group-hover/top:-translate-y-0.5",
                    )}
                  />
                </span>
              </button>
            </Magnetic>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {whatsapp ? (
        <Magnetic strength={0.4}>
          <TextLink
            href={whatsapp}
            external
            variant="muted"
            data-cursor="hover"
            aria-label="Chat on WhatsApp"
            className={cn(
              "group/wa relative inline-flex size-9 items-center justify-center overflow-hidden rounded-full bg-[#25D366] text-white no-underline shadow-soft",
              "transition-[box-shadow,background-color,width,padding] duration-normal ease-[cubic-bezier(0.22,1,0.36,1)]",
              "hover:w-auto hover:bg-[#1ebe57] hover:pr-3 hover:pl-1",
              "hover:shadow-[0_0_0_3px_rgba(37,211,102,0.18),0_6px_16px_rgba(37,211,102,0.28)]",
            )}
          >
            {!reduced ? (
              <span
                className="pointer-events-none absolute inset-0 rounded-full opacity-0 group-hover/wa:animate-wa-ping"
                aria-hidden
              />
            ) : null}

            <span className="relative z-10 inline-flex size-9 shrink-0 items-center justify-center">
              <span
                className={cn(
                  "inline-flex",
                  !reduced && "group-hover/wa:animate-wa-wiggle",
                )}
              >
                <WhatsAppIcon size={15} />
              </span>
            </span>

            <span
              className={cn(
                "relative z-10 max-w-0 overflow-hidden whitespace-nowrap text-[10px] font-semibold tracking-[0.14em] uppercase opacity-0",
                "transition-[max-width,opacity,margin] duration-normal ease-[cubic-bezier(0.22,1,0.36,1)]",
                "group-hover/wa:ml-0.5 group-hover/wa:max-w-[6rem] group-hover/wa:opacity-100",
              )}
            >
              WhatsApp
            </span>
          </TextLink>
        </Magnetic>
      ) : null}
    </motion.div>
  );
}
