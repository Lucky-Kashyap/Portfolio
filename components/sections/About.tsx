import Image from "next/image";
import { Code2, Sparkles } from "lucide-react";
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
  Text,
} from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";
import { about, education, experience, site } from "@/lib/content";

export function About() {
  return (
    <section id="about" className="section-pad" aria-labelledby="about-heading">
      <Container>
        <Reveal>
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-12">
            <div className="max-w-3xl">
              <Eyebrow>About</Eyebrow>
              <Heading id="about-heading" as={2} size="display-sm">
                About me
              </Heading>
              <Text size="lg" className="mt-6 leading-relaxed">
                {about.lead}
              </Text>
              <Text tone="muted" className="mt-5 leading-relaxed">
                {about.specialize}
              </Text>
              <Text tone="muted" className="mt-5 leading-relaxed">
                {about.impact}
              </Text>
              <Text tone="muted" className="mt-5 leading-relaxed">
                {about.passion}
              </Text>
              <Text tone="muted" size="sm" className="mt-5">
                Based in {site.location}
              </Text>
            </div>

            <div className="relative mx-auto aspect-square w-40 overflow-hidden rounded-full border border-border-muted shadow-soft lg:mx-0 lg:w-44">
              <Image
                src={site.avatar}
                alt={`${site.brand} portrait`}
                fill
                className="object-cover"
                sizes="176px"
              />
            </div>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <Reveal className="md:col-span-2 xl:col-span-1 xl:row-span-2">
            <InfoListCard
              className="mt-0"
              eyebrow="Key Areas of Expertise"
              title="What I deliver end to end"
              icon={<Code2 size={20} aria-hidden />}
              items={about.expertise}
            />
          </Reveal>

          <Reveal delay={0.05}>
            <InfoListCard
              className="mt-0"
              eyebrow="Currently Expanding"
              title="Growing toward end-to-end solutions"
              icon={<Sparkles size={20} aria-hidden />}
              items={about.learning}
            />
          </Reveal>

          <Reveal delay={0.08}>
            <div className="flex h-full flex-col gap-6 rounded-sm border border-border-muted bg-surface-raised p-6 shadow-card md:p-8">
              <div>
                <Eyebrow className="mb-0 tracking-[0.14em]">Top Skills</Eyebrow>
                <ChipGroup items={[...about.topSkills]} className="mt-5 gap-3" />
              </div>
              <Quote
                cite={site.brand}
                className="mt-auto border-l-2 border-action-primary pl-5"
              >
                {site.connect}
              </Quote>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="md:col-span-2">
            <div className="rounded-sm border border-border-muted bg-surface-raised p-6 shadow-card md:p-8">
              <Eyebrow className="mb-0 tracking-[0.14em]">Technologies</Eyebrow>
              <Text tone="muted" size="sm" className="mt-4 max-w-3xl leading-relaxed">
                {about.technologies.join(" · ")}
              </Text>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(about.stack).map(([group, items]) => (
                  <StackGroupCard key={group} title={group} items={items} />
                ))}
              </div>
            </div>
          </Reveal>
        </div>
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
        <Reveal>
          <Eyebrow>Experience</Eyebrow>
          <Heading id="experience-heading" as={2} size="display-sm">
            Work & education
          </Heading>
          <Text tone="muted" className="mt-5 max-w-2xl leading-relaxed">
            Building production frontend systems and growing through hands-on
            engineering.
          </Text>
        </Reveal>

        <Reveal delay={0.08} className="mt-10 grid gap-6">
          {experience.map((item) => (
            <ExperienceCard
              key={`${item.company}-${item.role}`}
              item={item}
            />
          ))}
        </Reveal>

        <Reveal delay={0.12} className="mt-6">
          <EducationCard
            institution={education.institution}
            degree={education.degree}
            field={education.field}
            period={education.period}
            skills={education.skills}
          />
        </Reveal>
      </Container>
    </section>
  );
}
