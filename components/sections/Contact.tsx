"use client";

import { FormEvent, useId, useState, type ReactNode } from "react";
import Image from "next/image";
import {
  AlertCircle,
  ArrowUpRight,
  Code2,
  Link2,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import {
  Button,
  Container,
  Field,
  Input,
  Text,
  TextLink,
  Textarea,
} from "@/components/ui";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ScrollWords } from "@/components/motion/ScrollHeading";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { site } from "@/lib/content";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/useMotionPrefs";

type Status = "idle" | "loading" | "success" | "error";

type ContactChannelProps = {
  label: string;
  value: string;
  href: string;
  icon: ReactNode;
  external?: boolean;
};

function GithubMark({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.73 0 0 .84-.27 2.75 1.05A9.3 9.3 0 0 1 12 7.5c.85 0 1.71.12 2.51.35 1.9-1.32 2.74-1.05 2.74-1.05.55 1.42.2 2.47.1 2.73.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .26.18.59.69.48A10.03 10.03 0 0 0 22 12.26C22 6.58 17.52 2 12 2z" />
    </svg>
  );
}

function ContactChannel({
  label,
  value,
  href,
  icon,
  external,
}: ContactChannelProps) {
  return (
    <TextLink
      href={href}
      external={external}
      className={cn(
        "group flex items-center gap-2.5 rounded-sm border border-border-muted bg-surface-raised px-3 py-2.5 no-underline",
        "transition-[border-color,background-color] duration-fast",
        "hover:border-accent-cyan/40 hover:bg-surface-muted",
      )}
    >
      <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-xs border border-border-muted bg-surface-muted text-text-primary">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[10px] font-semibold tracking-[0.12em] text-text-tertiary uppercase">
          {label}
        </span>
        <span className="mt-0.5 block truncate text-[13px] font-medium text-text-primary group-hover:text-accent-cyan">
          {value}
        </span>
      </span>
      <ArrowUpRight
        size={13}
        className="shrink-0 text-text-tertiary transition-transform duration-fast group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent-cyan"
        aria-hidden
      />
    </TextLink>
  );
}

export function Contact() {
  const formId = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [invalid, setInvalid] = useState({
    name: false,
    email: false,
    message: false,
  });
  const reduced = usePrefersReducedMotion();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setStatus("loading");

    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();

    const nextInvalid = {
      name: !name,
      email: !email,
      message: !message,
    };
    setInvalid(nextInvalid);

    if (nextInvalid.name || nextInvalid.email || nextInvalid.message) {
      setStatus("error");
      setError("Please fill in name, email, and message before sending.");
      return;
    }

    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`);
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
    setStatus("success");
  }

  return (
    <section
      id="contact"
      className="scroll-mt-28 border-t border-border-muted bg-atmosphere py-16 md:scroll-mt-32 md:py-20 lg:py-24"
      aria-labelledby="contact-heading"
    >
      <Container>
        {/* Full-width intro — one clear job */}
        <ScrollReveal>
          <div className="flex flex-wrap items-center gap-3">
            <Eyebrow className="mb-0">Contact</Eyebrow>
            <span className="inline-flex items-center gap-2 rounded-full border border-border-muted bg-surface-raised px-2.5 py-1 text-[10px] font-semibold tracking-[0.14em] text-text-secondary uppercase">
              <span
                className={cn(
                  "size-1.5 rounded-full bg-emerald-400",
                  !reduced && "animate-pulse",
                )}
                aria-hidden
              />
              Available for work
            </span>
          </div>
          <ScrollWords
            id="contact-heading"
            as={2}
            text="Let's build something extraordinary together."
            className="mt-4 max-w-2xl"
          />
          <Text tone="muted" className="mt-4 max-w-xl text-base leading-relaxed">
            {site.connect}
          </Text>
        </ScrollReveal>

        {/* Contact channels + form — stretch so bottoms align on desktop */}
        <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-2 lg:items-stretch lg:gap-8">
          <ScrollReveal className="flex h-full flex-col gap-4">
            <div className="relative overflow-hidden rounded-md border border-border-muted bg-surface-raised">
              <div className="relative aspect-[2/1] w-full sm:aspect-[21/9]">
                <Image
                  src="/contact/contact-collab-visual.webp"
                  alt="Stylized AI illustration of a frontend engineer collaborating over digital messages and UI panels"
                  fill
                  className="object-cover object-[center_30%]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  unoptimized
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface-base/80 via-transparent to-transparent"
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(125,211,252,0.18),transparent_55%)]"
                  aria-hidden
                />
              </div>
            </div>

            <div className="grid flex-1 content-start gap-2 sm:grid-cols-2">
              <div className="flex items-center gap-2.5 rounded-sm border border-border-muted bg-surface-raised px-3 py-2.5 sm:col-span-2">
                <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-xs border border-border-muted bg-surface-muted text-text-primary">
                  <MapPin size={15} aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold tracking-[0.12em] text-text-tertiary uppercase">
                    Location
                  </p>
                  <p className="mt-0.5 text-[13px] font-medium text-text-primary">
                    {site.location}
                  </p>
                </div>
              </div>

              <ContactChannel
                label="Email"
                href={`mailto:${site.email}`}
                value={site.email}
                icon={<Mail size={15} aria-hidden />}
              />
              {site.phone ? (
                <ContactChannel
                  label="Phone"
                  href={`tel:${site.phone.replace(/\s/g, "")}`}
                  value={`+91 ${site.phone}`}
                  icon={<Phone size={15} aria-hidden />}
                />
              ) : null}
              {site.github ? (
                <ContactChannel
                  label="GitHub"
                  href={site.github}
                  value={`@${site.githubUser}`}
                  icon={<GithubMark />}
                  external
                />
              ) : null}
              {site.linkedin ? (
                <ContactChannel
                  label="LinkedIn"
                  href={site.linkedin}
                  value="divyanshu-kashyap"
                  icon={<Link2 size={15} aria-hidden />}
                  external
                />
              ) : null}
              {site.leetcode ? (
                <div className="sm:col-span-2">
                  <ContactChannel
                    label="LeetCode"
                    href={site.leetcode}
                    value={`@${site.leetcodeUser}`}
                    icon={<Code2 size={15} aria-hidden />}
                    external
                  />
                </div>
              ) : null}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.06} className="flex h-full min-h-0">
            <div className="flex h-full w-full flex-col rounded-md border border-border-muted bg-surface-raised p-5 shadow-soft md:p-6">
              <div className="mb-5 shrink-0">
                <p className="text-[11px] font-semibold tracking-[0.16em] text-accent-cyan uppercase">
                  Send a message
                </p>
                <p className="mt-1.5 text-xl font-semibold tracking-tight text-text-primary">
                  Tell me about your project
                </p>
                <Text tone="muted" className="mt-1.5 text-sm leading-relaxed">
                  I usually reply within 24–48 hours.
                </Text>
              </div>

              <form
                onSubmit={onSubmit}
                noValidate
                aria-describedby={error ? `${formId}-error` : undefined}
                className="flex min-h-0 flex-1 flex-col gap-4"
              >
                <div className="grid shrink-0 gap-4 sm:grid-cols-2">
                  <div>
                    <Field id={`${formId}-name`} label="Name">
                      <Input
                        id={`${formId}-name`}
                        name="name"
                        type="text"
                        autoComplete="name"
                        placeholder="Your full name"
                        required
                        invalid={invalid.name}
                        onChange={() =>
                          setInvalid((prev) => ({ ...prev, name: false }))
                        }
                      />
                    </Field>
                  </div>
                  <div>
                    <Field id={`${formId}-email`} label="Email">
                      <Input
                        id={`${formId}-email`}
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@company.com"
                        required
                        invalid={invalid.email}
                        onChange={() =>
                          setInvalid((prev) => ({ ...prev, email: false }))
                        }
                      />
                    </Field>
                  </div>
                </div>

                <Field
                  id={`${formId}-message`}
                  label="Message"
                  className="flex min-h-0 flex-1 flex-col [&_textarea]:min-h-[120px] [&_textarea]:flex-1 lg:[&_textarea]:min-h-[180px]"
                >
                  <Textarea
                    id={`${formId}-message`}
                    name="message"
                    rows={5}
                    placeholder="What are you building? Timeline, goals, or how I can help…"
                    required
                    invalid={invalid.message}
                    className="resize-y"
                    onChange={() =>
                      setInvalid((prev) => ({ ...prev, message: false }))
                    }
                  />
                </Field>

                <div className="mt-auto space-y-3 pt-1">
                  {error ? (
                    <p
                      id={`${formId}-error`}
                      className="field-error"
                      role="alert"
                    >
                      <AlertCircle
                        size={16}
                        className="mt-0.5 shrink-0"
                        aria-hidden
                      />
                      <span>{error}</span>
                    </p>
                  ) : null}
                  {status === "success" ? (
                    <p
                      className="rounded-xs border border-accent-cyan/30 bg-accent-cyan/10 px-3 py-2.5 text-sm font-medium text-accent-cyan"
                      role="status"
                    >
                      Opening your email client…
                    </p>
                  ) : null}

                  <div className="flex justify-center pt-1">
                    <Button
                      type="submit"
                      size="lg"
                      className="min-w-[200px] sm:min-w-[220px]"
                      loading={status === "loading"}
                    >
                      Send Message
                      <ArrowUpRight size={15} aria-hidden />
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}
