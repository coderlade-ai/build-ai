import { locales } from "@ladestack/i18n";
import { describe, expect, it } from "vitest";
import { settingsStrings } from "./settings";

describe("settings strings", () => {
  it("covers every locale with every key filled", () => {
    const keys = Object.keys(settingsStrings.en).sort();
    for (const l of locales) {
      expect(Object.keys(settingsStrings[l]).sort()).toEqual(keys);
      for (const v of Object.values(settingsStrings[l])) expect(v.trim()).not.toBe("");
    }
  });
});
