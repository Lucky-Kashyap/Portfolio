"use client";

import { motion } from "framer-motion";
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
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-end overflow-hidden bg-atmosphere pb-16 pt-[calc(var(--height-header)+var(--spacing-8))] md:items-center md:pb-24"
      aria-labelledby="hero-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in srgb, var(--color-border-muted) 55%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--color-border-muted) 55%, transparent) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent 75%)",
        }}
      />

      <Container className="relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <Eyebrow className="mb-2 tracking-[0.2em]">
            Hi, I&apos;m {site.brand}
            <span className="text-text-muted"> · {site.pronouns}</span>
          </Eyebrow>
          <p className="mb-4 max-w-3xl text-sm leading-relaxed text-text-muted">
            {site.role}
          </p>
          <p className="mb-4 text-sm text-text-muted">{site.location}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
        >
          <Heading
            id="hero-heading"
            as={1}
            size="display-lg"
            className="max-w-4xl"
          >
            {site.tagline}
          </Heading>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16 }}
        >
          <Text className="mt-6 max-w-2xl" size="lg">
            {site.summary}
          </Text>
        </motion.div>

        <motion.div
          className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.24 }}
        >
          <Button
            className="w-full sm:w-auto"
            onClick={() => scrollToId("projects")}
          >
            View My Work
          </Button>
          <Button
            variant="secondary"
            className="w-full sm:w-auto"
            onClick={() => scrollToId("contact")}
          >
            Contact Me
          </Button>
        </motion.div>
      </Container>
    </section>
  );
}
