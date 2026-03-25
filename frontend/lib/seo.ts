import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/config";
import { routing } from "@/i18n/navigation";

interface PageMetadataOptions {
  locale: string;
  path: string;
  title: string;
  description: string;
  keywords?: string;
  ogType?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
}

export function generatePageMetadata({
  locale, path, title, description, keywords,
  ogType = "website", publishedTime, modifiedTime, authors,
}: PageMetadataOptions): Metadata {
  const fullPath = path ? `/${locale}/${path}` : `/${locale}`;
  const canonicalUrl = `${SITE_URL}${fullPath}`;

  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = `${SITE_URL}${path ? `/${l}/${path}` : `/${l}`}`;
  }
  languages["x-default"] = `${SITE_URL}${path ? `/en/${path}` : "/en"}`;

  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: SITE_NAME }],
      type: ogType,
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
      ...(authors ? { authors } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/og-image.png`],
    },
  };
}
