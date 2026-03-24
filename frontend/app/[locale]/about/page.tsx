import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { BreadcrumbSchema } from "@/components/breadcrumb-schema";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function About({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <BreadcrumbSchema items={[{ name: "About" }]} locale={locale} />
      <h1 className="text-3xl font-bold text-gray-900">{t("title")}</h1>
      <div className="mt-6 space-y-4 text-gray-600 leading-relaxed">
        <p>{t("p1")}</p>
        <p>{t("p2")}</p>
        <p>{t("p3")}</p>
      </div>
    </div>
  );
}
