import { describe, expect, it } from "vitest";
import { locales } from "@ladestack/i18n";
import { workspace } from "./workspace";

describe("workspace strings", () => {
  it("cover all eight locales, translated", () => {
    expect(Object.keys(workspace).sort()).toEqual([...locales].sort());
    for (const l of locales) {
      for (const [k, v] of Object.entries(workspace[l])) {
        expect(v.trim(), `${l}.${k}`).not.toBe("");
        const en = workspace.en[k as keyof typeof workspace.en];
        if (l !== "en" && en.length >= 12) expect(v, `${l}.${k}`).not.toBe(en);
      }
    }
  });
});
