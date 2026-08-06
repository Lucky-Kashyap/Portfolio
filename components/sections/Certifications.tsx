import { CertificateCard } from "@/components/cards/CertificateCard";
import { Grid, Section, SectionHeader } from "@/components/ui";
import { certifications } from "@/lib/content";

export function Certifications() {
  return (
    <Section
      id="certifications"
      bordered
      muted
      aria-labelledby="certifications-heading"
    >
      <SectionHeader
        eyebrow="Licenses & certifications"
        title="Verified learning"
        titleId="certifications-heading"
        description="Course completions and exam credentials — verify where a credential URL is available."
      />

      <Grid as="ul" cols={3} gap="md" className="mt-10">
        {certifications.map((cert) => (
          <li key={`${cert.name}-${cert.credentialId ?? cert.issued}`}>
            <CertificateCard cert={cert} />
          </li>
        ))}
      </Grid>
    </Section>
  );
}
