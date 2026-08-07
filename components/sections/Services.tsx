import { ServiceCardReveal } from "@/components/cards/ServiceCard";
import { Grid, Section, SectionHeader } from "@/components/ui";
import { services } from "@/lib/content";

export function Services() {
  return (
    <Section
      id="services"
      bordered
      muted
      aria-labelledby="services-heading"
      reveal={false}
      className="scroll-mt-28 md:scroll-mt-32"
    >
      <div className="grid items-end gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-10">
        <SectionHeader
          eyebrow="Services"
          title="What I deliver"
          titleId="services-heading"
          description="End-to-end design and frontend craft for brands that need presence, performance, and clarity."
          className="max-w-xl"
        />
        <p className="max-w-md text-sm leading-relaxed text-text-tertiary lg:justify-self-end lg:text-right">
          From polished UI systems to motion, performance, and SEO-ready
          interfaces — scoped for product teams and growing brands.
        </p>
      </div>

      <Grid as="ul" cols={3} gap="md" className="mt-8 md:mt-10">
        {services.map((service, index) => (
          <li key={service.title}>
            <ServiceCardReveal
              index={index}
              title={service.title}
              description={service.description}
              delay={0.05 * index}
            />
          </li>
        ))}
      </Grid>
    </Section>
  );
}
