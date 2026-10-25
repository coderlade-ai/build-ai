/**
 * The eight supported locales (PRD owner decision 5). English is the default
 * and is served without a prefix; every other locale uses its code as prefix.
 * Portuguese variant is pending owner confirmation (ADR 0012, proposed pt-BR).
 */
export const locales = ["en", "ru", "ja", "ko", "zh", "tr", "fr", "pt"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export interface LocaleInfo {
  /** Name of the language in that language. */
  nativeName: string;
  /** English name, for internal tooling. */
  englishName: string;
  /** BCP 47 tag used in `lang` and `hreflang`. */
  bcp47: string;
  dir: "ltr" | "rtl";
}

export const localeInfo: Record<Locale, LocaleInfo> = {
  en: { nativeName: "English", englishName: "English", bcp47: "en", dir: "ltr" },
  ru: { nativeName: "Русский", englishName: "Russian", bcp47: "ru", dir: "ltr" },
  ja: { nativeName: "日本語", englishName: "Japanese", bcp47: "ja", dir: "ltr" },
  ko: { nativeName: "한국어", englishName: "Korean", bcp47: "ko", dir: "ltr" },
  zh: { nativeName: "简体中文", englishName: "Chinese (Simplified)", bcp47: "zh-Hans", dir: "ltr" },
  tr: { nativeName: "Türkçe", englishName: "Turkish", bcp47: "tr", dir: "ltr" },
  fr: { nativeName: "Français", englishName: "French", bcp47: "fr", dir: "ltr" },
  pt: { nativeName: "Português", englishName: "Portuguese", bcp47: "pt", dir: "ltr" },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Path prefix for a locale: "" for English, "/ru" for Russian, etc. */
export function localePrefix(locale: Locale): string {
  return locale === defaultLocale ? "" : `/${locale}`;
}

/** Builder URL that carries the selected locale (README §7). */
export function builderPath(locale: Locale): string {
  return locale === defaultLocale ? "/app" : `/app/${locale}`;
}
