import { locales } from "@ladestack/i18n";
import { describe, expect, it } from "vitest";
import { history } from "./history";

describe("history strings", () => {
  it("covers every locale with every key filled", () => {
    const keys = Object.keys(history.en).sort();
    for (const l of locales) {
      expect(Object.keys(history[l]).sort()).toEqual(keys);
      for (const v of Object.values(history[l])) expect(v.trim()).not.toBe("");
      expect(history[l].files).toContain("{count}");
    }
  });
});
