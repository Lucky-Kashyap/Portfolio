import { ServiceCard } from "@/components/cards/ServiceCard";
import { Grid, Section, SectionHeader } from "@/components/ui";
import { services } from "@/lib/content";

export function Services() {
  return (
    <Section
      id="services"
      bordered
      muted
      aria-labelledby="services-heading"
    >
      <SectionHeader
        eyebrow="Services"
        title="What I deliver"
        titleId="services-heading"
        description="End-to-end design and frontend craft for brands that need presence, performance, and clarity."
      />

      <Grid as="ul" cols={3} gap="sm" className="mt-10">
        {services.map((service, index) => (
          <li key={service.title}>
            <ServiceCard
              index={index}
              title={service.title}
              description={service.description}
            />
          </li>
        ))}
      </Grid>
    </Section>
  );
}
