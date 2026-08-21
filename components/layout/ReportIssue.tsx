"use client";

import {
  FormEvent,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bug,
  Clock3,
  FileDown,
  Send,
  X,
} from "lucide-react";
import { Button, Field, Input, Textarea } from "@/components/ui";
import { useSiteAnalytics } from "@/hooks/useSiteAnalytics";
import { navItems, site } from "@/lib/content";
import { scrollToTop } from "@/lib/scroll";
import { cn } from "@/lib/utils";

const SECTION_OPTIONS = [
  { id: "top", label: "Hero (#top)" },
  ...navItems.map((item) => ({
    id: item.id,
    label: `${item.label} (#${item.id})`,
  })),
  { id: "footer", label: "Footer (#footer)" },
  { id: "other", label: "Other / Not sure" },
] as const;

type ReportIssueModalProps = {
  open: boolean;
  onClose: () => void;
};

function MetaChip({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-2.5 rounded-sm border border-border-muted bg-surface-muted/80 px-3 py-2.5">
      <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-xs bg-surface-raised text-accent-amber">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="font-mono text-[9px] tracking-[0.14em] text-text-tertiary uppercase">
          {label}
        </p>
        <p className="mt-0.5 truncate font-mono text-[12px] font-semibold tabular-nums text-text-primary">
          {value}
        </p>
      </div>
    </div>
  );
}

export function ReportIssueModal({ open, onClose }: ReportIssueModalProps) {
  const titleId = useId();
  const formId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [happened, setHappened] = useState("");
  const [section, setSection] = useState<string>("contact");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [status, setStatus] = useState<"idle" | "sent">("idle");
  const {
    visitDurationLabel,
    resumeDownloads,
    visits,
    avgDurationLabel,
    ready,
  } = useSiteAnalytics();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    const timer = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>("textarea")?.focus();
    }, 40);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(timer);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setStatus("idle");
      setInvalid(false);
    }
  }, [open]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = happened.trim();
    if (!message) {
      setInvalid(true);
      return;
    }

    const sectionLabel =
      SECTION_OPTIONS.find((opt) => opt.id === section)?.label ?? section;
    const resumeLabel = ready
      ? `${resumeDownloads} ${resumeDownloads === 1 ? "download" : "downloads"}`
      : "n/a";

    const body = [
      message,
      "",
      "— Report context —",
      `Where: ${sectionLabel}`,
      `Visit duration: ${visitDurationLabel}`,
      `Resume downloads (site): ${resumeLabel}`,
      `Visits (site): ${ready ? visits : "n/a"}`,
      `Avg. duration (site): ${ready ? avgDurationLabel : "n/a"}`,
      `Page URL: ${typeof window !== "undefined" ? window.location.href : site.mark}`,
      `User agent: ${typeof navigator !== "undefined" ? navigator.userAgent : "n/a"}`,
      "",
      name.trim() ? `Name: ${name.trim()}` : null,
      email.trim() ? `Email: ${email.trim()}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const subject = encodeURIComponent(
      `Portfolio issue report — ${sectionLabel}`,
    );
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${encodeURIComponent(body)}`;
    setStatus("sent");
  }

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center p-3 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            aria-label="Close report dialog backdrop"
            className="absolute inset-0 bg-surface-base/70 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className={cn(
              "relative z-10 flex max-h-[min(92vh,720px)] w-full max-w-lg flex-col overflow-hidden",
              "rounded-md border border-border-muted bg-surface-raised shadow-accent-lg",
            )}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-start justify-between gap-3 border-b border-border-muted px-5 py-4 sm:px-6">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="inline-flex size-8 items-center justify-center rounded-full bg-rose-500/15 text-rose-400">
                    <Bug size={16} aria-hidden />
                  </span>
                  <h2
                    id={titleId}
                    className="font-mono text-sm font-bold tracking-[0.12em] text-rose-400 uppercase sm:text-[15px]"
                  >
                    Something not working?
                  </h2>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  Found a bug or something that doesn&apos;t look right? Help me
                  improve the experience by letting me know.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                data-cursor="hover"
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-border-muted bg-surface-muted text-text-secondary transition-colors duration-fast hover:border-accent-cyan/50 hover:text-text-primary"
              >
                <X size={16} aria-hidden />
              </button>
            </div>

            <form
              onSubmit={onSubmit}
              noValidate
              className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-5 py-4 sm:px-6 sm:py-5"
            >
              <div className="grid gap-2 sm:grid-cols-2">
                <MetaChip
                  icon={<Clock3 size={14} aria-hidden />}
                  label="Visit Duration"
                  value={visitDurationLabel}
                />
                <MetaChip
                  icon={<FileDown size={14} aria-hidden />}
                  label="Resume Downloads"
                  value={
                    ready
                      ? String(resumeDownloads)
                      : "—"
                  }
                />
              </div>

              <Field
                id={`${formId}-happened`}
                label="What happened?*"
                error={invalid ? "Please describe what went wrong." : undefined}
              >
                <Textarea
                  id={`${formId}-happened`}
                  name="happened"
                  rows={4}
                  placeholder="Tell me what went wrong…"
                  required
                  invalid={invalid}
                  value={happened}
                  onChange={(event) => {
                    setHappened(event.target.value);
                    if (invalid) setInvalid(false);
                  }}
                />
              </Field>

              <Field id={`${formId}-where`} label="Where did it happen?">
                <select
                  id={`${formId}-where`}
                  name="where"
                  value={section}
                  onChange={(event) => setSection(event.target.value)}
                  className="field"
                >
                  {SECTION_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field id={`${formId}-name`} label="Name (optional)">
                  <Input
                    id={`${formId}-name`}
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                </Field>
                <Field id={`${formId}-email`} label="Email (optional)">
                  <Input
                    id={`${formId}-email`}
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </Field>
              </div>

              {status === "sent" ? (
                <p
                  className="rounded-xs border border-accent-cyan/30 bg-accent-cyan/10 px-3 py-2.5 text-sm font-medium text-accent-cyan"
                  role="status"
                >
                  Opening your email client…
                </p>
              ) : null}

              <Button
                type="submit"
                size="lg"
                fullWidth
                magnetic={false}
                className="mt-1 bg-accent-amber text-text-inverse hover:bg-[color-mix(in_srgb,var(--theme-accent-amber)_88%,black)]"
              >
                Send Report
                <Send size={15} aria-hidden />
              </Button>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

export function ReportIssueTrigger({
  className,
  onClick,
}: {
  className?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-cursor="hover"
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-rose-400/40 bg-rose-400/10 px-3.5 py-1.5",
        "font-mono text-[11px] font-semibold tracking-[0.04em] text-rose-400",
        "transition-[border-color,background-color,color] duration-fast",
        "hover:border-rose-400/70 hover:bg-rose-400/18 hover:text-rose-300",
        className,
      )}
    >
      <Bug size={13} strokeWidth={2.25} aria-hidden />
      Report an Issue
    </button>
  );
}

export function FooterIssueBar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 sm:justify-center">
        <ReportIssueTrigger onClick={() => setOpen(true)} />
        <span className="h-4 w-px bg-border-muted" aria-hidden />
        <button
          type="button"
          onClick={scrollToTop}
          data-cursor="hover"
          className="font-mono text-[11px] font-semibold tracking-[0.12em] text-accent-amber uppercase transition-colors duration-fast hover:text-accent-cyan"
        >
          Terminal_return_top ↑
        </button>
      </div>

      <ReportIssueModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
