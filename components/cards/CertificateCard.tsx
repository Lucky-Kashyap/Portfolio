import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Card, Heading, Text, TextLink } from "@/components/ui";
import type { Certification } from "@/lib/content";

type CertificateCardProps = {
  cert: Certification;
};

export function CertificateCard({ cert }: CertificateCardProps) {
  return (
    <Card
      variant="interactive"
      padding="none"
      className="flex h-full flex-col overflow-hidden"
    >
      {cert.image ? (
        <div className="relative aspect-[16/10] border-b border-border-muted bg-surface-base">
          <Image
            src={cert.image}
            alt={`${cert.name} certificate — ${cert.organization}`}
            fill
            className="object-contain p-3"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      ) : (
        <div
          className="flex aspect-[16/10] items-center justify-center border-b border-border-muted bg-[linear-gradient(145deg,color-mix(in_srgb,var(--color-action-primary-deep)_30%,#131317),#0a0a0c)] px-6"
          aria-hidden
        >
          <p className="text-center text-sm tracking-[0.14em] text-text-muted uppercase">
            Certificate
          </p>
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">
        <p className="text-sm tracking-[0.12em] text-text-muted uppercase">
          {cert.issued}
        </p>
        <Heading as={3} size="xl" className="mt-3">
          {cert.name}
        </Heading>
        <Text tone="muted" size="sm" className="mt-2">
          {cert.organization}
        </Text>

        {cert.note ? (
          <Text tone="muted" size="sm" className="mt-3">
            {cert.note}
          </Text>
        ) : null}

        {cert.credentialId ? (
          <Text tone="muted" size="sm" className="mt-3">
            Credential ID · {cert.credentialId}
          </Text>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-2">
          {cert.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-sm border border-border-muted px-3 py-1 text-xs tracking-wide text-text-muted"
            >
              {skill}
            </span>
          ))}
        </div>

        {cert.credentialUrl ? (
          <TextLink
            href={cert.credentialUrl}
            external
            className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-medium tracking-wide uppercase"
            aria-label={`Verify ${cert.name} certificate (opens in new tab)`}
          >
            Verify certificate
            <ArrowUpRight size={16} aria-hidden />
          </TextLink>
        ) : (
          <span className="mt-auto pt-6 text-sm tracking-wide text-text-muted uppercase">
            Credential pending
          </span>
        )}
      </div>
    </Card>
  );
}
