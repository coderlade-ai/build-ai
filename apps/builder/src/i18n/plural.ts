import { localeInfo, type Locale } from "@ladestack/i18n";

/**
 * A message with a {count}. Languages that change words by number (en, fr, pt) give the forms
 * by CLDR plural category; ru, ja, ko, zh and tr use one count-neutral sentence.
 */
export type Countable = string | ({ other: string } & Partial<Record<Intl.LDMLPluralRule, string>>);

export function countText(locale: Locale, text: Countable, count: number): string {
  const bcp47 = localeInfo[locale].bcp47;
  const form =
    typeof text === "string"
      ? text
      : (text[new Intl.PluralRules(bcp47).select(count)] ?? text.other);
  return form.replaceAll("{count}", new Intl.NumberFormat(bcp47).format(count));
}

/** Every written form of a message, for checks that each one is filled in and keeps its placeholders. */
export function formsOf(text: Countable): string[] {
  return typeof text === "string" ? [text] : Object.values(text).filter((v): v is string => !!v);
}
