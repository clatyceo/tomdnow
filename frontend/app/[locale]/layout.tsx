import type { Metadata } from "next";
import { Sora, Instrument_Serif } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/navigation";
import { SITE_URL } from "@/lib/config";
import Header from "@/components/header";
import Footer from "@/components/footer";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("title"),
    description: t("description"),
    metadataBase: new URL("https://tomdnow.com"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
    },
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `https://tomdnow.com/${l}`])
      ),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) notFound();

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${sora.variable} ${instrumentSerif.variable} font-sans antialiased bg-[#f5f5fa] text-gray-900`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "tomdnow",
              url: SITE_URL,
              description:
                "Free online tool to convert any file to Markdown",
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "tomdnow",
              url: SITE_URL,
            }),
          }}
        />
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="pt-15">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
