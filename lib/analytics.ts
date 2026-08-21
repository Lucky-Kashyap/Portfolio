export type SiteAnalytics = {
  visits: number;
  /** Sum of completed session durations in seconds */
  totalDurationSec: number;
  /** Sessions that contributed to totalDurationSec */
  durationSamples: number;
  resumeDownloads: number;
};

export const ANALYTICS_DEFAULTS: SiteAnalytics = {
  visits: 0,
  totalDurationSec: 0,
  durationSamples: 0,
  resumeDownloads: 0,
};

export type AnalyticsEvent =
  | { type: "visit" }
  | { type: "duration"; seconds: number }
  | { type: "resume" };

export function averageDurationSec(stats: SiteAnalytics): number {
  if (stats.durationSamples <= 0) return 0;
  return Math.round(stats.totalDurationSec / stats.durationSamples);
}

/** Format as MM:SS (footer Avg. Duration). */
export function formatDurationMmSs(totalSeconds: number): string {
  const sec = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/** Format as HH:MM:SS (live visit duration). */
export function formatDurationHhMmSs(totalSeconds: number): string {
  const sec = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function applyAnalyticsEvent(
  current: SiteAnalytics,
  event: AnalyticsEvent,
): SiteAnalytics {
  switch (event.type) {
    case "visit":
      return { ...current, visits: current.visits + 1 };
    case "resume":
      return { ...current, resumeDownloads: current.resumeDownloads + 1 };
    case "duration": {
      const seconds = Math.max(0, Math.min(Math.floor(event.seconds), 60 * 60 * 6));
      if (seconds < 3) return current;
      return {
        ...current,
        totalDurationSec: current.totalDurationSec + seconds,
        durationSamples: current.durationSamples + 1,
      };
    }
    default:
      return current;
  }
}
