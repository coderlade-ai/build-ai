import { locales } from "@ladestack/i18n";
import { describe, expect, it } from "vitest";
import { erase } from "./erase";

describe("erase strings", () => {
  it("covers every locale with every key filled", () => {
    const keys = Object.keys(erase.en).sort();
    for (const l of locales) {
      expect(Object.keys(erase[l]).sort()).toEqual(keys);
      for (const v of Object.values(erase[l])) expect(v.trim()).not.toBe("");
    }
  });
});
