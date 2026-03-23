import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { tools } from "@/lib/tools";
import OcrConverterPage from "@/components/ocr-converter-page";
import SeoContent from "@/components/seo-content";

const tool = tools.ocr;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: `tools.${tool.key}` });
  return {
    title: t("title"),
    description: t("seoDescription"),
    keywords: t("seoKeywords"),
  };
}

export default function ImageOcrToMarkdown() {
  return (
    <>
      <OcrConverterPage tool={tool} />
      <SeoContent tool={tool} />
    </>
  );
}
