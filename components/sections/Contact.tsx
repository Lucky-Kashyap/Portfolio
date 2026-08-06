"use client";

import { FormEvent, useId, useState } from "react";
import {
  Button,
  Card,
  Field,
  Input,
  Section,
  SectionHeader,
  Stack,
  Text,
  TextLink,
  Textarea,
} from "@/components/ui";
import { site } from "@/lib/content";

type Status = "idle" | "loading" | "success" | "error";

type ContactMetaProps = {
  label: string;
  href: string;
  value: string;
  external?: boolean;
};

function ContactMeta({ label, href, value, external }: ContactMetaProps) {
  return (
    <div>
      <dt className="text-sm tracking-[0.12em] text-text-muted uppercase">
        {label}
      </dt>
      <dd className="mt-1">
        <TextLink href={href} external={external}>
          {value}
        </TextLink>
      </dd>
    </div>
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
    <Section
      id="contact"
      atmosphere
      className="border-t border-border-muted"
      containerClassName="grid gap-12 lg:grid-cols-2 lg:gap-16"
      aria-labelledby="contact-heading"
    >
      <div>
        <SectionHeader
          eyebrow="Contact"
          title="Let's build something extraordinary together."
          titleId="contact-heading"
          description={site.connect}
          titleClassName="max-w-xl"
        />

        <dl className="mt-8 space-y-4 text-md">
          {site.address ? (
            <div>
              <dt className="text-sm tracking-[0.12em] text-text-muted uppercase">
                Location
              </dt>
              <dd className="mt-1 text-text-primary">
                {site.address}
                <span className="text-text-muted"> · {site.location}</span>
              </dd>
            </div>
          ) : null}
          <ContactMeta
            label="Email"
            href={`mailto:${site.email}`}
            value={site.email}
          />
          {site.phone ? (
            <ContactMeta
              label="Phone"
              href={`tel:${site.phone.replace(/\s/g, "")}`}
              value={`+91 ${site.phone}${site.phoneLabel ? ` (${site.phoneLabel})` : ""}`}
            />
          ) : null}
          {site.github ? (
            <ContactMeta
              label="GitHub"
              href={site.github}
              value={`@${site.githubUser}`}
              external
            />
          ) : null}
          {site.linkedin ? (
            <ContactMeta
              label="LinkedIn"
              href={site.linkedin}
              value="divyanshu-kashyap"
              external
            />
          ) : null}
        </dl>
      </div>

      <Card padding="lg">
        <form
          onSubmit={onSubmit}
          noValidate
          aria-describedby={error ? `${formId}-error` : undefined}
        >
          <Stack gap="md">
            <Field id={`${formId}-name`} label="Name">
              <Input
                id={`${formId}-name`}
                name="name"
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
            <Field id={`${formId}-message`} label="Message">
              <Textarea
                id={`${formId}-message`}
                name="message"
                rows={5}
                placeholder="Tell me about the project"
                required
              />
            </Field>
          </Stack>

          {error ? (
            <p id={`${formId}-error`} className="field-error" role="alert">
              {error}
            </p>
          ) : null}
          {status === "success" ? (
            <Text size="sm" className="mt-3" role="status">
              Opening your email client…
            </Text>
          ) : null}

          <Button
            type="submit"
            className="mt-6 w-full sm:w-auto"
            loading={status === "loading"}
          >
            Send Message
          </Button>
        </form>
      </Card>
    </Section>
  );
}
