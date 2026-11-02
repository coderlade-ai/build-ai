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
    setPendingTask("p1", { mode: "plan", prompt: "build a landing page" }, s);
    expect(takePendingTask("p2", s)).toBeNull();
    expect(takePendingTask("p1", s)).toEqual({ mode: "plan", prompt: "build a landing page" });
    expect(takePendingTask("p1", s)).toBeNull();
    s.setItem("ladestack.agentTask.p3", "plain old prompt");
    expect(takePendingTask("p3", s)).toEqual({ mode: "code", prompt: "plain old prompt" });
    s.setItem("ladestack.agentTask.p4", JSON.stringify({ mode: "evil", prompt: "x" }));
    expect(takePendingTask("p4", s)).toEqual({ mode: "code", prompt: "x" });
    s.setItem("ladestack.agentTask.p5", JSON.stringify({ mode: "plan" }));
    expect(takePendingTask("p5", s)).toBeNull();
  });

  it("names projects from the first line, by characters", () => {
    expect(projectNameFromPrompt("  A todo app\nwith dark mode")).toBe("A todo app");
    expect(projectNameFromPrompt("x".repeat(60))).toBe(`${"x".repeat(47)}…`);
    expect(Array.from(projectNameFromPrompt("日本語".repeat(30))).length).toBe(48);
  });
  it("keeps images in memory, out of storage, and hands them over once", () => {
    const store = new Map<string, string>();
    const s = {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
      removeItem: (k: string) => void store.delete(k),
    };
    const images = [{ mediaType: "image/png", data: "AQID" }];
    setPendingTask("img", { mode: "code", prompt: "match this", images }, s);
    expect([...store.values()].join()).not.toContain("AQID");
    expect(takePendingTask("img", s)).toEqual({ mode: "code", prompt: "match this", images });
    expect(takePendingTask("img", s)).toBeNull();
  });
});
