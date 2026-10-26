/**
 * Runtime benchmark harness (ADR 0008, README §16 R01–R15). Runs the scenarios that can be checked
 * through the adapter contract against any RuntimeAdapter and records the rest as needing a
 * browser or a manual run. A scenario the runtime does not offer is `unsupported`, never `pass`.
 * Hard gates (source integrity, safe failure, production licence, isolation) override averages.
 */
import type { RuntimeAdapter, RuntimeResult } from "./contract";

export type Outcome = "pass" | "fail" | "unsupported" | "manual";

export interface ScenarioResult {
  id: string;
  title: string;
  outcome: Outcome;
  /** Wall time of the measured step, when one ran. */
  ms?: number;
  note: string;
}

export interface BenchmarkReport {
  runtime: string;
  label: string;
  fixture: string;
  results: ScenarioResult[];
  /** Hard gates that failed or are still unproven; any entry blocks production selection. */
  blockingGates: string[];
}

export interface Fixture {
  id: string;
  title: string;
  files: Record<string, string>;
  /** A file whose edit must show up in the runtime (R05). */
  editPath: string;
}

/** README §16 scenario titles. */
export const scenarios: Record<string, string> = {
  R01: "Cold initialize",
  R02: "Project mount",
  R03: "npm install",
  R04: "Dev server / preview endpoint",
  R05: "Source update (HMR)",
  R06: "Manifest change",
  R07: "Node APIs",
  R08: "TypeScript build",
  R09: "Node API service",
  R10: "Advanced framework (SSR)",
  R11: "Failure recovery",
  R12: "Persistence",
  R13: "Resource usage",
  R14: "Browser coverage",
  R15: "Isolation/security",
};

/** Scenarios that are hard gates in ADR 0008. */
export const hardGates = ["R02", "R11", "R15", "licence"] as const;

type Clock = () => number;

async function timed<T>(clock: Clock, run: () => Promise<T>): Promise<{ value: T; ms: number }> {
  const start = clock();
  const value = await run();
  return { value, ms: Math.max(0, Math.round(clock() - start)) };
}

const reason = (r: RuntimeResult<unknown>) => (r.ok ? "" : r.reason);
const outcomeOf = (r: RuntimeResult<unknown>): Outcome =>
  r.ok ? "pass" : r.unsupported ? "unsupported" : "fail";

/**
 * React + TypeScript + Vite + Tailwind reference project (fixture F1) with `count` component files,
 * so the mount covers README R02's 50–200 files.
 */
export function reactViteFixture(count = 60): Fixture {
  const files: Record<string, string> = {
    "package.json": JSON.stringify(
      {
        name: "bench-f1",
        private: true,
        type: "module",
        scripts: { dev: "vite", build: "tsc -b && vite build" },
        dependencies: { react: "^19.1.1", "react-dom": "^19.1.1" },
        devDependencies: {
          "@vitejs/plugin-react": "^5.0.0",
          tailwindcss: "^4.1.0",
          typescript: "^5.9.0",
          vite: "^7.1.0",
        },
      },
      null,
      2,
    ),
    "index.html":
      '<!doctype html><html><head><meta charset="UTF-8" /><title>F1</title></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>',
    "tsconfig.json": JSON.stringify({ compilerOptions: { jsx: "react-jsx", strict: true } }),
    "src/index.css": '@import "tailwindcss";',
    "src/main.tsx": [
      'import { createRoot } from "react-dom/client";',
      'import "./index.css";',
      'import { App } from "./App";',
      'createRoot(document.getElementById("root")!).render(<App />);',
    ].join("\n"),
  };
  const names = Array.from({ length: count }, (_, i) => `Card${String(i).padStart(3, "0")}`);
  for (const n of names)
    files[`src/components/${n}.tsx`] =
      `export function ${n}() {\n  return <p className="p-2">${n}</p>;\n}\n`;
  files["src/App.tsx"] = [
    ...names.map((n) => `import { ${n} } from "./components/${n}";`),
    "export function App() {",
    `  return <main>{[${names.map((n) => `<${n} key="${n}" />`).join(", ")}]}</main>;`,
    "}",
  ].join("\n");
  return { id: "F1", title: "React + TS + Vite + Tailwind", files, editPath: "src/App.tsx" };
}

/** Static HTML/CSS/JS reference project (fixture F0). */
export function staticFixture(): Fixture {
  return {
    id: "F0",
    title: "Static HTML/CSS/JS",
    files: {
      "index.html":
        '<!doctype html><html><head><link rel="stylesheet" href="styles.css"></head><body><h1>F0</h1><script src="app.js"></script></body></html>',
      "styles.css": "h1 { color: #26251e; }",
      "app.js": "document.querySelector('h1').textContent += ' ready';",
    },
    editPath: "app.js",
  };
}

/** Runs every contract-level scenario for one adapter and one fixture. */
export async function runBenchmark(
  adapter: RuntimeAdapter,
  fixture: Fixture,
  clock: Clock = () => performance.now(),
): Promise<BenchmarkReport> {
  const caps = adapter.capabilities();
  const results: ScenarioResult[] = [];
  const add = (id: string, outcome: Outcome, note: string, ms?: number) =>
    results.push({
      id,
      title: scenarios[id] ?? id,
      outcome,
      note,
      ...(ms === undefined ? {} : { ms }),
    });
  const isNode = "package.json" in fixture.files;
  const kind = isNode ? "node" : "static";
  if (!caps.projectKinds.includes(kind)) {
    for (const id of Object.keys(scenarios))
      add(id, "unsupported", `${caps.label} does not run ${kind} projects.`);
    return finish(caps.id, caps.label, fixture.id, results, caps.productionLicenceVerified);
  }

  // R01 cold initialize
  const init = await timed(clock, () => adapter.initialize());
  add("R01", outcomeOf(init.value), reason(init.value) || "Initialized.", init.ms);

  // R02 mount + read back every file
  const paths = Object.keys(fixture.files);
  const mount = await timed(clock, () => adapter.mountProject(fixture.files, "bench-1"));
  if (!mount.value.ok) add("R02", "fail", mount.value.reason, mount.ms);
  else {
    let wrong = 0;
    for (const p of paths) {
      const r = await adapter.readFile(p);
      if (!r.ok || r.value !== fixture.files[p]) wrong++;
    }
    const sync = await adapter.reconcileProjectRevision("bench-1");
    add(
      "R02",
      wrong === 0 && sync.ok && sync.value.inSync ? "pass" : "fail",
      wrong ? `${wrong} of ${paths.length} files differ.` : `${paths.length} files intact.`,
      mount.ms,
    );
  }

  // R03 install, R06 install after a manifest change
  const policy = { allowInstallScripts: false };
  if (!isNode) {
    add("R03", "unsupported", "The fixture has no package.json.");
    add("R06", "unsupported", "The fixture has no package.json.");
  } else {
    const manifest = fixture.files["package.json"] ?? "{}";
    const install = await timed(clock, () => adapter.installDependencies(manifest, null, policy));
    add("R03", outcomeOf(install.value), reason(install.value) || "Installed.", install.ms);
    const changed = JSON.parse(manifest) as { dependencies?: Record<string, string> };
    changed.dependencies = { ...changed.dependencies, "date-fns": "^4.1.0" };
    const next = JSON.stringify(changed, null, 2);
    await adapter.writeFile("package.json", next);
    const again = await timed(clock, () => adapter.installDependencies(next, null, policy));
    add(
      "R06",
      outcomeOf(again.value),
      reason(again.value) || "Added dependency installed.",
      again.ms,
    );
    await adapter.writeFile("package.json", manifest);
  }

  // R04 preview endpoint: a dev server when the runtime has processes, otherwise its own endpoint
  if (caps.processes) {
    const dev = await timed(clock, () => adapter.startProcess("npm", ["run", "dev"]));
    if (!dev.value.ok) add("R04", outcomeOf(dev.value), dev.value.reason, dev.ms);
    else {
      const ep = adapter.getPreviewEndpoint();
      add("R04", outcomeOf(ep), ep.ok ? "Dev server endpoint reported." : ep.reason, dev.ms);
      await adapter.stopProcess(dev.value.value.id);
    }
  } else {
    const ep = adapter.getPreviewEndpoint();
    add(
      "R04",
      outcomeOf(ep),
      ep.ok ? `No dev server; serves ${ep.value.kind} preview.` : ep.reason,
    );
  }

  // R05 source update reaches the runtime copy (live preview reload is checked in the browser)
  const edited = `${fixture.files[fixture.editPath] ?? ""}\n// bench edit\n`;
  const write = await timed(clock, () => adapter.writeFile(fixture.editPath, edited));
  const back = await adapter.readFile(fixture.editPath);
  add(
    "R05",
    write.value.ok && back.ok && back.value === edited ? "pass" : outcomeOf(write.value),
    write.value.ok
      ? "Edit reached the runtime; preview reload is covered by the CI browser check."
      : write.value.reason,
    write.ms,
  );

  // R07–R10 need processes
  for (const id of ["R07", "R08", "R09", "R10"])
    add(
      id,
      caps.processes ? "manual" : "unsupported",
      caps.processes ? "Needs the fixture's own commands in a browser run." : "No processes.",
    );

  // R11 an unsafe mount fails and leaves the previous files untouched
  const before = await adapter.snapshotWorkingState();
  const bad = await adapter.mountProject({ "../escape.js": "x" }, "bench-bad");
  const after = await adapter.snapshotWorkingState();
  const untouched =
    before.ok &&
    after.ok &&
    after.value.revision === before.value.revision &&
    JSON.stringify(after.value.files) === JSON.stringify(before.value.files);
  add(
    "R11",
    !bad.ok && untouched ? "pass" : "fail",
    bad.ok
      ? "An unsafe path was accepted."
      : untouched
        ? "Rejected; files kept."
        : "Files changed.",
  );

  // R12 snapshot → fresh mount restores the same source
  if (!after.ok) add("R12", "fail", after.reason);
  else {
    const re = await adapter.mountProject(after.value.files, "bench-2");
    const snap = await adapter.snapshotWorkingState();
    const same =
      re.ok && snap.ok && JSON.stringify(snap.value.files) === JSON.stringify(after.value.files);
    add("R12", same ? "pass" : "fail", same ? "Snapshot remounted intact." : "Snapshot differs.");
  }

  const total = results.reduce((s, r) => s + (r.ms ?? 0), 0);
  add("R13", "manual", `Timings captured (${total} ms total); memory/CPU need a browser profile.`);
  add("R14", "manual", "Chrome is covered by the CI browser check; Edge/Firefox/Safari pending.");
  add("R15", "manual", "Needs the preview-origin isolation tests in a browser (ADR 0016).");
  await adapter.dispose();
  return finish(caps.id, caps.label, fixture.id, results, caps.productionLicenceVerified);
}

function finish(
  runtime: string,
  label: string,
  fixture: string,
  results: ScenarioResult[],
  licence: boolean,
): BenchmarkReport {
  const blockingGates: string[] = [];
  for (const id of ["R02", "R11", "R15"]) {
    const r = results.find((x) => x.id === id);
    if (r && r.outcome !== "pass" && r.outcome !== "unsupported") blockingGates.push(id);
  }
  if (!licence) blockingGates.push("licence");
  results.sort((a, b) => a.id.localeCompare(b.id));
  return { runtime, label, fixture, results, blockingGates };
}

/** Markdown table of one or more reports, for ADR 0008 evidence. */
export function formatReports(reports: BenchmarkReport[]): string {
  const out: string[] = [];
  for (const r of reports) {
    out.push(`### ${r.label} (\`${r.runtime}\`) on ${r.fixture}`, "");
    out.push("| ID | Scenario | Outcome | Time | Note |", "| --- | --- | --- | --- | --- |");
    for (const s of r.results)
      out.push(
        `| ${s.id} | ${s.title} | ${s.outcome} | ${s.ms === undefined ? "" : `${s.ms} ms`} | ${s.note.replace(/\|/g, "\\|")} |`,
      );
    out.push(
      "",
      r.blockingGates.length
        ? `Blocking gates: ${r.blockingGates.join(", ")}`
        : "Blocking gates: none",
      "",
    );
  }
  return out.join("\n");
}
