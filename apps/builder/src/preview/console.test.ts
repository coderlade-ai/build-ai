import { describe, expect, it } from "vitest";
import {
  appendLog,
  debugPromptFromLogs,
  maxLogs,
  parsePreviewLog,
  type PreviewLog,
} from "./console";

const msg = (o: Record<string, unknown>) => ({ type: "ladestack:preview-log", ...o });

describe("preview console", () => {
  it("accepts only well-formed messages", () => {
    expect(parsePreviewLog(msg({ level: "error", text: "boom", where: "a.js:1" }))).toEqual({
      level: "error",
      text: "boom",
      where: "a.js:1",
    });
    expect(parsePreviewLog(msg({ level: "debug", text: "x", where: "" }))).toBeNull();
    expect(parsePreviewLog(msg({ level: "log", text: 1, where: "" }))).toBeNull();
    expect(parsePreviewLog({ type: "other", level: "log", text: "x", where: "" })).toBeNull();
    expect(parsePreviewLog(null)).toBeNull();
    expect(
      parsePreviewLog(msg({ level: "log", text: "x".repeat(5000), where: "" }))?.text,
    ).toHaveLength(2000);
  });

  it("keeps the newest logs", () => {
    let logs: PreviewLog[] = [];
    for (let i = 0; i < maxLogs + 5; i++)
      logs = appendLog(logs, { level: "log", text: String(i), where: "" });
    expect(logs).toHaveLength(maxLogs);
    expect(logs[0]?.text).toBe("5");
  });

  it("builds a Debug task from errors and warnings only", () => {
    const logs: PreviewLog[] = [
      { level: "log", text: "hello", where: "" },
      { level: "error", text: "TypeError: x is null\n    at a.js:3", where: "script.js:3" },
      { level: "warn", text: "deprecated", where: "" },
    ];
    const prompt = debugPromptFromLogs("Find the cause:", logs)!;
    expect(prompt.startsWith("Find the cause:\n\n")).toBe(true);
    expect(prompt).toContain("[error] TypeError: x is null");
    expect(prompt).toContain("(script.js:3)");
    expect(prompt).toContain("[warn] deprecated");
    expect(prompt).not.toContain("hello");
    expect(debugPromptFromLogs("x", [{ level: "info", text: "i", where: "" }])).toBeNull();
    const many = Array.from({ length: 50 }, () => ({
      level: "error" as const,
      text: "e".repeat(500),
      where: "",
    }));
    expect(debugPromptFromLogs("x", many)!.length).toBeLessThan(4200);
  });
});
