import { locales } from "@ladestack/i18n";
import { describe, expect, it } from "vitest";
import { attachStrings } from "./attach";

describe("attachment strings", () => {
  it("covers every locale with every key filled", () => {
    const keys = Object.keys(attachStrings.en).sort();
    for (const l of locales) {
      const t = attachStrings[l];
      expect(Object.keys(t).sort()).toEqual(keys);
      for (const v of Object.values(t)) expect(v.trim()).not.toBe("");
      for (const k of [
        "remove",
        "blocked",
        "unsupported",
        "tooLarge",
        "tooMany",
        "readFailed",
      ] as const)
        expect(t[k]).toContain("{name}");
    }
  });
});
