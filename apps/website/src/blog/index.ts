import { getCollection, type CollectionEntry } from "astro:content";
import { locales, type Locale } from "@ladestack/i18n";
import { validateBlog } from "./validate";

export type Article = CollectionEntry<"blog"> & { translationId: string; locale: Locale };

/** All published editions. Throws at build time when the blog breaks the eight-language rule. */
export async function publishedArticles(): Promise<Article[]> {
  const entries = await getCollection("blog");
  const { editions, problems } = validateBlog(
    entries.map((e) => ({ id: e.id, slug: e.data.slug, draft: e.data.draft })),
  );
  if (problems.length > 0) throw new Error(`Blog content is invalid:\n- ${problems.join("\n- ")}`);
  return editions
    .filter((e) => !e.draft)
    .map((e) => {
      const entry = entries.find((x) => x.id === e.id)!;
      return { ...entry, translationId: e.translationId, locale: e.locale };
    })
    .sort((a, b) => b.data.published.getTime() - a.data.published.getTime());
}

/** Path (after the locale prefix) of each edition of an article, for hreflang and the switcher. */
export function articlePaths(all: Article[], translationId: string): Record<Locale, string> {
  return Object.fromEntries(
    locales.map((l) => {
      const e = all.find((a) => a.translationId === translationId && a.locale === l);
      return [l, `/blog/${e?.data.slug ?? ""}`];
    }),
  ) as Record<Locale, string>;
}
