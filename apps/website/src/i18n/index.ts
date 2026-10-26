import type { Locale } from "@ladestack/i18n";
import { en, type Dictionary } from "./dictionaries/en";
import { fr } from "./dictionaries/fr";
import { ja } from "./dictionaries/ja";
import { ko } from "./dictionaries/ko";
import { pt } from "./dictionaries/pt";
import { ru } from "./dictionaries/ru";
import { tr } from "./dictionaries/tr";
import { zh } from "./dictionaries/zh";

/** Every locale must be present; a missing one is a type error. */
export const dictionaries: Record<Locale, Dictionary> = { en, ru, ja, ko, zh, tr, fr, pt };

export function t(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary };
