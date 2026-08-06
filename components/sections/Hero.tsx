"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  Button,
  Container,
  Eyebrow,
  Heading,
  Text,
} from "@/components/ui";
import { site } from "@/lib/content";
import { scrollToId } from "@/lib/scroll";

export function Hero() {
  const reduceMotion = useReducedMotion();
  const [introReady, setIntroReady] = useState(Boolean(reduceMotion));

  useEffect(() => {
    if (reduceMotion) {
      setIntroReady(true);
      return;
    }

    const onReady = () => setIntroReady(true);
    window.addEventListener("portfolio:ready", onReady);

    // Fallback if the ready event already fired
    const fallback = window.setTimeout(() => setIntroReady(true), 2400);

    return () => {
      window.removeEventListener("portfolio:ready", onReady);
      window.clearTimeout(fallback);
    };
  }, [reduceMotion]);

  const fade = (delay = 0) =>
    reduceMotion || !introReady
      ? {
          initial: reduceMotion ? false : { opacity: 0, y: 18 },
          animate: introReady || reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
          transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as const },
        }
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section
      id="top"
      className="bg-atmosphere relative flex min-h-[100svh] items-center overflow-hidden pb-16 pt-[calc(var(--height-header)+var(--spacing-8))] md:pb-20"
      aria-labelledby="hero-heading"
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.14]" aria-hidden>
        <Image
          src="/hero/atmosphere.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      <Container className="relative z-10 w-full">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <motion.div
            className="mx-auto w-full max-w-[280px] lg:mx-0 lg:max-w-[340px]"
            {...fade(0)}
          >
            <div className="relative aspect-square overflow-hidden rounded-full">
              <Image
                src={site.avatar}
                alt={`${site.brand}, Frontend Engineer based in ${site.location}`}
                width={640}
                height={640}
                priority
                sizes="(max-width: 1024px) 280px, 340px"
                className="size-full object-cover"
              />
            </div>
          </motion.div>

          <div className="min-w-0 max-w-2xl">
            <motion.div {...fade(0.06)}>
              <p className="mb-3 text-sm font-medium tracking-[0.16em] text-text-tertiary uppercase">
                {site.mark}
              </p>
              <Eyebrow className="mb-2 tracking-[0.18em]">Hello</Eyebrow>
              <Heading
                id="hero-heading"
                as={1}
                size="display-lg"
                className="max-w-3xl uppercase"
              >
                I&apos;m {site.brand}
              </Heading>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-text-secondary">
                {site.role}
              </p>
              <p className="mt-2 text-sm text-text-tertiary">{site.location}</p>
            </motion.div>

            <motion.div {...fade(0.14)}>
              <Text className="mt-6 max-w-xl" size="lg" tone="secondary">
                {site.summary}
              </Text>
            </motion.div>

            <motion.div
              className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
              {...fade(0.22)}
            >
              <Button
                className="w-full sm:w-auto"
                aria-label="View featured projects"
                onClick={() => scrollToId("projects")}
              >
                View My Work
              </Button>
              <Button
                variant="secondary"
                className="w-full sm:w-auto"
                aria-label="Go to contact form"
                onClick={() => scrollToId("contact")}
              >
                Contact Me
              </Button>
            </motion.div>
          </div>
        </div>
      </Container>

      <motion.button
        type="button"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-xs tracking-[0.18em] text-text-tertiary uppercase md:inline-flex"
        onClick={() => scrollToId("about")}
        aria-label="Scroll to about section"
        {...fade(0.35)}
      >
        Scroll down
        <span aria-hidden className="animate-bounce">
          ↓
        </span>
      </motion.button>
    </section>
  );
}
