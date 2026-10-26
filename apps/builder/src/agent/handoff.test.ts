import { describe, expect, it } from "vitest";
import { projectNameFromPrompt, setPendingTask, takePendingTask } from "./handoff";

function memory() {
  const m = new Map<string, string>();
  return {
    getItem: (k: string) => m.get(k) ?? null,
    setItem: (k: string, v: string) => void m.set(k, v),
    removeItem: (k: string) => void m.delete(k),
  };
}

describe("code-mode handoff", () => {
  it("is taken exactly once", () => {
    const s = memory();
    setPendingTask("p1", "build a landing page", s);
    expect(takePendingTask("p2", s)).toBeNull();
    expect(takePendingTask("p1", s)).toBe("build a landing page");
    expect(takePendingTask("p1", s)).toBeNull();
  });

  it("names projects from the first line, by characters", () => {
    expect(projectNameFromPrompt("  A todo app\nwith dark mode")).toBe("A todo app");
    expect(projectNameFromPrompt("x".repeat(60))).toBe(`${"x".repeat(47)}…`);
    expect(Array.from(projectNameFromPrompt("日本語".repeat(30))).length).toBe(48);
  });
});
