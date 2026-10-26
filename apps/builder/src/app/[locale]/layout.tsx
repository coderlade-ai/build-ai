import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { defaultLocale, isLocale, localeInfo, locales } from "@ladestack/i18n";
import "@ladestack/design-tokens/tokens.css";
import "../globals.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.filter((l) => l !== defaultLocale).map((locale) => ({ locale }));
}

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
