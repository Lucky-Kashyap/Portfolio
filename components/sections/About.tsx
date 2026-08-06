import {
  EducationCard,
  ExperienceCard,
  InfoListCard,
  StackGroupCard,
} from "@/components/cards/EducationCard";
import {
  ChipGroup,
  Container,
  Eyebrow,
  Heading,
  Quote,
  Stack,
  Text,
} from "@/components/ui";
import { about, education, experience, site } from "@/lib/content";

export function About() {
  return (
    <section id="about" className="section-pad" aria-labelledby="about-heading">
      <Container className="grid items-start gap-10 lg:grid-cols-2 lg:gap-12">
        <div className="min-w-0">
          <Eyebrow>About</Eyebrow>
          <Heading id="about-heading" as={2} size="display-sm">
            About me
          </Heading>
          <Text size="lg" className="mt-6">
            {about.lead}
          </Text>
          <Text tone="muted" className="mt-4">
            {about.specialize}
          </Text>
          <Text tone="muted" className="mt-4">
            {about.impact}
          </Text>
          <Text tone="muted" className="mt-4">
            {about.passion}
          </Text>
          <Text tone="muted" size="sm" className="mt-4">
            Based in {site.location}
          </Text>

          <InfoListCard
            eyebrow="Key Areas of Expertise"
            title="What I deliver end to end"
            items={about.expertise}
          />

          <InfoListCard
            eyebrow="Currently Expanding"
            title="Growing toward end-to-end solutions"
            items={about.learning}
          />
        </div>

        <Stack gap="lg" className="min-w-0">
          <div>
            <Eyebrow className="tracking-[0.14em]">Top Skills</Eyebrow>
            <ChipGroup items={[...about.topSkills]} className="mt-4" />
          </div>

          <div>
            <Eyebrow className="tracking-[0.14em]">Technologies</Eyebrow>
            <Text tone="muted" size="sm" className="mt-4 leading-relaxed">
              {about.technologies.join(" · ")}
            </Text>
            <div className="mt-4 grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2">
              {Object.entries(about.stack).map(([group, items]) => (
                <StackGroupCard key={group} title={group} items={items} />
              ))}
            </div>
          </div>

          <Quote cite={site.brand}>{site.connect}</Quote>
        </Stack>
      </Container>
    </section>
  );
}

export function Experience() {
  return (
    <section
      id="experience"
      className="section-pad border-y border-border-muted bg-surface-raised/40"
      aria-labelledby="experience-heading"
    >
      <Container>
        <Eyebrow>Experience</Eyebrow>
        <Heading id="experience-heading" as={2} size="display-sm">
          Work & education
        </Heading>
        <Text tone="muted" className="mt-4 max-w-xl">
          Building production frontend systems and growing through hands-on
          engineering.
        </Text>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {experience.map((item) => (
            <div
              key={`${item.company}-${item.role}`}
              className={item.skills?.length ? "md:col-span-2" : undefined}
            >
              <ExperienceCard item={item} />
            </div>
          ))}
        </div>

        <div className="mt-6 max-w-3xl">
          <EducationCard
            institution={education.institution}
            degree={education.degree}
            field={education.field}
            period={education.period}
            skills={education.skills}
          />
        </div>
      </Container>
    </section>
  );
}
