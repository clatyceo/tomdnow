"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const CONSENT_KEY = "cookie-consent";
const GA_ID_PATTERN = /^G-[A-Z0-9]+$/;

export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    const checkConsent = () => {
      const consent = localStorage.getItem(CONSENT_KEY);
      setHasConsent(consent === "accepted");
    };

    checkConsent();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === CONSENT_KEY) {
        checkConsent();
      }
    };

    // Listen for consent changes from other tabs
    window.addEventListener("storage", handleStorage);

    // Listen for consent changes within the same tab (custom event)
    const handleConsentChange = () => checkConsent();
    window.addEventListener("cookie-consent-change", handleConsentChange);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("cookie-consent-change", handleConsentChange);
    };
  }, []);

  if (!gaId || !GA_ID_PATTERN.test(gaId) || !hasConsent) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-config" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');`}
      </Script>
    </>
  );
}
