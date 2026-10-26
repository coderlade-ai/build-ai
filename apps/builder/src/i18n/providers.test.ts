import { locales } from "@ladestack/i18n";
import { describe, expect, it } from "vitest";
import { askStrings } from "./ask";
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

  it("ask strings cover every locale with matching placeholders", () => {
    const keys = Object.keys(askStrings.en) as (keyof typeof askStrings.en)[];
    for (const l of locales)
      for (const k of keys) {
        expect(askStrings[l][k].trim()).not.toBe("");
        expect(askStrings[l][k].includes("{provider}")).toBe(
          askStrings.en[k].includes("{provider}"),
        );
      }
  });
});
