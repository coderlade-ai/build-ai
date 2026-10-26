import { writeFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  formatReports,
  reactViteFixture,
  runBenchmark,
  staticFixture,
  type BenchmarkReport,
} from "./benchmark";
import { createBundleRuntime, createStaticRuntime } from "./static";

const fixedClock = () => {
  let t = 0;
  return () => (t += 5);
};
const outcomes = (r: BenchmarkReport) =>
  Object.fromEntries(r.results.map((s) => [s.id, s.outcome]));

describe("runtime benchmark harness (ADR 0008)", () => {
  it("builds an F1 fixture inside README R02's 50-200 files", () => {
    const n = Object.keys(reactViteFixture().files).length;
    expect(n).toBeGreaterThanOrEqual(50);
    expect(n).toBeLessThanOrEqual(200);
  });

  it("scores the static runtime on F0 and keeps isolation as an open gate", async () => {
    const r = await runBenchmark(createStaticRuntime(), staticFixture(), fixedClock());
    expect(outcomes(r)).toMatchObject({
      R01: "pass",
      R02: "pass",
      R03: "unsupported",
      R04: "pass",
      R05: "pass",
      R07: "unsupported",
      R11: "pass",
      R12: "pass",
      R15: "manual",
    });
    expect(r.blockingGates).toEqual(["R15"]);
    expect(r.results).toHaveLength(15);
  });

  it("never reports install as passing for the experimental bundle runtime", async () => {
    const r = await runBenchmark(createBundleRuntime(), reactViteFixture(), fixedClock());
    expect(outcomes(r)).toMatchObject({
      R02: "pass",
      R03: "unsupported",
      R06: "unsupported",
      R04: "pass",
      R08: "unsupported",
    });
  });

  it("marks every scenario unsupported when the runtime cannot run the project kind", async () => {
    const r = await runBenchmark(createStaticRuntime(), reactViteFixture(), fixedClock());
    expect(new Set(r.results.map((s) => s.outcome))).toEqual(new Set(["unsupported"]));
  });

  it("fails the integrity gate when a runtime corrupts mounted files", async () => {
    const real = createStaticRuntime();
    const corrupting = {
      ...real,
      readFile: async (p: string) => {
        const r = await real.readFile(p);
        return r.ok && p === "styles.css" ? { ok: true as const, value: "changed" } : r;
      },
    };
    const r = await runBenchmark(corrupting, staticFixture(), fixedClock());
    expect(outcomes(r).R02).toBe("fail");
    expect(r.blockingGates).toContain("R02");
  });

  it("starts and stops a dev server for runtimes with processes", async () => {
    const real = createBundleRuntime();
    const stopped: string[] = [];
    const node = {
      ...real,
      capabilities: () => ({ ...real.capabilities(), install: true, processes: true }),
      installDependencies: async () => ({ ok: true as const, value: undefined }),
      startProcess: async () => ({ ok: true as const, value: { id: "dev" } }),
      stopProcess: async (id: string) => {
        stopped.push(id);
        return { ok: true as const, value: undefined };
      },
    };
    const r = await runBenchmark(node, reactViteFixture(), fixedClock());
    expect(outcomes(r)).toMatchObject({ R03: "pass", R04: "pass", R06: "pass", R07: "manual" });
    expect(stopped).toEqual(["dev"]);
  });

  it("formats a Markdown evidence table (and writes it when BENCH_REPORT is set)", async () => {
    const reports = [
      await runBenchmark(createStaticRuntime(), staticFixture()),
      await runBenchmark(createBundleRuntime(), reactViteFixture()),
    ];
    const md = formatReports(reports);
    expect(md).toContain("| R03 | npm install | unsupported |");
    expect(md).toContain("Blocking gates: R15");
    if (process.env.BENCH_REPORT) writeFileSync(process.env.BENCH_REPORT, md);
  });
});
