"use client";

import { Clock3, Eye, FileText } from "lucide-react";
import { useSiteAnalytics } from "@/hooks/useSiteAnalytics";
import { cn } from "@/lib/utils";

type SiteStatsProps = {
  className?: string;
};

export function SiteStats({ className }: SiteStatsProps) {
  const { visits, avgDurationLabel, resumeDownloads, ready } =
    useSiteAnalytics();

  const items = [
    {
      key: "visits",
      icon: Eye,
      value: ready ? String(visits) : "—",
      label: visits === 1 ? "Visit" : "Visits",
    },
    {
      key: "duration",
      icon: Clock3,
      value: ready ? avgDurationLabel : "—:—",
      label: "Avg. Duration",
    },
    {
      key: "resume",
      icon: FileText,
      value: ready ? String(resumeDownloads) : "—",
      label: resumeDownloads === 1 ? "Resume Download" : "Resume Downloads",
    },
  ] as const;

  return (
    <div
      className={cn("flex flex-col items-center gap-2.5 text-center", className)}
      aria-label="Site activity"
    >
      <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 sm:gap-x-4">
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <li key={item.key} className="flex items-center gap-3 sm:gap-4">
              {index > 0 ? (
                <span
                  className="text-text-tertiary/70 select-none"
                  aria-hidden
                >
                  ·
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1.5 font-mono text-[12px] tracking-tight sm:text-[13px]">
                <Icon
                  size={14}
                  strokeWidth={2}
                  className="shrink-0 text-accent-amber"
                  aria-hidden
                />
                <span className="tabular-nums text-accent-amber">
                  {item.value}
                </span>
                <span className="text-text-secondary">{item.label}</span>
              </span>
            </li>
          );
        })}
      </ul>

      <p className="font-mono text-[10px] tracking-[0.16em] text-text-tertiary uppercase sm:text-[11px]">
        Beta version <span aria-hidden>•</span> More features &amp; details
        coming soon.
      </p>
    </div>
  );
}
