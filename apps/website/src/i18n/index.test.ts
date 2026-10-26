import { describe, expect, it } from "vitest";
import { locales } from "@ladestack/i18n";
import { dictionaries } from "./index";

type Json = string | Json[] | { [k: string]: Json };

/** Collect "path -> value" for every string leaf. */
function leaves(node: Json, path = ""): Record<string, string> {
  if (typeof node === "string") return { [path]: node };
  const out: Record<string, string> = {};
  const entries = Array.isArray(node)
    ? node.map((v, i) => [String(i), v] as const)
    : Object.entries(node);
  for (const [k, v] of entries) Object.assign(out, leaves(v, path ? `${path}.${k}` : k));
  return out;
}

const english = leaves(dictionaries.en as unknown as Json);
// Product and technology names are allowed to stay identical to English.
const allowedSame = new Set(["nav.menu"]);

describe("website dictionaries", () => {
  it("exist for all eight locales", () => {
    expect(Object.keys(dictionaries).sort()).toEqual([...locales].sort());
  });

  for (const locale of locales.filter((l) => l !== "en")) {
    const local = leaves(dictionaries[locale] as unknown as Json);

    it(`${locale}: has exactly the English keys and list lengths`, () => {
      expect(Object.keys(local).sort()).toEqual(Object.keys(english).sort());
    });

    it(`${locale}: has no empty strings`, () => {
      for (const [k, v] of Object.entries(local)) expect(v.trim(), k).not.toBe("");
    });

    it(`${locale}: has no untranslated English sentences`, () => {
      for (const [k, v] of Object.entries(local)) {
        if (allowedSame.has(k) || v.length < 25) continue;
        expect(v, `${locale}.${k} is identical to English`).not.toBe(english[k]);
      }
    });
  }
});
