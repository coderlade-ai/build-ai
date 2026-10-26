import type { Locale } from "@ladestack/i18n";
import { en, type PagesDictionary } from "./pages/en";
import { fr } from "./pages/fr";
import { ja } from "./pages/ja";
import { ko } from "./pages/ko";
import { pt } from "./pages/pt";
import { ru } from "./pages/ru";
import { tr } from "./pages/tr";
import { zh } from "./pages/zh";

export const pageDictionaries: Record<Locale, PagesDictionary> = { en, ru, ja, ko, zh, tr, fr, pt };

export function tp(locale: Locale): PagesDictionary {
  return pageDictionaries[locale];
}

/** Date the legal drafts were last changed. Update with every legal text edit. */
export const legalUpdated = "2026-10-25";

/** Third-party projects credited on /open-source. Names and licences are not translated. */
export const credits = [
  { name: "Astro", licence: "MIT", url: "https://github.com/withastro/astro", planned: false },
  { name: "Next.js", licence: "MIT", url: "https://github.com/vercel/next.js", planned: false },
  { name: "React", licence: "MIT", url: "https://github.com/facebook/react", planned: false },
  {
    name: "TypeScript",
    licence: "Apache-2.0",
    url: "https://github.com/microsoft/TypeScript",
    planned: false,
  },
  {
    name: "Monaco Editor",
    licence: "MIT",
    url: "https://github.com/microsoft/monaco-editor",
    planned: true,
  },
  { name: "Kilo Code", licence: "MIT", url: "https://github.com/Kilo-Org/kilocode", planned: true },
] as const;

/** Public source repository: the project's only published contact channel. */
export const repoUrl = "https://github.com/girishlade111/build-ai";

/** Sub-pages that exist in every locale. */
export const legalPages = [
  "about",
  "contact",
  "privacy",
  "terms",
  "disclaimer",
  "open-source",
] as const;
export type LegalPage = (typeof legalPages)[number];

export type { PagesDictionary };
