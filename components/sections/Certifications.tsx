"use client";

import Image from "next/image";
import { ArrowUpRight, BadgeCheck } from "lucide-react";
import { Container, Eyebrow, Heading, Text, TextLink } from "@/components/ui";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { SnapRail } from "@/components/motion/SnapRail";
import { certifications } from "@/lib/content";
import { cn } from "@/lib/utils";

function CertPanel({
  cert,
  index,
  className,
}: {
  cert: (typeof certifications)[number];
  index: number;
  className?: string;
}) {
  const num = String(index + 1).padStart(2, "0");

  return (
    <article
      className={cn(
        "relative flex h-full flex-col overflow-hidden bg-[#0a0e14]",
        className,
      )}
      data-cursor="hover"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {cert.image ? (
          <Image
            src={cert.image}
            alt={`${cert.name} — ${cert.organization}`}
            fill
            className="object-cover object-center opacity-90 transition-transform duration-500 hover:scale-105"
            sizes="(max-width: 768px) 86vw, 33vw"
            quality={75}
            loading="lazy"
          />
        ) : null}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0e14] via-[#0a0e14]/35 to-transparent"
          aria-hidden
        />
        <span className="absolute top-3 left-3 font-mono text-[10px] tracking-[0.2em] text-accent-cyan">
          {num}
        </span>
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 text-[9px] font-semibold tracking-[0.14em] text-text-primary uppercase">
          <BadgeCheck size={11} className="text-accent-cyan" aria-hidden />
          Verified
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <p className="text-[10px] tracking-[0.16em] text-text-tertiary uppercase">
          {cert.issued}
        </p>
        <h3 className="text-base font-bold leading-snug tracking-tight text-text-primary">
          {cert.name}
        </h3>
        <p className="text-sm text-text-secondary">{cert.organization}</p>
        <ul className="mt-auto flex flex-wrap gap-x-2 gap-y-1 pt-2">
          {cert.skills.slice(0, 4).map((s) => (
            <li
              key={s}
              className="text-[9px] tracking-[0.12em] text-text-tertiary uppercase"
            >
              {s}
            </li>
          ))}
        </ul>
        {cert.credentialUrl ? (
          <TextLink
            href={cert.credentialUrl}
            external
            className="mt-1 inline-flex w-fit items-center gap-1.5 text-[10px] font-semibold tracking-[0.16em] text-accent-cyan uppercase no-underline"
          >
            Verify
            <ArrowUpRight size={12} aria-hidden />
          </TextLink>
        ) : null}
      </div>
    </article>
  );
}

export function Certifications() {
  return (
    <section
      id="certifications"
      aria-labelledby="certifications-heading"
      className="section-pad scroll-mt-28 overflow-x-clip border-y border-border-muted bg-surface-raised/30 md:scroll-mt-32"
    >
      <Container>
        <ScrollReveal>
          <Eyebrow className="mb-3">Licenses & certifications</Eyebrow>
          <Heading id="certifications-heading" as={2} size="display-sm">
            Credentials
          </Heading>
          <Text tone="muted" className="mt-3 max-w-md text-sm leading-relaxed sm:text-base">
            Verified learning — open a credential URL to confirm.
          </Text>
        </ScrollReveal>
      </Container>

      {/* Mobile rail */}
      <div className="section-content md:hidden">
        <SnapRail count={certifications.length} label="Certificates">
          {certifications.map((cert, index) => (
            <CertPanel
              key={`${cert.name}-${cert.credentialId ?? cert.issued}`}
              cert={cert}
              index={index}
            />
          ))}
        </SnapRail>
      </div>

      {/* Dense grid — no alternating empty halves */}
      <Container className="section-content hidden md:block">
        <ul className="grid list-none gap-4 p-0 md:grid-cols-2 xl:grid-cols-3 md:gap-5">
          {certifications.map((cert, index) => (
            <li key={`${cert.name}-${cert.credentialId ?? cert.issued}`}>
              <ScrollReveal delay={0.04 * index} y={24}>
                <CertPanel cert={cert} index={index} />
              </ScrollReveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
