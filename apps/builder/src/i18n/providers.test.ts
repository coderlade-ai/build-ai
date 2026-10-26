import { locales } from "@ladestack/i18n";
import { describe, expect, it } from "vitest";
import { providerStrings } from "./providers";

describe("provider strings", () => {
  it("covers every locale with matching placeholders", () => {
    const keys = Object.keys(providerStrings.en) as (keyof typeof providerStrings.en)[];
    const holes = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort();
    for (const l of locales) {
      expect(Object.keys(providerStrings[l]).sort()).toEqual([...keys].sort());
      for (const k of keys) {
        expect(providerStrings[l][k].trim()).not.toBe("");
        expect(holes(providerStrings[l][k])).toEqual(holes(providerStrings.en[k]));
      }
    }
  });
});
