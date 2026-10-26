import { locales } from "@ladestack/i18n";
import { describe, expect, it } from "vitest";
import { format, importZip } from "./importZip";

describe("ZIP import strings", () => {
  it("covers every locale with matching placeholders", () => {
    const keys = Object.keys(importZip.en).sort();
    const holes = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort();
    for (const l of locales) {
      expect(Object.keys(importZip[l]).sort()).toEqual(keys);
      for (const k of keys as (keyof typeof importZip.en)[]) {
        expect(importZip[l][k].trim()).not.toBe("");
        expect(holes(importZip[l][k])).toEqual(holes(importZip.en[k]));
      }
    }
  });

  it("formats placeholders", () => {
    expect(format("{count} of {x}", { count: 3 })).toBe("3 of {x}");
  });
});
