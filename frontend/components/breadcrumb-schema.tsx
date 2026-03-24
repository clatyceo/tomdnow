import { SITE_URL, SITE_NAME } from "@/lib/config";

interface BreadcrumbItem {
  name: string;
  href?: string;
}

export function BreadcrumbSchema({ items, locale }: { items: BreadcrumbItem[]; locale: string }) {
  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: SITE_NAME,
        item: `${SITE_URL}/${locale}`,
      },
      ...items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: item.name,
        ...(item.href ? { item: `${SITE_URL}/${locale}${item.href}` } : {}),
      })),
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }}
    />
  );
}
