"use client";

import { useRef } from "react";
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
      className="mt-6 grid gap-2 min-[400px]:gap-3 sm:grid-cols-2 lg:grid-cols-4"
      aria-label="Career highlights"
    >
      {about.stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-sm border border-border-muted bg-surface-raised px-4 py-4 shadow-card"
        >
          <p
            className="text-2xl font-semibold tracking-tight text-text-primary md:text-3xl"
            data-count={stat.value}
            data-suffix={stat.suffix}
          >
            {reduced ? `${stat.value}${stat.suffix}` : `0${stat.suffix}`}
          </p>
          <p className="mt-1.5 text-[11px] tracking-[0.14em] text-text-tertiary uppercase">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  return (
    <section
      ref={sectionRef}
      id="about"
      className="section-pad scroll-mt-28 overflow-x-clip pt-[clamp(2.5rem,5vw,3.5rem)] md:scroll-mt-32"
      aria-labelledby="about-heading"
    >
      <Container>
        <div className="mt-6 max-w-3xl lg:mt-8">
          <ScrollReveal y={28}>
            <p className="text-[11px] font-semibold tracking-[0.2em] text-text-tertiary uppercase">
              Get to know me
            </p>
            <Eyebrow className="mt-3 mb-0">About</Eyebrow>
            <Heading
              id="about-heading"
              as={2}
              size="display-sm"
              className="mt-3 max-w-xl text-[clamp(1.65rem,3.2vw,2.75rem)] leading-[1.12]"
            >
              {about.headline}
            </Heading>
          </ScrollReveal>

          <div className="mt-5 max-w-xl md:mt-6">
            <TextGradientScroll
              text={about.specialize}
              className="text-[clamp(1.05rem,2.2vw,1.35rem)] font-medium leading-snug tracking-tight text-text-primary"
              shadowOpacity={0.16}
            />
          </div>

          <div className="mt-4 max-w-md">
            <TextGradientScroll
              text={about.lead}
              className="text-sm leading-relaxed text-text-secondary"
              shadowOpacity={0.2}
            />
          </div>

          <ScrollReveal delay={0.06} y={18}>
            <ChipGroup
              items={[...about.highlightStack]}
              className="mt-5 gap-2"
            />
          </ScrollReveal>

          <ScrollReveal delay={0.08} y={20}>
            <a
              href={site.leetcode}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-text-secondary transition-colors duration-fast hover:text-text-primary"
              data-cursor="hover"
            >
              <span className="font-semibold tracking-[0.14em] text-accent-cyan uppercase">
                LeetCode
              </span>
              <span>@{site.leetcodeUser}</span>
              <span className="text-text-tertiary">
                {site.leetcodeStats.solved} solved
              </span>
            </a>
          </ScrollReveal>
        </div>

        <StatCounters />

        <div className="mt-8 grid items-start gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.95fr)] lg:items-stretch lg:gap-5">
          <ScrollReveal className="min-h-0 lg:h-full" y={28}>
            <InfoListCard
              className="mt-0 flex flex-col lg:h-full"
              dense
              eyebrow="Key Areas of Expertise"
              title="What I deliver end to end"
              icon={<Code2 size={18} aria-hidden />}
              items={about.expertise}
            />
          </ScrollReveal>

          <div className="flex h-full min-h-0 flex-col gap-4">
            <ScrollReveal delay={0.05} y={20}>
              <div className="rounded-sm border border-border-muted bg-surface-raised p-5 shadow-card">
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xs bg-surface-muted text-text-primary">
                    <Sparkles size={16} aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <Eyebrow className="mb-0 tracking-[0.14em]">
                      Currently Expanding
                    </Eyebrow>
                    <p className="mt-1.5 text-sm text-text-secondary">
                      Learning phase — not production claims
                    </p>
                  </div>
                </div>
                <ChipGroup
                  items={[...about.learning]}
                  className="mt-4 gap-2"
                />
              </div>
            </ScrollReveal>

            <ScrollReveal
              delay={0.1}
              y={20}
              className="flex min-h-0 flex-col lg:flex-1"
            >
              <div className="flex min-h-0 flex-col rounded-sm border border-border-muted bg-surface-raised p-5 shadow-card lg:h-full lg:flex-1">
                <Eyebrow className="mb-0 tracking-[0.14em]">Top Skills</Eyebrow>
                <ChipGroup items={[...about.topSkills]} className="mt-3 gap-2" />
                <Quote
                  cite={site.brand}
                  className="mt-5 border-l-2 border-action-primary pt-4 pl-3 text-sm leading-snug lg:mt-auto"
                >
                  {site.connect}
                </Quote>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.08} className="lg:col-span-2" y={28}>
            <div className="rounded-sm border border-border-muted bg-surface-raised p-5 shadow-card md:p-6">
              <Eyebrow className="mb-0 tracking-[0.14em]">Technologies</Eyebrow>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(about.stack).map(([group, items]) => (
                  <StackGroupCard key={group} title={group} items={items} />
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
      const cleanups: Array<() => void> = [];

      cards.forEach((card) => {
        const el = card as HTMLElement;
        let played = false;
        let raf = 0;
        el.style.opacity = "0.2";
        el.style.transform = "translate3d(-20px,0,0)";

        const play = () => {
          if (played) return;
          played = true;
          cancelAnimationFrame(raf);
          el.style.transition =
            "opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1), transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)";
          el.style.opacity = "1";
          el.style.transform = "translate3d(0,0,0)";
        };

        const loop = () => {
          if (played) return;
          const rect = el.getBoundingClientRect();
          const vh = window.innerHeight || 1;
          if (rect.top < vh * 0.9) {
            play();
            return;
          }
          raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
        cleanups.push(() => cancelAnimationFrame(raf));
      });

      return () => {
        cleanups.forEach((fn) => fn());
      };
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
