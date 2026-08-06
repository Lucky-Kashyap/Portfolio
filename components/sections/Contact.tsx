"use client";

import { FormEvent, useId, useState, type ReactNode } from "react";
import { ArrowUpRight, Link2, Mail, MapPin, Phone } from "lucide-react";
import {
  Button,
  Container,
  Field,
  Input,
  SectionHeader,
  Text,
  TextLink,
  Textarea,
} from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";
import { site } from "@/lib/content";
import { cn } from "@/lib/utils";

type Status = "idle" | "loading" | "success" | "error";

type ContactChannelProps = {
  label: string;
  value: string;
  href: string;
  icon: ReactNode;
  external?: boolean;
};

function GithubMark({ size = 18 }: { size?: number }) {
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
        "group flex items-start gap-4 rounded-sm border border-border-muted bg-surface-raised p-4 shadow-card",
        "transition-[border-color,box-shadow,transform] duration-fast",
        "hover:-translate-y-0.5 hover:border-border-default hover:shadow-soft",
      )}
    >
      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xs bg-surface-muted text-text-primary">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-medium tracking-[0.16em] text-text-tertiary uppercase">
          {label}
        </span>
        <span className="mt-1 block truncate text-lg text-text-primary group-hover:underline">
          {value}
        </span>
      </span>
      <ArrowUpRight
        size={16}
        className="ml-auto mt-1 shrink-0 text-text-tertiary transition-transform duration-fast group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        aria-hidden
      />
    </TextLink>
  );
}

export function Contact() {
  const formId = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setStatus("loading");

    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();

    if (!name || !email || !message) {
      setStatus("error");
      setError("Please fill in name, email, and message.");
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
      className="section-pad border-t border-border-muted bg-atmosphere"
      aria-labelledby="contact-heading"
    >
      <Container>
        <div className="grid w-full items-start gap-8 lg:grid-cols-2 lg:gap-10">
          <Reveal>
            <p className="mb-4 inline-flex items-center gap-2 rounded-xl border border-border-muted bg-surface-raised px-3 py-1.5 text-xs font-medium tracking-[0.14em] text-text-secondary uppercase shadow-card">
              <span
                className="size-1.5 rounded-full bg-action-primary"
                aria-hidden
              />
              Available for work
            </p>

            <SectionHeader
              eyebrow="Contact"
              title="Let's build something extraordinary together."
              titleId="contact-heading"
              description={site.connect}
              titleClassName="max-w-xl"
            />

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="flex items-start gap-4 rounded-sm border border-border-muted bg-surface-raised p-4 shadow-card">
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xs bg-surface-muted text-text-primary">
                  <MapPin size={18} aria-hidden />
                </span>
                <div>
                  <p className="text-xs font-medium tracking-[0.16em] text-text-tertiary uppercase">
                    Location
                  </p>
                  <p className="mt-1 text-lg text-text-primary">{site.location}</p>
                </div>
              </div>

              <ContactChannel
                label="Email"
                href={`mailto:${site.email}`}
                value={site.email}
                icon={<Mail size={18} aria-hidden />}
              />
              {site.phone ? (
                <ContactChannel
                  label="Phone"
                  href={`tel:${site.phone.replace(/\s/g, "")}`}
                  value={`+91 ${site.phone}`}
                  icon={<Phone size={18} aria-hidden />}
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
                  icon={<Link2 size={18} aria-hidden />}
                  external
                />
              ) : null}
            </div>
          </Reveal>

          <Reveal delay={0.08} className="w-full min-w-0">
            <div className="w-full rounded-md border border-[color-mix(in_srgb,#111_18%,transparent)] bg-surface-muted p-6 shadow-soft md:p-8">
              <div className="mb-6">
                <p className="text-xs font-medium tracking-[0.16em] text-text-tertiary uppercase">
                  Send a message
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-text-primary">
                  Tell me about your project
                </p>
                <Text tone="muted" size="sm" className="mt-2">
                  I usually reply within 24–48 hours.
                </Text>
              </div>

              <form
                onSubmit={onSubmit}
                noValidate
                aria-describedby={error ? `${formId}-error` : undefined}
                className="space-y-5"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field id={`${formId}-name`} label="Name">
                    <Input
                      id={`${formId}-name`}
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Your name"
                      required
                    />
                  </Field>
                  <Field id={`${formId}-email`} label="Email">
                    <Input
                      id={`${formId}-email`}
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@company.com"
                      required
                    />
                  </Field>
                </div>

                <Field id={`${formId}-message`} label="Message">
                  <Textarea
                    id={`${formId}-message`}
                    name="message"
                    rows={6}
                    placeholder="What are you building? Timeline, goals, or how I can help…"
                    required
                  />
                </Field>

                {error ? (
                  <p id={`${formId}-error`} className="field-error" role="alert">
                    {error}
                  </p>
                ) : null}
                {status === "success" ? (
                  <Text size="sm" role="status">
                    Opening your email client…
                  </Text>
                ) : null}

                <Button
                  type="submit"
                  className="w-full"
                  loading={status === "loading"}
                >
                  Send Message
                  <ArrowUpRight size={16} aria-hidden />
                </Button>
              </form>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
