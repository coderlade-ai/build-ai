import type { APIRoute } from "astro";
import { localeInfo, localePrefix, locales } from "@ladestack/i18n";

/** Pages that exist in every locale. Extend as About, Contact, legal and blog land. */
const paths = ["/"];

export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL("https://build.ladestack.in");
  const url = (l: (typeof locales)[number], p: string) =>
    new URL(`${localePrefix(l)}${p}`, base).toString();

  const entries = paths.flatMap((p) =>
    locales.map((l) => {
      const alternates = locales
        .map(
          (a) =>
            `    <xhtml:link rel="alternate" hreflang="${localeInfo[a].bcp47}" href="${url(a, p)}"/>`,
        )
        .join("\n");
      return `  <url>\n    <loc>${url(l, p)}</loc>\n${alternates}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${url("en", p)}"/>\n  </url>`;
    }),
  );

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join("\n")}\n</urlset>\n`;
  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
