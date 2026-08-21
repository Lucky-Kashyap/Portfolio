import { NextResponse } from "next/server";
import {
  averageDurationSec,
  formatDurationMmSs,
  type AnalyticsEvent,
} from "@/lib/analytics";
import { getAnalytics, recordAnalyticsEvent } from "@/lib/analytics-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function publicPayload(stats: Awaited<ReturnType<typeof getAnalytics>>) {
  const avgSec = averageDurationSec(stats);
  return {
    visits: stats.visits,
    resumeDownloads: stats.resumeDownloads,
    avgDurationSec: avgSec,
    avgDurationLabel: formatDurationMmSs(avgSec),
  };
}

export async function GET() {
  const stats = await getAnalytics();
  return NextResponse.json(publicPayload(stats), {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const type =
    body && typeof body === "object" && "type" in body
      ? (body as { type?: unknown }).type
      : undefined;

  let event: AnalyticsEvent | null = null;
  if (type === "visit") event = { type: "visit" };
  else if (type === "resume") event = { type: "resume" };
  else if (type === "duration") {
    const seconds =
      body && typeof body === "object" && "seconds" in body
        ? Number((body as { seconds?: unknown }).seconds)
        : NaN;
    if (!Number.isFinite(seconds)) {
      return NextResponse.json({ error: "Invalid seconds" }, { status: 400 });
    }
    event = { type: "duration", seconds };
  }

  if (!event) {
    return NextResponse.json({ error: "Unknown event" }, { status: 400 });
  }

  const stats = await recordAnalyticsEvent(event);
  return NextResponse.json(publicPayload(stats), {
    headers: { "Cache-Control": "no-store" },
  });
}
