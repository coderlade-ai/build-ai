import { locales, type Locale } from "@ladestack/i18n";

export interface BlogEntryMeta {
  /** Content entry id: "<translationId>/<locale>". */
  id: string;
  slug: string;
  draft: boolean;
}

export interface BlogEdition extends BlogEntryMeta {
  translationId: string;
  locale: Locale;
}

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Checks the blog rules from the spec: every published article exists in all eight
 * languages, an article is published or drafted as a whole set, and slugs are unique
 * per language. Returns readable problems; an empty list means the set is valid.
 */
export function validateBlog(entries: BlogEntryMeta[]): {
  editions: BlogEdition[];
  problems: string[];
} {
  const problems: string[] = [];
  const editions: BlogEdition[] = [];

  for (const e of entries) {
    const parts = e.id.split("/");
    const translationId = parts[0] ?? "";
    const locale = (parts[1] ?? "").replace(/\.mdx?$/, "");
    if (parts.length !== 2 || !(locales as readonly string[]).includes(locale)) {
      problems.push(
        `${e.id}: file must be named <translationId>/<locale>.md with one of ${locales.join(", ")}`,
      );
      continue;
    }
    if (!slugPattern.test(e.slug))
      problems.push(`${e.id}: slug "${e.slug}" must be lowercase words joined by hyphens`);
    editions.push({ ...e, translationId, locale: locale as Locale });
  }

  const byId = new Map<string, BlogEdition[]>();
  for (const e of editions) byId.set(e.translationId, [...(byId.get(e.translationId) ?? []), e]);

  for (const [id, set] of byId) {
    const missing = locales.filter((l) => !set.some((e) => e.locale === l));
    const drafts = set.filter((e) => e.draft).length;
    if (drafts > 0 && drafts < set.length)
      problems.push(`${id}: some editions are drafts and some are not`);
    if (drafts === 0 && missing.length > 0)
      problems.push(`${id}: published without ${missing.join(", ")}`);
  }

  const seen = new Map<string, string>();
  for (const e of editions) {
    const key = `${e.locale}:${e.slug}`;
    const other = seen.get(key);
    if (other && other !== e.translationId)
      problems.push(`${e.locale}: slug "${e.slug}" used by ${other} and ${e.translationId}`);
    seen.set(key, e.translationId);
  }

  return { editions, problems };
}
