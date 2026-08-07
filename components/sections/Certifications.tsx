"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowUpRight, BadgeCheck } from "lucide-react";
import { Container, Eyebrow, Heading, Text, TextLink } from "@/components/ui";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { SnapRail } from "@/components/motion/SnapRail";
import { certifications, type Certification } from "@/lib/content";
import { usePrefersReducedMotion } from "@/hooks/useMotionPrefs";
import { cn } from "@/lib/utils";

const PANEL_TONES = ["bg-[#121820]", "bg-[#0f1824]", "bg-[#141c1a]"] as const;

function CertSnapCard({
  cert,
  index,
  total,
}: {
  cert: Certification;
  index: number;
  total: number;
}) {
  const num = String(index + 1).padStart(2, "0");
  const totalLabel = String(total).padStart(2, "0");

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[16px] border border-border-muted bg-[#0a0e14] transition-[border-color,box-shadow] duration-fast hover:border-accent-cyan/40 hover:shadow-soft">
      <div className="relative aspect-[4/3] bg-[#f4f6f8] p-2">
        <div className="relative h-full w-full">
          {cert.image ? (
            <Image
              src={cert.image}
              alt={`${cert.name} — ${cert.organization}`}
              fill
              className="object-contain object-center"
              sizes="90vw"
              quality={90}
              loading={index === 0 ? "eager" : "lazy"}
            />
          ) : null}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="font-mono text-[10px] tracking-[0.2em] text-accent-cyan">
          {num} / {totalLabel}
        </p>
        <h3 className="text-base font-bold leading-snug text-text-primary">
          {cert.name}
        </h3>
        <p className="text-sm text-text-secondary">{cert.organization}</p>
        {cert.credentialUrl ? (
          <TextLink
            href={cert.credentialUrl}
            external
            className="mt-auto inline-flex w-fit items-center gap-1.5 pt-2 text-[10px] font-semibold tracking-[0.16em] text-accent-cyan uppercase no-underline"
          >
            Verify
            <ArrowUpRight size={12} aria-hidden />
          </TextLink>
        ) : null}
      </div>
    </article>
  );
}

type PerspectivePanelProps = {
  cert: Certification;
  index: number;
  total: number;
  progress: MotionValue<number>;
  reduced: boolean;
};

/**
 * Olivier Larose “perspective-section-transition”:
 * sticky viewport panels — outgoing scale 1→0.8 / rotate 0→-5,
 * incoming scale 0.8→1 / rotate 5→0.
 */
function PerspectivePanel({
  cert,
  index,
  total,
  progress,
  reduced,
}: PerspectivePanelProps) {
  const isFirst = index === 0;
  const isLast = index === total - 1;
  const prev = (index - 1) / total;
  const curr = index / total;
  const next = (index + 1) / total;

  // Mid panels: grow in, then shrink out. First only shrinks. Last only grows.
  const scale = useTransform(
    progress,
    isFirst
      ? [curr, next]
      : isLast
        ? [prev, curr]
        : [prev, curr, next],
    reduced
      ? isFirst
        ? [1, 1]
        : isLast
          ? [1, 1]
          : [1, 1, 1]
      : isFirst
        ? [1, 0.8]
        : isLast
          ? [0.8, 1]
          : [0.8, 1, 0.8],
  );

  const rotate = useTransform(
    progress,
    isFirst
      ? [curr, next]
      : isLast
        ? [prev, curr]
        : [prev, curr, next],
    reduced
      ? isFirst
        ? [0, 0]
        : isLast
          ? [0, 0]
          : [0, 0, 0]
      : isFirst
        ? [0, -5]
        : isLast
          ? [5, 0]
          : [5, 0, -5],
  );

  const num = String(index + 1).padStart(2, "0");
  const totalLabel = String(total).padStart(2, "0");
  const tone = PANEL_TONES[index % PANEL_TONES.length];

  return (
    <div
      className="sticky top-0 h-[100vh] w-full"
      style={{ zIndex: index + 1 }}
    >
      <motion.div
        style={{
          scale,
          rotate,
          transformPerspective: 1200,
          transformOrigin: "center center",
        }}
        className={cn(
          "relative flex h-full w-full flex-col justify-center border-y border-border-muted will-change-transform",
          tone,
        )}
      >
        <Container className="flex h-full w-full max-h-[100vh] flex-col justify-center py-8 md:py-10 lg:py-12">
          <div className="mb-4 flex shrink-0 items-center justify-between gap-4 sm:mb-5">
            <span className="font-mono text-[11px] tracking-[0.22em] text-accent-cyan">
              {num}
              <span className="text-text-tertiary"> / {totalLabel}</span>
            </span>
            <h2 className="font-display max-w-[min(100%,28rem)] truncate text-center text-lg font-bold tracking-tight text-text-primary sm:text-xl md:text-2xl">
              {cert.organization}
            </h2>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.14em] text-text-primary uppercase">
              <BadgeCheck size={12} className="text-accent-cyan" aria-hidden />
              <span className="hidden sm:inline">Verified</span>
            </span>
          </div>

          <div className="grid min-h-0 flex-1 items-center gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.25fr)] lg:gap-10">
            <div className="flex min-w-0 flex-col">
              <p className="text-[11px] font-medium tracking-[0.18em] text-accent-cyan uppercase">
                {cert.issued}
              </p>
              <h3 className="mt-2 font-display text-xl font-bold leading-tight tracking-tight text-text-primary sm:text-2xl xl:text-[1.85rem]">
                {cert.name}
              </h3>
              {cert.note ? (
                <p className="mt-4 line-clamp-5 max-w-md text-sm leading-relaxed text-text-tertiary first-letter:font-display first-letter:text-[1.65rem] first-letter:font-bold first-letter:text-text-primary sm:text-[15px] sm:leading-7">
                  {cert.note}
                </p>
              ) : null}
              <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-2">
                {cert.skills.map((skill) => (
                  <li
                    key={skill}
                    className="text-[10px] font-medium tracking-[0.16em] text-text-tertiary uppercase"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap items-end justify-between gap-3 border-t border-border-muted pt-4">
                {cert.credentialUrl ? (
                  <TextLink
                    href={cert.credentialUrl}
                    external
                    className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-accent-cyan uppercase no-underline transition-colors hover:text-text-primary"
                    aria-label={`Verify ${cert.name} certificate (opens in new tab)`}
                  >
                    Verify
                    <ArrowUpRight size={14} aria-hidden />
                  </TextLink>
                ) : null}
                {cert.credentialId ? (
                  <p className="font-mono text-[10px] tracking-wide text-text-tertiary">
                    ID · {cert.credentialId}
                  </p>
                ) : null}
              </div>
            </div>

            {/* Full certificate visible — contain, no crop, no overlay */}
            <div className="relative mx-auto h-[min(52vh,420px)] w-full max-w-2xl overflow-hidden rounded-[16px] border border-border-muted bg-[#f4f6f8] p-3 shadow-card transition-[border-color,box-shadow] duration-fast hover:border-accent-cyan/40 hover:shadow-soft sm:h-[min(58vh,480px)] sm:p-4 lg:mx-0 lg:h-[min(62vh,520px)]">
              <div className="relative h-full w-full">
                {cert.image ? (
                  <Image
                    src={cert.image}
                    alt={`${cert.name} certificate awarded to Divyanshu Kashyap by ${cert.organization}`}
                    fill
                    className="object-contain object-center"
                    sizes="(max-width: 1024px) 90vw, 55vw"
                    quality={92}
                    priority={index === 0}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </Container>
      </motion.div>
    </div>
  );
}

function PerspectiveSectionTransition({ reduced }: { reduced: boolean }) {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  const n = certifications.length;

  return (
    <div
      ref={container}
      className="relative"
      style={{
        height: `${n * 100}vh`,
        perspective: "1200px",
        perspectiveOrigin: "50% 50%",
      }}
    >
      {certifications.map((cert, index) => (
        <PerspectivePanel
          key={`${cert.name}-${cert.credentialId ?? cert.issued}`}
          cert={cert}
          index={index}
          total={n}
          progress={scrollYProgress}
          reduced={reduced}
        />
      ))}
    </div>
  );
}

export function Certifications() {
  const reduced = usePrefersReducedMotion();

  return (
    <section
      id="certifications"
      aria-labelledby="certifications-heading"
      className="relative scroll-mt-28 border-y border-border-muted bg-surface-base md:scroll-mt-32"
    >
      <Container className="section-pad pb-2 md:pb-4">
        <ScrollReveal>
          <Eyebrow className="mb-3">Licenses & certifications</Eyebrow>
          <Heading id="certifications-heading" as={2} size="display-sm">
            Credentials
          </Heading>
          <Text tone="muted" className="mt-3 max-w-md text-sm leading-relaxed sm:text-base">
            Verified learning — perspective transition as you scroll.
          </Text>
        </ScrollReveal>
      </Container>

      <div className="pb-10 md:hidden">
        <SnapRail count={certifications.length} label="Certificates">
          {certifications.map((cert, index) => (
            <CertSnapCard
              key={`${cert.name}-${cert.credentialId ?? cert.issued}`}
              cert={cert}
              index={index}
              total={certifications.length}
            />
          ))}
        </SnapRail>
      </div>

      <div className="hidden md:block">
        <PerspectiveSectionTransition reduced={reduced} />
      </div>
    </section>
  );
}
