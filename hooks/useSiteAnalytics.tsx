"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  formatDurationHhMmSs,
  formatDurationMmSs,
} from "@/lib/analytics";

const VISIT_FLAG = "portfolio-analytics-visit";
const SESSION_START = "portfolio-analytics-session-start";
const DURATION_SENT = "portfolio-analytics-duration-sent";

type PublicStats = {
  visits: number;
  resumeDownloads: number;
  avgDurationSec: number;
  avgDurationLabel: string;
};

type AnalyticsContextValue = {
  visits: number;
  resumeDownloads: number;
  avgDurationLabel: string;
  /** Live timer for the current page session */
  visitDurationLabel: string;
  visitDurationSec: number;
  ready: boolean;
  trackResumeDownload: () => void;
};

const AnalyticsContext = createContext<AnalyticsContextValue | null>(null);

function readSessionStart(): number {
  try {
    const existing = sessionStorage.getItem(SESSION_START);
    if (existing) {
      const n = Number(existing);
      if (Number.isFinite(n) && n > 0) return n;
    }
    const now = Date.now();
    sessionStorage.setItem(SESSION_START, String(now));
    return now;
  } catch {
    return Date.now();
  }
}

async function postEvent(
  body: { type: "visit" } | { type: "resume" } | { type: "duration"; seconds: number },
): Promise<PublicStats | null> {
  try {
    const res = await fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: body.type === "duration",
    });
    if (!res.ok) return null;
    return (await res.json()) as PublicStats;
  } catch {
    return null;
  }
}

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const [visits, setVisits] = useState(0);
  const [resumeDownloads, setResumeDownloads] = useState(0);
  const [avgDurationSec, setAvgDurationSec] = useState(0);
  const [visitDurationSec, setVisitDurationSec] = useState(0);
  const [ready, setReady] = useState(false);

  const applyStats = useCallback((stats: PublicStats) => {
    setVisits(stats.visits);
    setResumeDownloads(stats.resumeDownloads);
    setAvgDurationSec(stats.avgDurationSec);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let durationSent = false;
    const startedAt = readSessionStart();

    const tick = () => {
      setVisitDurationSec(Math.floor((Date.now() - startedAt) / 1000));
    };
    tick();
    const timer = window.setInterval(tick, 1000);

    async function bootstrap() {
      try {
        const res = await fetch("/api/analytics", { cache: "no-store" });
        if (res.ok) {
          const stats = (await res.json()) as PublicStats;
          if (!cancelled) applyStats(stats);
        }
      } catch {
        /* ignore */
      }

      let recordedVisit = false;
      try {
        recordedVisit = sessionStorage.getItem(VISIT_FLAG) === "1";
      } catch {
        recordedVisit = false;
      }

      if (!recordedVisit) {
        const stats = await postEvent({ type: "visit" });
        try {
          sessionStorage.setItem(VISIT_FLAG, "1");
        } catch {
          /* ignore */
        }
        if (stats && !cancelled) applyStats(stats);
      }

      if (!cancelled) setReady(true);
    }

    void bootstrap();

    const flushDuration = () => {
      try {
        if (sessionStorage.getItem(DURATION_SENT) === "1") return;
      } catch {
        if (durationSent) return;
      }
      const seconds = Math.floor((Date.now() - startedAt) / 1000);
      if (seconds < 3) return;
      durationSent = true;
      try {
        sessionStorage.setItem(DURATION_SENT, "1");
      } catch {
        /* ignore */
      }
      void postEvent({ type: "duration", seconds });
    };

    window.addEventListener("pagehide", flushDuration);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
      window.removeEventListener("pagehide", flushDuration);
    };
  }, [applyStats]);

  const trackResumeDownload = useCallback(() => {
    setResumeDownloads((n) => n + 1);
    void postEvent({ type: "resume" }).then((stats) => {
      if (stats) applyStats(stats);
    });
  }, [applyStats]);

  const value = useMemo<AnalyticsContextValue>(
    () => ({
      visits,
      resumeDownloads,
      avgDurationLabel: formatDurationMmSs(avgDurationSec),
      visitDurationLabel: formatDurationHhMmSs(visitDurationSec),
      visitDurationSec,
      ready,
      trackResumeDownload,
    }),
    [
      visits,
      resumeDownloads,
      avgDurationSec,
      visitDurationSec,
      ready,
      trackResumeDownload,
    ],
  );

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useSiteAnalytics(): AnalyticsContextValue {
  const ctx = useContext(AnalyticsContext);
  if (!ctx) {
    return {
      visits: 0,
      resumeDownloads: 0,
      avgDurationLabel: "00:00",
      visitDurationLabel: "00:00:00",
      visitDurationSec: 0,
      ready: false,
      trackResumeDownload: () => undefined,
    };
  }
  return ctx;
}
