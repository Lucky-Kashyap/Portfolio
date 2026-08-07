"use client";

import Image from "next/image";
import { ArrowUpRight, BadgeCheck } from "lucide-react";
import { TextLink } from "@/components/ui";
import type { Certification } from "@/lib/content";
import { cn } from "@/lib/utils";

type CertificateCardProps = {
  cert: Certification;
  index?: number;
};

/**
 * Credential strip — image as atmosphere, verify as primary action.
 * Reads like a ticket / license, not a blog card.
 */
export function CertificateCard({ cert, index = 0 }: CertificateCardProps) {
  const num = String(index + 1).padStart(2, "0");

  return (
    <article
      className={cn(
        "group relative grid overflow-hidden border border-border-muted bg-surface-raised/50",
        "transition-[border-color,background-color] duration-normal",
        "hover:border-accent-cyan/35 hover:bg-surface-raised",
        "md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)]",
      )}
      data-cursor="hover"
    >
      <div className="relative min-h-[160px] overflow-hidden bg-[#0c1118] md:min-h-[200px]">
        {cert.image ? (
          <Image
            src={cert.image}
            alt={`${cert.name} certificate awarded to Divyanshu Kashyap by ${cert.organization}, issued ${cert.issued}${cert.credentialId ? `, credential ID ${cert.credentialId}` : ""}`}
            fill
            className="object-cover object-center opacity-80 transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 40vw"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div
            className="absolute inset-0 bg-[linear-gradient(145deg,#151a22,#0c1118)]"
            aria-hidden
          />
        )}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-surface-raised/90 max-md:bg-gradient-to-t max-md:from-surface-raised via-40%"
          aria-hidden
        />
        <span className="absolute top-3 left-3 font-mono text-[11px] tracking-[0.2em] text-accent-cyan">
          {num}
        </span>
        <span className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-sm border border-white/15 bg-black/45 px-2 py-1 text-[10px] font-semibold tracking-[0.14em] text-text-primary uppercase backdrop-blur-sm md:right-auto md:left-3 md:bottom-3">
          <BadgeCheck size={12} className="text-accent-cyan" aria-hidden />
          Credential
        </span>
      </div>

      <div className="relative flex flex-col justify-between gap-4 p-5 md:p-6">
        <div>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-[11px] font-medium tracking-[0.18em] text-text-tertiary uppercase">
              {cert.issued}
            </p>
            {cert.credentialId ? (
              <p className="font-mono text-[10px] tracking-wide text-text-tertiary">
                ID · {cert.credentialId}
              </p>
            ) : null}
          </div>

          <h3 className="mt-3 text-lg font-bold leading-snug tracking-tight text-text-primary md:text-xl">
            {cert.name}
          </h3>

          <p className="mt-2 text-sm text-text-secondary">
            {cert.organizationUrl ? (
              <TextLink
                href={cert.organizationUrl}
                external
                className="text-inherit no-underline hover:text-accent-cyan"
              >
                {cert.organization}
              </TextLink>
            ) : (
              cert.organization
            )}
          </p>

          {cert.note ? (
            <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-text-tertiary">
              {cert.note}
            </p>
          ) : null}

          <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1">
            {cert.skills.map((skill) => (
              <li
                key={skill}
                className="text-[10px] font-medium tracking-[0.14em] text-text-tertiary uppercase"
              >
                {skill}
              </li>
            ))}
          </ul>
        </div>

        {cert.credentialUrl ? (
          <TextLink
            href={cert.credentialUrl}
            external
            className="inline-flex w-fit items-center gap-2 border-b border-accent-cyan/40 pb-0.5 text-xs font-semibold tracking-[0.16em] text-accent-cyan uppercase no-underline transition-colors duration-fast hover:border-accent-cyan hover:text-text-primary"
            aria-label={`Verify ${cert.name} certificate (opens in new tab)`}
          >
            Verify credential
            <ArrowUpRight
              size={14}
              aria-hidden
              className="transition-transform duration-fast group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </TextLink>
        ) : (
          <span className="text-xs tracking-[0.14em] text-text-tertiary uppercase">
            Credential pending
          </span>
        )}
      </div>
    </article>
  );
}
