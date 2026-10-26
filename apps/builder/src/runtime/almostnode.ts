import { isSafeProjectPath } from "../templates/validate";
import {
  failed,
  ok,
  unsupported,
  type PreviewStatus,
  type RuntimeAdapter,
  type RuntimeResult,
} from "./contract";

/**
 * ADR 0008 candidate: almostnode (MIT, https://github.com/macaly/almostnode). This adapter is for
 * benchmarking only and is not wired into the builder. almostnode is not a workspace dependency
 * (it pulls native build tools such as @swc/core into the lockfile), so callers inject its
 * `createContainer`. The structural types below are the subset of almostnode 0.2.14 we use.
 */
export interface AlmostnodeVfs {
  existsSync(path: string): boolean;
  readFileSync(path: string, encoding: "utf8"): string;
  writeFileSync(path: string, content: string): void;
  mkdirSync(path: string, options: { recursive: boolean }): void;
  readdirSync(path: string): string[];
  statSync(path: string): { isDirectory(): boolean };
  unlinkSync(path: string): void;
}

export interface AlmostnodeContainer {
  vfs: AlmostnodeVfs;
  npm: {
    installFromPackageJson(options: { includeDev: boolean }): Promise<{ added: string[] }>;
  };
  run(
    command: string,
    options: {
      signal?: AbortSignal;
      onStdout?: (data: string) => void;
      onStderr?: (data: string) => void;
    },
  ): Promise<{ exitCode: number; stdout: string; stderr: string }>;
}

export type CreateAlmostnodeContainer = () => AlmostnodeContainer;

/** Paths almostnode writes itself; they are not project source. */
const generated = (path: string) =>
  path === "node_modules" || path.startsWith("node_modules/") || path === "package-lock.json";

const message = (e: unknown) => (e instanceof Error ? e.message : String(e));

export function createAlmostnodeRuntime(create: CreateAlmostnodeContainer): RuntimeAdapter {
  let container: AlmostnodeContainer | null = null;
  let revision: string | null = null;
  let dirty = false;
  const processes = new Map<
    string,
    { abort: AbortController; output: string[]; listeners: Set<(c: string) => void> }
  >();
  let nextId = 0;
  const listeners = new Set<(s: PreviewStatus) => void>();

  const vfs = () => container?.vfs ?? null;
  const abs = (p: string) => `/${p}`;

  function write(v: AlmostnodeVfs, path: string, content: string) {
    const dir = path.split("/").slice(0, -1).join("/");
    if (dir) v.mkdirSync(abs(dir), { recursive: true });
    v.writeFileSync(abs(path), content);
  }

  function walk(v: AlmostnodeVfs, dir: string, out: Record<string, string>) {
    for (const name of v.readdirSync(dir === "" ? "/" : abs(dir))) {
      const rel = dir ? `${dir}/${name}` : name;
      if (generated(rel)) continue;
      if (v.statSync(abs(rel)).isDirectory()) walk(v, rel, out);
      else out[rel] = v.readFileSync(abs(rel), "utf8");
    }
    return out;
  }

  function needsMount<T>(): RuntimeResult<T> | null {
    return container && revision !== null ? null : failed("No project is mounted.");
  }

  return {
    capabilities: () => ({
      id: "almostnode",
      label: "almostnode 0.2.14 (candidate)",
      projectKinds: ["static", "node"],
      install: true,
      processes: true,
      // Its Vite-like dev server needs almostnode's service worker on the preview origin; not wired.
      preview: false,
      network: "any",
      productionLicenceVerified: true, // MIT LICENSE in the npm tarball (docs/research/runtime-candidates-2026-10.md)
    }),
    async initialize() {
      try {
        container = create();
        return ok(undefined);
      } catch (e) {
        return failed(message(e));
      }
    },
    async dispose() {
      for (const p of processes.values()) p.abort.abort();
      processes.clear();
      listeners.clear();
      container = null;
      revision = null;
    },
    async mountProject(files, rev) {
      if (!container) return failed("Not initialized.");
      const bad = Object.keys(files).find((p) => !isSafeProjectPath(p) || generated(p));
      if (bad) return failed(`Unsafe path: ${bad}`);
      // A mount replaces the whole copy: build it in a fresh container, then swap.
      let next: AlmostnodeContainer;
      try {
        next = create();
        for (const [p, c] of Object.entries(files)) write(next.vfs, p, c);
      } catch (e) {
        return failed(message(e));
      }
      container = next;
      revision = rev;
      dirty = false;
      return ok(undefined);
    },
    async readFile(path) {
      const v = vfs();
      if (!v) return failed("Not initialized.");
      if (!isSafeProjectPath(path) || !v.existsSync(abs(path)))
        return failed(`File not found: ${path}`);
      return ok(v.readFileSync(abs(path), "utf8"));
    },
    async writeFile(path, content) {
      const missing = needsMount<void>();
      if (missing) return missing;
      if (!isSafeProjectPath(path) || generated(path)) return failed(`Unsafe path: ${path}`);
      write(container!.vfs, path, content);
      dirty = true;
      return ok(undefined);
    },
    async deleteFile(path) {
      const v = vfs();
      if (!v || !isSafeProjectPath(path) || !v.existsSync(abs(path)))
        return failed(`File not found: ${path}`);
      v.unlinkSync(abs(path));
      dirty = true;
      return ok(undefined);
    },
    async installDependencies(manifest, lockfile, policy, signal) {
      const missing = needsMount<void>();
      if (missing) return missing;
      if (policy.allowInstallScripts)
        return unsupported("almostnode does not run dependency install scripts.");
      if (lockfile !== null)
        return unsupported("almostnode resolves from package.json; lockfiles are not honoured.");
      try {
        write(container!.vfs, "package.json", manifest);
        await container!.npm.installFromPackageJson({ includeDev: true });
        if (signal?.aborted) return failed("Install was cancelled.");
        return ok(undefined);
      } catch (e) {
        return failed(`Install failed: ${message(e)}`);
      }
    },
    async startProcess(command, args) {
      const missing = needsMount<{ id: string }>();
      if (missing) return missing;
      const id = `p${++nextId}`;
      const proc = {
        abort: new AbortController(),
        output: [] as string[],
        listeners: new Set<(c: string) => void>(),
      };
      const push = (c: string) => {
        proc.output.push(c);
        proc.listeners.forEach((l) => l(c));
      };
      processes.set(id, proc);
      void container!
        .run([command, ...args].join(" "), {
          signal: proc.abort.signal,
          onStdout: push,
          onStderr: push,
        })
        .then((r) => push(`\n[exit ${r.exitCode}]\n`))
        .catch((e: unknown) => push(`\n[error ${message(e)}]\n`));
      return ok({ id });
    },
    async stopProcess(id) {
      const p = processes.get(id);
      if (!p) return failed(`No process ${id}.`);
      p.abort.abort();
      processes.delete(id);
      return ok(undefined);
    },
    streamProcessOutput(id, onChunk) {
      const p = processes.get(id);
      if (!p) return failed(`No process ${id}.`);
      p.output.forEach(onChunk);
      p.listeners.add(onChunk);
      return ok(() => p.listeners.delete(onChunk));
    },
    getPreviewEndpoint: () =>
      unsupported(
        "almostnode's preview needs its service worker on the preview origin (not wired).",
      ),
    observePreviewStatus(onStatus) {
      listeners.add(onStatus);
      onStatus(revision === null ? "idle" : "unavailable");
      return () => listeners.delete(onStatus);
    },
    async snapshotWorkingState() {
      const missing = needsMount<never>();
      if (missing) return missing;
      return ok({ revision: revision!, files: walk(container!.vfs, "", {}) });
    },
    reconcileProjectRevision: async (rev) => ok({ inSync: rev === revision && !dirty }),
  };
}
