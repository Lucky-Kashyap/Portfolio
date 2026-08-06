"use client";

import { useEffect, useState } from "react";
import { useLenis } from "lenis/react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { TextLink } from "@/components/ui";
import { site } from "@/lib/content";
import { scrollToTop } from "@/lib/scroll";
import { usePrefersReducedMotion } from "@/hooks/useMotionPrefs";

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}

const SIZE = 42;
const STROKE = 2.5;
const R = (SIZE - STROKE) / 2;
const C = 2 * Math.PI * R;

function updateScrollMetrics(
  scrollY: number,
  setProgress: (v: number) => void,
  setShowTop: (v: boolean) => void,
) {
  const doc = document.documentElement;
  const max = doc.scrollHeight - window.innerHeight;
  const value = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
  setProgress(value);
  setShowTop(scrollY > 480);
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

  return (
    <motion.div
      className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-2 md:right-5 md:bottom-5"
      initial={reduced ? false : { opacity: 0, y: 16 }}
      animate={
        ready || reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }
      }
      transition={{ duration: 0.55, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Only mounts when needed — no empty reserved space on first view */}
      <AnimatePresence>
        {showTop ? (
          <motion.button
            key="scroll-top"
            type="button"
            onClick={scrollToTop}
            aria-label="Back to top"
            data-cursor="hover"
            initial={reduced ? false : { opacity: 0, scale: 0.8, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, scale: 0.8, y: 8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative inline-flex size-[42px] items-center justify-center rounded-full border border-border-muted bg-surface-base/90 text-text-primary shadow-soft backdrop-blur-md transition-colors duration-fast hover:border-accent-cyan/40 hover:bg-surface-raised"
          >
            <svg
              className="pointer-events-none absolute inset-0 -rotate-90"
              width={SIZE}
              height={SIZE}
              viewBox={`0 0 ${SIZE} ${SIZE}`}
              aria-hidden
            >
              <circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={R}
                fill="none"
                stroke="color-mix(in srgb, #ffffff 12%, transparent)"
                strokeWidth={STROKE}
              />
              <circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={R}
                fill="none"
                stroke="#7dd3fc"
                strokeWidth={STROKE}
                strokeLinecap="round"
                strokeDasharray={C}
                strokeDashoffset={reduced ? 0 : C * (1 - progress)}
                className="transition-[stroke-dashoffset] duration-150 ease-out"
              />
            </svg>
            <ArrowUp size={15} aria-hidden className="relative z-10" />
          </motion.button>
        ) : null}
      </AnimatePresence>

      {whatsapp ? (
        <TextLink
          href={whatsapp}
          external
          variant="muted"
          data-cursor="hover"
          className="inline-flex size-[42px] items-center justify-center rounded-full bg-[#25D366] text-white no-underline shadow-soft transition-transform duration-fast hover:scale-105 active:scale-95"
          aria-label="Chat on WhatsApp"
        >
          <WhatsAppIcon size={18} />
        </TextLink>
      ) : null}
    </motion.div>
  );
}
