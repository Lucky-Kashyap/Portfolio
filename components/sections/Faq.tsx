"use client";

import { useId, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { Button, Container, Eyebrow, Text, TextLink } from "@/components/ui";
import { ScrollWords } from "@/components/motion/ScrollHeading";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { about, site } from "@/lib/content";
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

  if (id === "specialize") {
    body = (
      <>
        {about.specialize} {about.narrative}
      </>
    );
  } else if (id === "contact") {
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
  } else if (id === "opportunities") {
    body = <>{about.passion}</>;
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
      className="relative section-pad scroll-mt-28 overflow-hidden border-y border-border-muted bg-surface-base cv-auto md:scroll-mt-32"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(125,211,252,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(125,211,252,0.06) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-24 right-0 size-[28rem] rounded-full bg-[radial-gradient(circle,rgba(125,211,252,0.12),transparent_65%)]"
        aria-hidden
      />

      <Container className="relative z-10">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-8 xl:gap-10">
          <ScrollReveal className="lg:sticky lg:top-28">
            <Eyebrow className="mb-3">FAQ</Eyebrow>
            <ScrollWords
              id="faq-heading"
              as={2}
              text="Ask before you ping"
              className="mt-2 text-[clamp(1.35rem,5.5vw,2.5rem)]"
            />
            <Text
              tone="muted"
              className="mt-3 max-w-sm text-sm leading-relaxed sm:text-base"
            >
              Stack, experience, availability — tap a question. Still stuck?
              Jump to contact.
            </Text>
            <div className="mt-5 flex flex-wrap gap-2 sm:gap-3">
              <Button
                variant="secondary"
                className="min-h-10 px-4 text-sm sm:min-h-11 sm:px-5"
                onClick={() => scrollToId("contact")}
              >
                Contact me
              </Button>
              <Button
                variant="ghost"
                className="min-h-10 px-4 text-sm sm:min-h-11 sm:px-5"
                onClick={() => scrollToId("services")}
              >
                View services
              </Button>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.06} y={28}>
            <ul className="flex list-none flex-col gap-2 p-0 sm:gap-3">
              {faqs.map((item, index) => {
                const isOpen = openIndex === index;
                const panelId = `${baseId}-panel-${index}`;
                const triggerId = `${baseId}-trigger-${index}`;
                const num = String(index + 1).padStart(2, "0");

                return (
                  <li
                    key={item.id}
                    className={cn(
                      "overflow-hidden border transition-[border-color,background-color] duration-fast",
                      isOpen
                        ? "border-accent-cyan/40 bg-surface-raised"
                        : "border-border-muted bg-surface-raised/40 hover:border-white/20",
                    )}
                  >
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
                        className="flex w-full items-center gap-3 px-3 py-3.5 text-left sm:gap-4 sm:px-4 sm:py-4 md:gap-5 md:px-5 md:py-5"
                      >
                        <span
                          className={cn(
                            "font-mono text-xl font-light tabular-nums sm:text-2xl md:text-3xl",
                            isOpen ? "text-accent-cyan" : "text-white/15",
                          )}
                          aria-hidden
                        >
                          {num}
                        </span>
                        <span
                          className={cn(
                            "min-w-0 flex-1 text-sm font-semibold leading-snug tracking-tight sm:text-base md:text-lg",
                            isOpen
                              ? "text-text-primary"
                              : "text-text-secondary",
                          )}
                        >
                          {item.question}
                        </span>
                        <span
                          className={cn(
                            "inline-flex size-8 shrink-0 items-center justify-center border transition-colors duration-fast sm:size-9",
                            isOpen
                              ? "border-accent-cyan/50 bg-accent-cyan/10 text-accent-cyan"
                              : "border-border-muted text-text-tertiary",
                          )}
                          aria-hidden
                        >
                          {isOpen ? <Minus size={15} /> : <Plus size={15} />}
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
                          <div className="border-t border-border-muted/80 px-4 pb-5 pt-1 md:px-5 md:pl-[4.25rem]">
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
