import type { MetadataRoute } from "next";
import { tools } from "@/lib/tools";
import { SITE_URL } from "@/lib/config";
import { locales } from "@/i18n/config";
import { getAllBlogSlugs } from "@/lib/blog";

const LAST_UPDATE = new Date("2026-03-25");

export default function sitemap(): MetadataRoute.Sitemap {
  const toolSlugs = Object.values(tools).map((t) => t.slug);
  const blogSlugs = getAllBlogSlugs();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    const prefix = `${SITE_URL}/${locale}`;
    entries.push({ url: prefix, lastModified: LAST_UPDATE, changeFrequency: "weekly", priority: 1 });

    for (const slug of toolSlugs) {
      entries.push({ url: `${prefix}/${slug}`, lastModified: LAST_UPDATE, changeFrequency: "monthly", priority: 0.9 });
    }

    entries.push({ url: `${prefix}/blog`, lastModified: LAST_UPDATE, changeFrequency: "weekly", priority: 0.7 });

    for (const slug of blogSlugs) {
      entries.push({ url: `${prefix}/blog/${slug}`, lastModified: LAST_UPDATE, changeFrequency: "monthly", priority: 0.6 });
    }

    entries.push({ url: `${prefix}/about`, lastModified: LAST_UPDATE, changeFrequency: "monthly", priority: 0.3 });
    entries.push({ url: `${prefix}/security`, lastModified: LAST_UPDATE, changeFrequency: "yearly", priority: 0.5 });
    entries.push({ url: `${prefix}/pricing`, lastModified: LAST_UPDATE, changeFrequency: "monthly", priority: 0.4 });
    entries.push({ url: `${prefix}/docs/api`, lastModified: LAST_UPDATE, changeFrequency: "monthly", priority: 0.7 });
    entries.push({ url: `${prefix}/privacy`, lastModified: LAST_UPDATE, changeFrequency: "yearly", priority: 0.1 });
    entries.push({ url: `${prefix}/terms`, lastModified: LAST_UPDATE, changeFrequency: "yearly", priority: 0.1 });
  }

  return entries;
}
