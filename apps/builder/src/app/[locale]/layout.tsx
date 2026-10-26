import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { defaultLocale, isLocale, localeInfo } from "@ladestack/i18n";
import "@ladestack/design-tokens/tokens.css";
import "../globals.css";

// Every response carries a fresh CSP nonce (src/middleware.ts), so pages render per request.
export const dynamic = "force-dynamic";
// Unknown locales are rejected below with notFound(), since pages are no longer prerendered.

export const metadata: Metadata = {
  title: "LadeStack Build",
  robots: { index: false, follow: false },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === defaultLocale) notFound();
  const info = localeInfo[locale];
  return (
    <html lang={info.bcp47} dir={info.dir}>
      <body>{children}</body>
    </html>
  );
}
