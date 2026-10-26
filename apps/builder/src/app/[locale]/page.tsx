import { notFound } from "next/navigation";
import { defaultLocale, isLocale } from "@ladestack/i18n";
import { ShellPage } from "../../components/ShellPage";

export default async function LocalizedBuilderHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === defaultLocale) notFound();
  return <ShellPage locale={locale} />;
}
