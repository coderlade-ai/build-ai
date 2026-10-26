import { describe, expect, it } from "vitest";
import { locales } from "@ladestack/i18n";
import { pageDictionaries } from "./pages";

type Json = string | Json[] | { [k: string]: Json };

function leaves(node: Json, path = ""): Record<string, string> {
  if (typeof node === "string") return { [path]: node };
  const out: Record<string, string> = {};
  const entries = Array.isArray(node)
    ? node.map((v, i) => [String(i), v] as const)
    : Object.entries(node);
  for (const [k, v] of entries) Object.assign(out, leaves(v, path ? `${path}.${k}` : k));
  return out;
}

const english = leaves(pageDictionaries.en as unknown as Json);
const allowedSame = new Set([
  "links.openSource",
  "openSource.title",
  "links.contact",
  "contact.title",
]);

describe("legal and error page dictionaries", () => {
  it("exist for all eight locales", () => {
    expect(Object.keys(pageDictionaries).sort()).toEqual([...locales].sort());
  });

  for (const locale of locales.filter((l) => l !== "en")) {
    const local = leaves(pageDictionaries[locale] as unknown as Json);

    it(`${locale}: matches the English keys`, () => {
      expect(Object.keys(local).sort()).toEqual(Object.keys(english).sort());
    });

    it(`${locale}: has no empty or untranslated strings`, () => {
      for (const [k, v] of Object.entries(local)) {
        expect(v.trim(), k).not.toBe("");
        if (!allowedSame.has(k) && v.length >= 25) expect(v, `${locale}.${k}`).not.toBe(english[k]);
      }
    });
  }
});
