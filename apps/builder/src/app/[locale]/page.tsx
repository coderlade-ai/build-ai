import { notFound } from "next/navigation";
import { defaultLocale, isLocale } from "@ladestack/i18n";
import { Welcome } from "../../components/Welcome";

export default async function LocalizedBuilderHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === defaultLocale) notFound();
  return <Welcome locale={locale} />;
}
