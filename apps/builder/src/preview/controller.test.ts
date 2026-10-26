import { describe, expect, it } from "vitest";
import { formatPreviewReport, PreviewController } from "./controller";

const instant = { loadTimeoutMs: 50, settleMs: 0 };
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

describe("check_preview report", () => {
  it("says so when the console is clean", () => {
    expect(formatPreviewReport([])).toMatch(/console is empty/);
  });

  it("puts errors and warnings first with counts and locations", () => {
    const out = formatPreviewReport([
      { level: "log", text: "hi", where: "" },
      { level: "error", text: "ReferenceError: x is not defined", where: "script.js:2" },
      { level: "warn", text: "slow", where: "" },
    ]);
    expect(out).toContain("1 error(s), 1 warning(s), 1 other message(s)");
    expect(out.indexOf("[error]")).toBeLessThan(out.indexOf("[log]"));
    expect(out).toContain("(script.js:2)");
  });

  it("stays bounded", () => {
    const logs = Array.from({ length: 200 }, () => ({
      level: "error" as const,
      text: "e".repeat(400),
      where: "",
    }));
    expect(formatPreviewReport(logs).length).toBeLessThan(6100);
  });
});

describe("PreviewController", () => {
  it("explains why it can't check", async () => {
    const c = new PreviewController(instant, sleep);
    expect(await c.check()).toMatch(/not open/);
    c.attach({ ok: false, reason: "needs runtime" }, null);
    expect(await c.check()).toBe("needs runtime");
  });

  it("reloads, waits for the load and reports that load's console", async () => {
    const c = new PreviewController(instant, sleep);
    c.log({ level: "error", text: "old", where: "" });
    c.attach({ ok: true }, () => {
      c.filesSent();
      setTimeout(() => {
        c.log({ level: "error", text: "new", where: "a.js:1" });
        c.loaded();
      }, 5);
    });
    const out = await c.check();
    expect(out).toContain("new");
    expect(out).not.toContain("old");
  });

  it("times out when the page never loads", async () => {
    const c = new PreviewController(instant, sleep);
    c.attach({ ok: true }, () => {});
    expect(await c.check()).toMatch(/did not finish loading/);
    c.detach();
    expect(await c.check()).toMatch(/not open/);
  });
});
