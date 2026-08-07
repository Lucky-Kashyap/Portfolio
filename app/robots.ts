import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

export const dynamic = "force-static";

/** Major search + AI / answer-engine crawlers (GEO) */
const AI_USER_AGENTS = [
  "GPTBot",
  "ChatGPT-User",
  "Google-Extended",
  "Googlebot",
  "Googlebot-Image",
  "Bingbot",
  "Applebot",
  "Applebot-Extended",
  "anthropic-ai",
  "ClaudeBot",
  "Claude-Web",
  "PerplexityBot",
  "Bytespider",
  "CCBot",
  "meta-externalagent",
  "FacebookBot",
  "cohere-ai",
  "Diffbot",
  "Omgilibot",
  "YouBot",
] as const;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/llms.txt", "/llms-full.txt"],
      },
      ...AI_USER_AGENTS.map((userAgent) => ({
        userAgent,
        allow: ["/", "/llms.txt", "/llms-full.txt", "/sitemap.xml"],
      })),
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
