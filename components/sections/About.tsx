"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
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
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { TextGradientScroll } from "@/components/motion/TextGradientScroll";
import { about, education, experience, site } from "@/lib/content";
import { gsap, registerGsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/useMotionPrefs";

function StatCounters() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      registerGsap();
      const root = ref.current;
      if (!root || reduced) return;

      const nums = root.querySelectorAll<HTMLElement>("[data-count]");
      nums.forEach((el) => {
        const end = Number(el.dataset.count || 0);
        const suffix = el.dataset.suffix || "";
        const obj = { val: 0 };
        gsap.to(obj, {
          val: end,
          duration: 1.4,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            once: true,
          },
          onUpdate: () => {
            const value =
              end % 1 === 0 ? Math.round(obj.val) : obj.val.toFixed(1);
            el.textContent = `${value}${suffix}`;
          },
        });
      });
    },
    { dependencies: [reduced], scope: ref },
  );

  return (
    <div
      ref={ref}
      className="mt-10 grid gap-[1.25rem] sm:grid-cols-2 lg:grid-cols-4"
      aria-label="Career highlights"
    >
      {about.stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-sm border border-border-muted bg-surface-raised p-5 shadow-card"
        >
          <p
            className="text-3xl font-semibold tracking-tight text-text-primary"
            data-count={stat.value}
            data-suffix={stat.suffix}
          >
            {reduced ? `${stat.value}${stat.suffix}` : `0${stat.suffix}`}
          </p>
          <p className="mt-2 text-xs tracking-[0.14em] text-text-tertiary uppercase">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      registerGsap();
      const img = imageRef.current;
      if (!img || reduced) return;

      gsap.fromTo(
        img,
        { clipPath: "inset(12% 12% 12% 12% round 9999px)", scale: 1.08 },
        {
          clipPath: "inset(0% 0% 0% 0% round 9999px)",
          scale: 1,
          duration: 1.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: img,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        },
      );
    },
    { dependencies: [reduced], scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="about"
      className="section-pad"
      aria-labelledby="about-heading"
    >
      <Container>
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-12">
          <div className="max-w-3xl">
            <ScrollReveal y={36}>
              <Eyebrow>About</Eyebrow>
              <Heading id="about-heading" as={2} size="display-sm">
                About me
              </Heading>
            </ScrollReveal>

            <TextGradientScroll
              text={about.lead}
              className="mt-8 text-xl leading-relaxed text-text-primary md:text-2xl md:leading-snug"
              shadowOpacity={0.14}
            />
            <ScrollReveal delay={0.04} y={20}>
              <p className="mt-8 max-w-2xl text-sm font-semibold tracking-[0.18em] text-accent-cyan uppercase md:text-base">
                {about.headline}
              </p>
              <ChipGroup
                items={[...about.highlightStack]}
                className="mt-4 gap-2"
              />
            </ScrollReveal>
            <TextGradientScroll
              text={about.specialize}
              className="mt-8 text-lg leading-relaxed text-text-secondary"
              shadowOpacity={0.18}
              offset={["start 0.95", "start 0.4"]}
            />
            <TextGradientScroll
              text={about.impact}
              className="mt-6 text-lg leading-relaxed text-text-secondary"
              shadowOpacity={0.18}
              offset={["start 0.95", "start 0.4"]}
            />
            <TextGradientScroll
              text={about.passion}
              className="mt-6 text-lg leading-relaxed text-text-secondary"
              shadowOpacity={0.18}
              offset={["start 0.95", "start 0.4"]}
            />

            <ScrollReveal delay={0.05} y={24}>
              <a
                href={site.leetcode}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex flex-wrap items-center gap-x-4 gap-y-2 rounded-sm border border-border-muted bg-surface-raised px-4 py-3 text-sm text-text-secondary shadow-card transition-[border-color,transform] duration-fast hover:-translate-y-0.5 hover:border-border-default hover:text-text-primary"
                data-cursor="hover"
              >
                <span className="font-medium tracking-[0.14em] text-accent-cyan uppercase">
                  LeetCode
                </span>
                <span>@{site.leetcodeUser}</span>
                <span>
                  {site.leetcodeStats.solved} solved · Easy{" "}
                  {site.leetcodeStats.easy} · Med {site.leetcodeStats.medium}
                </span>
                <span className="text-text-tertiary">
                  {site.leetcodeStats.acceptance} acceptance
                </span>
              </a>
            </ScrollReveal>

            <StatCounters />
          </div>

          <div className="mx-auto flex w-full max-w-[220px] flex-col items-center gap-5 lg:mx-0 lg:max-w-[240px]">
            <div
              ref={imageRef}
              className="relative aspect-square w-40 overflow-hidden rounded-full border border-border-muted shadow-soft will-change-transform lg:w-44"
            >
              <Image
                src={site.avatar}
                alt="Divyanshu Kashyap, Frontend Engineer based in Jaipur, professional portrait photo"
                fill
                className="object-cover"
                sizes="176px"
              />
            </div>

            <ScrollReveal delay={0.08} y={28} className="w-full">
              <div className="relative overflow-hidden rounded-md border border-border-muted bg-surface-raised shadow-card">
                <div className="relative aspect-square w-full">
                  <Image
                    src={site.animeAvatar}
                    alt="Divyanshu Kashyap anime AI persona coding at a desk — Frontend Engineer illustration"
                    fill
                    className="object-cover object-[center_28%]"
                    sizes="240px"
                  />
                  {!reduced ? (
                    <motion.div
                      className="pointer-events-none absolute inset-x-[18%] bottom-[6%] h-[18%] rounded-full bg-accent-cyan/10 blur-md"
                      aria-hidden
                      animate={{ opacity: [0.25, 0.7, 0.25], scaleX: [0.92, 1.06, 0.92] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  ) : null}
                  {!reduced ? (
                    <motion.span
                      className="pointer-events-none absolute bottom-3 left-3 rounded-xs border border-white/10 bg-black/55 px-2 py-1 text-[10px] font-medium tracking-[0.16em] text-accent-cyan uppercase backdrop-blur-sm"
                      aria-hidden
                      animate={{ opacity: [0.65, 1, 0.65] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    >
                      typing…
                    </motion.span>
                  ) : (
                    <span className="absolute bottom-3 left-3 rounded-xs border border-white/10 bg-black/55 px-2 py-1 text-[10px] font-medium tracking-[0.16em] text-accent-cyan uppercase backdrop-blur-sm">
                      AI persona
                    </span>
                  )}
                </div>
                <p className="border-t border-border-muted px-3 py-2 text-center text-[11px] tracking-[0.14em] text-text-tertiary uppercase">
                  Anime AI avatar
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>

        <div className="mt-[clamp(2.75rem,5vw,4.5rem)] grid gap-6 md:grid-cols-2 md:gap-8 xl:grid-cols-3">
          <ScrollReveal y={36}>
            <InfoListCard
              className="mt-0 h-full"
              eyebrow="Key Areas of Expertise"
              title="What I deliver end to end"
              icon={<Code2 size={20} aria-hidden />}
              items={about.expertise}
            />
          </ScrollReveal>

          <ScrollReveal delay={0.05} y={36}>
            <InfoListCard
              className="mt-0 h-full"
              eyebrow="Currently Expanding"
              title="Learning phase — not production claims"
              icon={<Sparkles size={20} aria-hidden />}
              items={about.learning}
            />
          </ScrollReveal>

          <ScrollReveal delay={0.1} y={36} className="md:col-span-2 xl:col-span-1">
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
          </ScrollReveal>

          <ScrollReveal delay={0.08} className="md:col-span-2 xl:col-span-3" y={40}>
            <div className="rounded-sm border border-border-muted bg-surface-raised p-6 shadow-card md:p-8">
              <Eyebrow className="mb-0 tracking-[0.14em]">Technologies</Eyebrow>
              <Text tone="muted" size="sm" className="mt-4 max-w-3xl leading-relaxed">
                {about.technologies.join(" · ")}
              </Text>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(about.stack).map(([group, items], index) => (
                  <ScrollReveal
                    key={group}
                    delay={0.04 * index}
                    y={24}
                  >
                    <StackGroupCard title={group} items={items} />
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}

export function Experience() {
  const rootRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      registerGsap();
      const root = rootRef.current;
      const line = lineRef.current;
      if (!root || !line || reduced) return;

      gsap.fromTo(
        line,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root.querySelector("[data-timeline]"),
            start: "top 75%",
            end: "bottom 55%",
            scrub: true,
          },
        },
      );

      const cards = root.querySelectorAll("[data-timeline-card]");
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, x: -28 },
          {
            opacity: 1,
            x: 0,
            duration: 0.75,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          },
        );
      });
    },
    { dependencies: [reduced], scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      id="experience"
      className="section-pad border-y border-border-muted bg-surface-raised/40"
      aria-labelledby="experience-heading"
    >
      <Container>
        <ScrollReveal>
          <Eyebrow>Experience</Eyebrow>
          <Heading id="experience-heading" as={2} size="display-sm">
            Work & education
          </Heading>
          <Text tone="muted" className="mt-6 max-w-2xl text-lg leading-relaxed">
            Building production frontend systems and growing through hands-on
            engineering.
          </Text>
        </ScrollReveal>

        <div data-timeline className="section-content relative pl-6 md:pl-8">
          <div
            className="absolute top-2 bottom-2 left-[7px] w-px origin-top bg-border-muted md:left-[11px]"
            aria-hidden
          />
          <div
            ref={lineRef}
            className="absolute top-2 bottom-2 left-[7px] w-px origin-top scale-y-0 bg-action-primary md:left-[11px]"
            aria-hidden
          />

          <div className="space-y-[1.75rem] md:space-y-[2.5rem]">
            {experience.map((item) => (
              <div
                key={`${item.company}-${item.role}`}
                data-timeline-card
                className="relative"
              >
                <span
                  className="absolute top-7 -left-[21px] size-2.5 rounded-full border-2 border-action-primary bg-surface-muted md:-left-[25px]"
                  aria-hidden
                />
                <ExperienceCard item={item} />
              </div>
            ))}
            <div data-timeline-card className="relative">
              <span
                className="absolute top-7 -left-[21px] size-2.5 rounded-full border-2 border-action-primary bg-surface-muted md:-left-[25px]"
                aria-hidden
              />
              <EducationCard
                institution={education.institution}
                degree={education.degree}
                field={education.field}
                period={education.period}
                skills={education.skills}
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
