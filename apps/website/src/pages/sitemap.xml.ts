import type { APIRoute } from "astro";
import { localeInfo, localePrefix, locales } from "@ladestack/i18n";

import { articlePaths, publishedArticles } from "../blog";
import { legalPages } from "../i18n/pages";

type Locale = (typeof locales)[number];

/** Pages that share one path in every locale. Extend as About and Contact land. */
const shared = ["/", "/blog", ...legalPages.map((p) => `/${p}`)];

export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL("https://build.ladestack.in");
  const url = (l: Locale, p: string) => new URL(`${localePrefix(l)}${p}`, base).toString();

  // Each page set maps every locale to its own path (blog slugs differ by language).
  const all = await publishedArticles();
  const sets: Record<Locale, string>[] = [
    ...shared.map((p) => Object.fromEntries(locales.map((l) => [l, p])) as Record<Locale, string>),
    ...[...new Set(all.map((a) => a.translationId))].map((id) => articlePaths(all, id)),
  ];

  const entries = sets.flatMap((set) =>
    locales.map((l) => {
      const alternates = locales
        .map(
          (a) =>
            `    <xhtml:link rel="alternate" hreflang="${localeInfo[a].bcp47}" href="${url(a, set[a])}"/>`,
        )
        .join("\n");
      return `  <url>\n    <loc>${url(l, set[l])}</loc>\n${alternates}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${url("en", set.en)}"/>\n  </url>`;
    }),
  );

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join("\n")}\n</urlset>\n`;
  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
