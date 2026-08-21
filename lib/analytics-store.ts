import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  ANALYTICS_DEFAULTS,
  applyAnalyticsEvent,
  type AnalyticsEvent,
  type SiteAnalytics,
} from "@/lib/analytics";

const GLOBAL_KEY = "__portfolio_analytics_store__";

type AnalyticsStore = {
  data: SiteAnalytics;
  writeQueue: Promise<void>;
};

function getStore(): AnalyticsStore {
  const g = globalThis as typeof globalThis & {
    [GLOBAL_KEY]?: AnalyticsStore;
  };
  if (!g[GLOBAL_KEY]) {
    g[GLOBAL_KEY] = {
      data: { ...ANALYTICS_DEFAULTS },
      writeQueue: Promise.resolve(),
    };
  }
  return g[GLOBAL_KEY];
}

function dataFilePath() {
  return path.join(process.cwd(), "data", "analytics.json");
}

function tmpFilePath() {
  return path.join("/tmp", "portfolio-analytics.json");
}

function isValidStats(value: unknown): value is SiteAnalytics {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.visits === "number" &&
    typeof v.totalDurationSec === "number" &&
    typeof v.durationSamples === "number" &&
    typeof v.resumeDownloads === "number"
  );
}

async function readFromDisk(): Promise<SiteAnalytics | null> {
  for (const file of [dataFilePath(), tmpFilePath()]) {
    try {
      const raw = await readFile(file, "utf8");
      const parsed = JSON.parse(raw) as unknown;
      if (isValidStats(parsed)) return parsed;
    } catch {
      /* try next */
    }
  }
  return null;
}

async function writeToDisk(stats: SiteAnalytics) {
  const payload = `${JSON.stringify(stats, null, 2)}\n`;
  try {
    const dir = path.dirname(dataFilePath());
    await mkdir(dir, { recursive: true });
    await writeFile(dataFilePath(), payload, "utf8");
    return;
  } catch {
    /* fall through to /tmp on read-only hosts */
  }
  try {
    await writeFile(tmpFilePath(), payload, "utf8");
  } catch {
    /* memory-only */
  }
}

let hydrated = false;

export async function getAnalytics(): Promise<SiteAnalytics> {
  const store = getStore();
  if (!hydrated) {
    const fromDisk = await readFromDisk();
    if (fromDisk) store.data = fromDisk;
    hydrated = true;
  }
  return { ...store.data };
}

export async function recordAnalyticsEvent(
  event: AnalyticsEvent,
): Promise<SiteAnalytics> {
  const store = getStore();
  await getAnalytics();
  store.data = applyAnalyticsEvent(store.data, event);
  const snapshot = { ...store.data };
  store.writeQueue = store.writeQueue
    .then(() => writeToDisk(snapshot))
    .catch(() => undefined);
  await store.writeQueue;
  return snapshot;
}
