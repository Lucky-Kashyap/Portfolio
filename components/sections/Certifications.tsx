import { CertificateCard } from "@/components/cards/CertificateCard";
import { Grid, Section, SectionHeader } from "@/components/ui";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { certifications } from "@/lib/content";

export function Certifications() {
  return (
    <Section
      id="certifications"
      bordered
      muted
      aria-labelledby="certifications-heading"
      reveal={false}
    >
      <ScrollReveal>
        <SectionHeader
          eyebrow="Licenses & certifications"
          title="Verified learning"
          titleId="certifications-heading"
          description="Course completions and exam credentials — verify where a credential URL is available."
        />
      </ScrollReveal>

      <Grid as="ul" cols={3} gap="md" className="section-content items-stretch">
        {certifications.map((cert, index) => (
          <li
            key={`${cert.name}-${cert.credentialId ?? cert.issued}`}
            className="flex h-full min-h-0"
          >
            <ScrollReveal
              className="flex h-full w-full min-h-0 flex-col"
              delay={0.06 * index}
              y={36}
              x={index % 2 === 0 ? -20 : 20}
            >
              <CertificateCard cert={cert} />
            </ScrollReveal>
          </li>
        ))}
      </Grid>
    </Section>
  );
}
