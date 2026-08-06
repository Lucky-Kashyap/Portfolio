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
        <div className="relative aspect-[16/10] border-b border-border-muted bg-surface-muted">
          <Image
            src={cert.image}
            alt={`${cert.name} certificate awarded to Divyanshu Kashyap by ${cert.organization}, issued ${cert.issued}${cert.credentialId ? `, credential ID ${cert.credentialId}` : ""}`}
            fill
            className="object-contain p-3"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
            decoding="async"
          />
        </div>
      ) : (
        <div
          className="flex aspect-[16/10] items-center justify-center border-b border-border-muted bg-[linear-gradient(145deg,color-mix(in_srgb,#ffffff_8%,#0a0a0b),oklch(0.141_0.005_285.823))] px-6"
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
          {cert.organizationUrl ? (
            <TextLink href={cert.organizationUrl} external>
              {cert.organization}
            </TextLink>
          ) : (
            cert.organization
          )}
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
              className="rounded-xs border border-border-muted px-3 py-1 text-xs tracking-wide text-text-muted"
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
