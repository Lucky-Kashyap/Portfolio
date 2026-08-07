"use client";

import { useId, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Button, Container, Eyebrow, Text, TextLink } from "@/components/ui";
import { ScrollWords } from "@/components/motion/ScrollHeading";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { site } from "@/lib/content";
import { faqs } from "@/lib/seo";
import { scrollToId } from "@/lib/scroll";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/useMotionPrefs";

const faqLinkClass =
  "text-accent-cyan underline-offset-4 hover:text-text-primary hover:underline";

function FaqAnswer({
  id,
  fallback,
}: {
  id: (typeof faqs)[number]["id"];
  fallback: string;
}) {
  let body: ReactNode = fallback;

  if (id === "contact") {
    body = (
      <>
        I am based in Gokul Vatika, Jaipur, Rajasthan. Email{" "}
        <TextLink
          href={`mailto:${site.email}`}
          className={faqLinkClass}
          data-cursor="hover"
        >
          {site.email}
        </TextLink>
        , call{" "}
        <TextLink
          href={`tel:+91${site.phone.replace(/\s/g, "")}`}
          className={faqLinkClass}
          data-cursor="hover"
        >
          +91 {site.phone}
        </TextLink>
        , or reach me on{" "}
        <TextLink
          href={site.github}
          external
          className={faqLinkClass}
          data-cursor="hover"
        >
          GitHub
        </TextLink>
        ,{" "}
        <TextLink
          href={site.linkedin}
          external
          className={faqLinkClass}
          data-cursor="hover"
        >
          LinkedIn
        </TextLink>
        , and{" "}
        <TextLink
          href={site.leetcode}
          external
          className={faqLinkClass}
          data-cursor="hover"
        >
          LeetCode
        </TextLink>
        .
      </>
    );
  } else if (id === "leetcode") {
    body = (
      <>
        Yes. I practice on{" "}
        <TextLink
          href={site.leetcode}
          external
          className={faqLinkClass}
          data-cursor="hover"
        >
          LeetCode (@{site.leetcodeUser})
        </TextLink>{" "}
        with {site.leetcodeStats.solved}+ problems solved across Easy (
        {site.leetcodeStats.easy}) and Medium ({site.leetcodeStats.medium}),
        mainly in C++ and JavaScript.
      </>
    );
  }

  return (
    <Text tone="muted" className="text-sm leading-relaxed md:text-[0.95rem]">
      {body}
    </Text>
  );
}

export function Faq() {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const reduced = usePrefersReducedMotion();

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="section-pad scroll-mt-28 border-y border-border-muted bg-surface-base md:scroll-mt-32"
    >
      <Container>
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.25fr)] lg:gap-14 xl:gap-20">
          <ScrollReveal className="lg:sticky lg:top-28">
            <Eyebrow className="mb-4">FAQ</Eyebrow>
            <ScrollWords
              id="faq-heading"
              as={2}
              text="Common questions"
              className="mt-2"
            />
            <Text
              tone="muted"
              className="mt-5 max-w-md text-base leading-relaxed md:text-lg"
            >
              Quick answers about experience, stack, availability, and how to
              get in touch — open one at a time.
            </Text>
            <div className="mt-8">
              <Button
                variant="secondary"
                className="min-h-11 px-5"
                onClick={() => scrollToId("contact")}
              >
                Still have a question?
              </Button>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.06} y={28}>
            <ul className="divide-y divide-border-muted rounded-md border border-border-muted bg-surface-raised/60">
              {faqs.map((item, index) => {
                const isOpen = openIndex === index;
                const panelId = `${baseId}-panel-${index}`;
                const triggerId = `${baseId}-trigger-${index}`;
                const num = String(index + 1).padStart(2, "0");

                return (
                  <li key={item.id}>
                    <h3 className="m-0">
                      <button
                        type="button"
                        id={triggerId}
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        data-cursor="hover"
                        onClick={() =>
                          setOpenIndex((prev) =>
                            prev === index ? null : index,
                          )
                        }
                        className={cn(
                          "flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors duration-fast md:gap-4 md:px-5 md:py-4",
                          isOpen
                            ? "bg-surface-raised text-text-primary"
                            : "text-text-secondary hover:bg-white/[0.03] hover:text-text-primary",
                        )}
                      >
                        <span
                          className={cn(
                            "mt-0.5 shrink-0 font-mono text-[11px] tracking-wider tabular-nums",
                            isOpen ? "text-accent-cyan" : "text-text-tertiary",
                          )}
                          aria-hidden
                        >
                          {num}
                        </span>
                        <span className="min-w-0 flex-1 text-[0.95rem] font-medium leading-snug tracking-tight md:text-base">
                          {item.question}
                        </span>
                        <span
                          className={cn(
                            "mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-border-muted text-text-tertiary transition-[transform,color,border-color,background-color] duration-fast",
                            isOpen &&
                              "rotate-180 border-accent-cyan/40 bg-accent-cyan/10 text-accent-cyan",
                          )}
                          aria-hidden
                        >
                          <ChevronDown size={14} strokeWidth={2.25} />
                        </span>
                      </button>
                    </h3>

                    <AnimatePresence initial={false}>
                      {isOpen ? (
                        <motion.div
                          id={panelId}
                          role="region"
                          aria-labelledby={triggerId}
                          initial={
                            reduced ? false : { height: 0, opacity: 0 }
                          }
                          animate={{ height: "auto", opacity: 1 }}
                          exit={
                            reduced
                              ? undefined
                              : { height: 0, opacity: 0 }
                          }
                          transition={{
                            duration: 0.28,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-border-muted/70 px-4 pb-4 pt-3 md:px-5 md:pb-5 md:pl-[3.25rem]">
                            <FaqAnswer id={item.id} fallback={item.answer} />
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}
