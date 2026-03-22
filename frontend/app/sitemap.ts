import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://tomarkdown.com";

  const toolSlugs = [
    "pdf-to-markdown",
    "docx-to-markdown",
    "pptx-to-markdown",
    "xlsx-to-markdown",
    "xls-to-markdown",
    "msg-to-markdown",
    "youtube-to-markdown",
    "html-to-markdown",
    "epub-to-markdown",
    "image-to-markdown",
    "csv-to-markdown",
    "json-to-markdown",
    "xml-to-markdown",
    "ipynb-to-markdown",
    "zip-to-markdown",
  ];

  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    ...toolSlugs.map((slug) => ({
      url: `${base}/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.1 },
    { url: `${base}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.1 },
  ];
}
