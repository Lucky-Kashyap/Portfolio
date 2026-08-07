import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const sections: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"] }[] = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/#about", priority: 0.9, changeFrequency: "monthly" },
    { path: "/#experience", priority: 0.85, changeFrequency: "monthly" },
    { path: "/#skills", priority: 0.8, changeFrequency: "monthly" },
    { path: "/#certifications", priority: 0.75, changeFrequency: "monthly" },
    { path: "/#services", priority: 0.85, changeFrequency: "monthly" },
    { path: "/#projects", priority: 0.9, changeFrequency: "weekly" },
    { path: "/#faq", priority: 0.8, changeFrequency: "monthly" },
    { path: "/#contact", priority: 0.85, changeFrequency: "monthly" },
    { path: "/llms.txt", priority: 0.6, changeFrequency: "monthly" },
    { path: "/llms-full.txt", priority: 0.7, changeFrequency: "weekly" },
  ];

  return sections.map(({ path, priority, changeFrequency }) => ({
    url: `${siteUrl}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
