import { locales } from "@ladestack/i18n";
import { describe, expect, it } from "vitest";
import { fill, recent } from "./recent";

describe("recent project strings", () => {
  it("covers every locale with every key filled", () => {
    const keys = Object.keys(recent.en).sort();
    for (const l of locales) {
      expect(Object.keys(recent[l]).sort()).toEqual(keys);
      for (const v of Object.values(recent[l])) expect(v.trim()).not.toBe("");
      expect(recent[l].confirmRemove).toContain("{name}");
      expect(recent[l].removeLabel).toContain("{name}");
    }
  });

  it("fills the project name", () => {
    expect(fill(recent.en.removeLabel, "Site")).toBe("Delete Site");
  });
});
