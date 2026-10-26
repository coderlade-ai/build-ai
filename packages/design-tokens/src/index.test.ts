import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { colors } from "./index";

const css = readFileSync(new URL("./tokens.css", import.meta.url), "utf8").toLowerCase();
const kebab = (s: string) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

describe("design tokens", () => {
  it("keeps tokens.css in sync with the TypeScript colours", () => {
    for (const [name, value] of Object.entries(colors)) {
      expect(css).toContain(`--color-${kebab(name)}: ${value.toLowerCase()};`);
    }
  });

  it("uses the DESIGN.md brand colours", () => {
    expect(colors.canvas).toBe("#F7F7F4");
    expect(colors.ink).toBe("#26251E");
    expect(colors.primary).toBe("#F54E00");
  });
});
