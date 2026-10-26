import { writeFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  createAlmostnodeRuntime,
  type AlmostnodeContainer,
  type CreateAlmostnodeContainer,
} from "./almostnode";
import { formatReports, reactViteFixture, runBenchmark, staticFixture } from "./benchmark";

/** In-memory stand-in with almostnode's API shape, so the default test run stays offline. */
function fakeContainer(install: () => Promise<{ added: string[] }>): AlmostnodeContainer {
  const files = new Map<string, string>();
  const dirs = new Set<string>(["/"]);
  const isDir = (p: string) => dirs.has(p);
  return {
    vfs: {
      existsSync: (p) => files.has(p) || isDir(p),
      readFileSync: (p) => {
        const c = files.get(p);
        if (c === undefined) throw new Error(`ENOENT ${p}`);
        return c;
      },
      writeFileSync: (p, c) => void files.set(p, c),
      mkdirSync: (p) => {
        const parts = p.split("/").filter(Boolean);
        for (let i = 1; i <= parts.length; i++) dirs.add(`/${parts.slice(0, i).join("/")}`);
      },
      readdirSync: (d) => {
        const prefix = d === "/" ? "/" : `${d}/`;
        const names = new Set<string>();
        for (const p of [...files.keys(), ...dirs])
          if (p !== d && p.startsWith(prefix)) names.add(p.slice(prefix.length).split("/")[0]!);
        return [...names];
      },
      statSync: (p) => ({ isDirectory: () => isDir(p) }),
      unlinkSync: (p) => void files.delete(p),
    },
    npm: {
      installFromPackageJson: async () => {
        const r = await install();
        dirs.add("/node_modules");
        files.set("/node_modules/react/package.json", "{}");
        return r;
      },
    },
    run: async () => ({ exitCode: 0, stdout: "", stderr: "" }),
  };
}

const fixedClock = () => {
  let t = 0;
  return () => (t += 5);
};
const outcomes = (r: { results: { id: string; outcome: string }[] }) =>
  Object.fromEntries(r.results.map((s) => [s.id, s.outcome]));

describe("almostnode runtime candidate (ADR 0008)", () => {
  it("passes the contract gates with a working install and keeps preview unsupported", async () => {
    const create = () => fakeContainer(async () => ({ added: ["react"] }));
    const r = await runBenchmark(createAlmostnodeRuntime(create), reactViteFixture(), fixedClock());
    expect(outcomes(r)).toMatchObject({
      R01: "pass",
      R02: "pass",
      R03: "pass",
      R04: "unsupported",
      R05: "pass",
      R06: "pass",
      R11: "pass",
      R12: "pass",
      R15: "manual",
    });
    expect(r.blockingGates).toEqual(["R15"]);
  });

  it("reports an install error as a failure, not a pass", async () => {
    const create = () =>
      fakeContainer(async () => {
        throw new Error("No matching version found for @oxc-project/types@=0.155.0");
      });
    const r = await runBenchmark(createAlmostnodeRuntime(create), reactViteFixture(), fixedClock());
    expect(outcomes(r).R03).toBe("fail");
    expect(r.results.find((s) => s.id === "R03")?.note).toContain("@oxc-project/types");
  });

  it("keeps generated files out of snapshots and refuses install scripts and lockfiles", async () => {
    const rt = createAlmostnodeRuntime(() => fakeContainer(async () => ({ added: [] })));
    await rt.initialize();
    await rt.mountProject({ "package.json": "{}", "src/a.ts": "a" }, "r1");
    expect((await rt.installDependencies("{}", null, { allowInstallScripts: false })).ok).toBe(
      true,
    );
    const snap = await rt.snapshotWorkingState();
    expect(snap.ok && Object.keys(snap.value.files).sort()).toEqual(["package.json", "src/a.ts"]);
    const scripts = await rt.installDependencies("{}", null, { allowInstallScripts: true });
    expect(!scripts.ok && scripts.unsupported).toBe(true);
    const lock = await rt.installDependencies("{}", "{}", { allowInstallScripts: false });
    expect(!lock.ok && lock.unsupported).toBe(true);
    expect((await rt.mountProject({ "node_modules/x.js": "x" }, "r2")).ok).toBe(false);
  });

  // Evidence run against the real package (network): install almostnode@0.2.14 outside the
  // workspace and run with ALMOSTNODE_PATH=<.../almostnode/dist/index.mjs> [BENCH_REPORT=<file>].
  const path = process.env.ALMOSTNODE_PATH;
  it.skipIf(!path)(
    "benchmarks the real almostnode package",
    async () => {
      const mod = (await import(/* @vite-ignore */ path!)) as {
        createContainer: CreateAlmostnodeContainer;
      };
      const reports = [
        await runBenchmark(createAlmostnodeRuntime(mod.createContainer), staticFixture()),
        await runBenchmark(createAlmostnodeRuntime(mod.createContainer), reactViteFixture()),
      ];
      const md = formatReports(reports);
      if (process.env.BENCH_REPORT) writeFileSync(process.env.BENCH_REPORT, md);
      expect(reports[1]!.results).toHaveLength(15);
    },
    120_000,
  );
});
