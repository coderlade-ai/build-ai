import { isSafeProjectPath } from "../templates/validate";
import {
  failed,
  ok,
  unsupported,
  type PreviewStatus,
  type RuntimeAdapter,
  type RuntimeCapabilities,
} from "./contract";

const noNode =
  "This runtime serves and bundles files only; it cannot install packages or run commands.";

/**
 * Runtimes that only hand files to the isolated preview origin (ADR 0016): static files as-is,
 * or package.json projects bundled there with esbuild-wasm (experimental, ADR 0018). Install and
 * process calls answer `unsupported`.
 */
function createFileRuntime(
  capabilities: RuntimeCapabilities,
  unservable: (files: Map<string, string>) => string | null,
): RuntimeAdapter {
  let files = new Map<string, string>();
  let revision: string | null = null;
  let dirty = false;
  const listeners = new Set<(s: PreviewStatus) => void>();
  const status = (): PreviewStatus => {
    if (revision === null) return "idle";
    return unservable(files) === null ? "ready" : "unavailable";
  };
  const emit = () => listeners.forEach((l) => l(status()));

  return {
    capabilities: () => capabilities,
    initialize: async () => ok(undefined),
    dispose: async () => {
      files = new Map();
      revision = null;
      listeners.clear();
    },
    async mountProject(next, rev) {
      const paths = Object.keys(next);
      const bad = paths.find((p) => !isSafeProjectPath(p));
      if (bad) return failed(`Unsafe path: ${bad}`);
      files = new Map(Object.entries(next));
      revision = rev;
      dirty = false;
      emit();
      return ok(undefined);
    },
    async readFile(path) {
      const content = files.get(path);
      return content === undefined ? failed(`File not found: ${path}`) : ok(content);
    },
    async writeFile(path, content) {
      if (revision === null) return failed("No project is mounted.");
      if (!isSafeProjectPath(path)) return failed(`Unsafe path: ${path}`);
      files.set(path, content);
      dirty = true;
      emit();
      return ok(undefined);
    },
    async deleteFile(path) {
      if (!files.delete(path)) return failed(`File not found: ${path}`);
      dirty = true;
      emit();
      return ok(undefined);
    },
    installDependencies: async () => unsupported(noNode),
    startProcess: async () => unsupported(noNode),
    stopProcess: async () => unsupported(noNode),
    streamProcessOutput: () => unsupported(noNode),
    getPreviewEndpoint: () =>
      status() === "ready"
        ? ok({ kind: "static", entry: "index.html" })
        : unsupported(unservable(files) ?? "No project is mounted."),
    observePreviewStatus(onStatus) {
      listeners.add(onStatus);
      onStatus(status());
      return () => listeners.delete(onStatus);
    },
    snapshotWorkingState: async () =>
      revision === null
        ? failed("No project is mounted.")
        : ok({ revision, files: Object.fromEntries(files) }),
    reconcileProjectRevision: async (rev) => ok({ inSync: rev === revision && !dirty }),
  };
}

export function createStaticRuntime(): RuntimeAdapter {
  return createFileRuntime(
    {
      id: "static",
      label: "Static files",
      projectKinds: ["static"],
      install: false,
      processes: false,
      preview: true,
      network: "none",
      productionLicenceVerified: true, // our own MIT code
    },
    (files) =>
      files.has("package.json")
        ? "This project has a package.json; use the bundle runtime."
        : files.has("index.html")
          ? null
          : "There is no index.html at the project root.",
  );
}

/**
 * Experimental (ADR 0018): esbuild-wasm (MIT) bundles the project's source on the preview origin
 * and packages load from esm.sh. Not a Node runtime and not ADR 0008's final choice.
 */
export function createBundleRuntime(): RuntimeAdapter {
  return createFileRuntime(
    {
      id: "esbuild-bundle",
      label: "In-browser bundle (experimental)",
      projectKinds: ["node"],
      install: false,
      processes: false,
      preview: true,
      network: "package-registry",
      productionLicenceVerified: true, // esbuild-wasm is MIT; esm.sh is a public CDN (see ADR 0018)
    },
    (files) =>
      files.has("index.html") && files.has("package.json")
        ? null
        : "A bundled project needs package.json and index.html at the root.",
  );
}
