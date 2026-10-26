import { describe, expect, it } from "vitest";
import { locales } from "@ladestack/i18n";
import { shell } from "./shell";

describe("builder shell strings", () => {
  it("cover all eight locales with non-empty strings", () => {
    expect(Object.keys(shell).sort()).toEqual([...locales].sort());
    for (const l of locales) {
      for (const [k, v] of Object.entries(shell[l])) expect(v.trim(), `${l}.${k}`).not.toBe("");
    }
  });

  it("translate every string outside English", () => {
    for (const l of locales.filter((x) => x !== "en")) {
      for (const k of Object.keys(shell.en) as (keyof typeof shell.en)[]) {
        // Short UI words like "Start" may legitimately match; long strings may not.
        if (shell.en[k].length >= 12) expect(shell[l][k], `${l}.${k}`).not.toBe(shell.en[k]);
      }
    }
  });
});
