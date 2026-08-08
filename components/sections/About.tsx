"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion } from "framer-motion";
import { Code2, Sparkles } from "lucide-react";
import {
  EducationCard,
  ExperienceCard,
  InfoListCard,
  StackGroupCard,
} from "@/components/cards/EducationCard";
import {
  Card,
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
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/useMotionPrefs";

const ABOUT_HELP_LINES = [
  "Get to know the engineer behind the UI",
  "React · Next.js · TypeScript in production",
  "Motion, performance, and accessible craft",
  "Available for hire — React.js / Next.js roles",
  "Scroll down for experience & projects",
] as const;

function AboutHelpTicker({ reduced }: { reduced: boolean }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % ABOUT_HELP_LINES.length);
    }, 3200);
    return () => window.clearInterval(id);
  }, [reduced]);

  const line = ABOUT_HELP_LINES[index % ABOUT_HELP_LINES.length];

  return (
    <div className="pointer-events-none absolute right-3 bottom-3 z-[3] max-w-[55%] text-right sm:right-4 sm:bottom-4">
      <p
        className="text-[9px] font-semibold tracking-[0.16em] text-accent-cyan uppercase"
        style={{ textShadow: "0 1px 10px rgba(0,0,0,0.75)" }}
      >
        About
      </p>
      <div className="relative mt-1 min-h-[2.75em] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={line}
            initial={reduced ? false : { y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduced ? undefined : { y: -10, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="text-sm leading-snug font-medium text-white sm:text-[0.95rem]"
            style={{ textShadow: "0 2px 14px rgba(0,0,0,0.85)" }}
          >
            {line}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

function AboutAvatarVisual({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion();
  const cardRef = useRef<HTMLElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, px: 0, py: 0 });
  const [finePointer, setFinePointer] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const update = () => setFinePointer(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const onMove = (event: MouseEvent<HTMLElement>) => {
    if (reduced || !finePointer || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width; // 0–1
    const y = (event.clientY - rect.top) / rect.height;
    const nx = (x - 0.5) * 2; // -1–1
    const ny = (y - 0.5) * 2;
    setTilt({
      rx: -ny * 9,
      ry: nx * 11,
      px: nx * 10,
      py: ny * 8,
    });
  };

  const onLeave = () => setTilt({ rx: 0, ry: 0, px: 0, py: 0 });

  return (
    <div
      className={cn(
        "relative h-full w-full min-h-[22rem]",
        "[perspective:1100px]",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute -inset-5 z-0"
        aria-hidden
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_58%_68%_at_48%_38%,rgba(232,196,124,0.2),transparent_68%)] blur-2xl" />
        <div className="absolute inset-0 animate-avatar-glow-pulse motion-reduce:animate-none bg-[radial-gradient(ellipse_42%_52%_at_72%_28%,rgba(125,211,252,0.18),transparent_68%)]" />
      </div>

      <motion.figure
        ref={cardRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        data-cursor="hover"
        className="@container relative z-[1] h-full min-h-[22rem] w-full overflow-hidden rounded-[1.4rem] border border-border-muted bg-surface-base shadow-soft transition-[border-color,box-shadow] duration-normal ease-standard will-change-transform hover:border-accent-cyan/55 hover:shadow-accent"
        style={{ transformStyle: "preserve-3d" }}
        animate={
          reduced
            ? undefined
            : {
                rotateX: tilt.rx,
                rotateY: tilt.ry,
                transition: { type: "spring", stiffness: 220, damping: 22, mass: 0.45 },
              }
        }
      >
        <div
          className="pointer-events-none absolute inset-0 z-0"
          aria-hidden
        >
          <div className="absolute -left-8 top-1/4 size-40 rounded-full bg-[radial-gradient(circle,rgba(125,211,252,0.22),transparent_70%)] blur-2xl" />
          <div className="absolute -right-6 top-[18%] size-36 rounded-full bg-[radial-gradient(circle,rgba(232,196,124,0.2),transparent_70%)] blur-2xl" />
        </div>

        <motion.div
          className="absolute inset-[-6%] z-[1]"
          animate={
            reduced
              ? undefined
              : {
                  x: tilt.px,
                  y: tilt.py,
                  transition: {
                    type: "spring",
                    stiffness: 180,
                    damping: 24,
                    mass: 0.4,
                  },
                }
          }
        >
          <Image
            src={`${site.aboutVisual}?v=ai-sharp-3`}
            alt={`${site.brand} — photoreal AI avatar`}
            fill
            className="object-cover object-[50%_18%] [filter:contrast(1.06)_saturate(1.1)_brightness(1.03)]"
            sizes="(min-width: 1024px) 36vw, 90vw"
            quality={100}
            priority
          />
        </motion.div>

        <div
          className="pointer-events-none absolute inset-0 z-[2]"
          aria-hidden
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_32%,transparent_35%,rgba(3,5,10,0.22)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-[#03050a] via-[#03050a]/50 to-transparent" />
          <div className="absolute inset-y-0 left-0 w-[16%] bg-gradient-to-r from-[rgba(125,211,252,0.12)] to-transparent" />
          <div className="absolute inset-y-0 right-0 w-[16%] bg-gradient-to-l from-[rgba(232,196,124,0.12)] to-transparent" />
          {/* Specular highlight follows tilt */}
          <div
            className="absolute inset-0 opacity-55 transition-[background] duration-200"
            style={{
              background: `radial-gradient(circle at ${50 + tilt.ry * 2.2}% ${28 + tilt.rx * -1.8}%, rgba(255,255,255,0.14), transparent 42%)`,
            }}
          />
        </div>

        <div
          className="pointer-events-none absolute inset-0 z-[3] rounded-[1.4rem] ring-1 ring-inset ring-white/10"
          aria-hidden
        />

        <AboutHelpTicker reduced={reduced} />
      </motion.figure>
    </div>
  );
}

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
        <Card
          key={stat.label}
          variant="raised"
          padding="none"
          className="px-4 py-4"
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
        </Card>
      ))}
    </div>
  );
}

export function About() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="section-pad scroll-mt-28 overflow-x-clip pt-[clamp(2.5rem,5vw,3.5rem)] md:scroll-mt-32"
      aria-labelledby="about-heading"
    >
      <Container>
        <div className="mt-6 grid items-stretch gap-6 lg:mt-8 lg:grid-cols-2 lg:gap-8 xl:gap-10">
          <div className="order-2 flex h-full min-h-0 min-w-0 flex-col justify-between lg:order-1">
            <div>
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
            </div>

            <ScrollReveal delay={0.08} y={20}>
              <a
                href={site.leetcode}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-text-secondary transition-colors duration-fast hover:text-text-primary lg:mt-8"
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

          <div className="order-1 h-full min-h-[22rem] w-full lg:order-2 lg:min-h-0">
            <AboutAvatarVisual />
          </div>
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
              <Card variant="raised" padding="none" className="p-5">
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
              </Card>
            </ScrollReveal>

            <ScrollReveal
              delay={0.1}
              y={20}
              className="flex min-h-0 flex-col lg:flex-1"
            >
              <Card
                variant="raised"
                padding="none"
                className="flex min-h-0 flex-col p-5 lg:h-full lg:flex-1"
              >
                <Eyebrow className="mb-0 tracking-[0.14em]">Top Skills</Eyebrow>
                <ChipGroup items={[...about.topSkills]} className="mt-3 gap-2" />
                <Quote
                  cite={site.brand}
                  className="mt-5 border-l-2 border-action-primary pt-4 pl-3 text-sm leading-snug lg:mt-auto"
                >
                  {site.connect}
                </Quote>
              </Card>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.08} className="lg:col-span-2" y={28}>
            <Card
              variant="raised"
              padding="none"
              className="p-5 md:p-6"
            >
              <Eyebrow className="mb-0 tracking-[0.14em]">Technologies</Eyebrow>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(about.stack).map(([group, items]) => (
                  <StackGroupCard key={group} title={group} items={items} />
                ))}
              </div>
            </Card>
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
