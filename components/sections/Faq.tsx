import { Grid, Section, SectionHeader, Text } from "@/components/ui";
import { faqs } from "@/lib/seo";

export function Faq() {
  return (
    <Section id="faq" aria-labelledby="faq-heading">
      <SectionHeader
        eyebrow="FAQ"
        title="Common questions"
        titleId="faq-heading"
        description="Quick answers about experience, stack, availability, and how to get in touch."
      />

      <Grid as="ul" cols={1} gap="sm" className="mt-10 max-w-3xl">
        {faqs.map((item) => (
          <li key={item.question}>
            <details className="group rounded-lg border border-border-muted bg-surface-raised open:border-border-default">
              <summary className="cursor-pointer list-none px-5 py-4 text-lg font-medium text-text-secondary marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-start justify-between gap-4">
                  <span>{item.question}</span>
                  <span
                    className="mt-1 shrink-0 text-text-muted transition-transform duration-fast group-open:rotate-45"
                    aria-hidden
                  >
                    +
                  </span>
                </span>
              </summary>
              <div className="border-t border-border-muted px-5 py-4">
                <Text tone="muted">{item.answer}</Text>
              </div>
            </details>
          </li>
        ))}
      </Grid>
    </Section>
  );
}
