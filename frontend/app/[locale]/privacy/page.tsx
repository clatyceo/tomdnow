import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("privacy");
  return {
    title: t("metaTitle"),
  };
}

export default async function Privacy() {
  const t = await getTranslations("privacy");
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900">{t("title")}</h1>
      <div className="mt-6 space-y-4 text-gray-600 leading-relaxed text-sm">
        <p>{t("lastUpdated")}</p>
        <h2 className="text-lg font-semibold text-gray-900 pt-4">{t("dataCollectionTitle")}</h2>
        <p>{t("dataCollectionText")}</p>
        <h2 className="text-lg font-semibold text-gray-900 pt-4">{t("fileProcessingTitle")}</h2>
        <p>{t("fileProcessingText")}</p>
        <h2 className="text-lg font-semibold text-gray-900 pt-4">{t("analyticsTitle")}</h2>
        <p>{t("analyticsText")}</p>
        <h2 className="text-lg font-semibold text-gray-900 pt-4">{t("contactTitle")}</h2>
        <p>{t("contactText")}</p>
      </div>
    </div>
  );
}
