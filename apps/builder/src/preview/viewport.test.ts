import { describe, expect, it } from "vitest";
import { loadViewport, saveViewport, viewportWidth } from "./viewport";

function memory() {
  const m = new Map<string, string>();
  return {
    getItem: (k: string) => m.get(k) ?? null,
    setItem: (k: string, v: string) => void m.set(k, v),
  };
}

describe("preview viewport", () => {
  it("defaults to desktop and remembers a valid choice", () => {
    const s = memory();
    expect(loadViewport(s)).toBe("desktop");
    saveViewport(s, "mobile");
    expect(loadViewport(s)).toBe("mobile");
    expect(viewportWidth.mobile).toBe("390px");
  });

  it("ignores unknown values and broken storage", () => {
    const s = memory();
    s.setItem("ladestack:preview-viewport", "watch");
    expect(loadViewport(s)).toBe("desktop");
    const broken = {
      getItem: () => {
        throw new Error("denied");
      },
    };
    expect(loadViewport(broken)).toBe("desktop");
    expect(loadViewport(undefined)).toBe("desktop");
  });
});
