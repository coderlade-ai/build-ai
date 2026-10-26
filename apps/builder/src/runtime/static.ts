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
  "The static runtime serves HTML, CSS and JS files only; it cannot install packages or run commands.";

/**
 * The only runtime shipped today: files served as-is by the isolated preview origin (ADR 0016).
 * Everything Node-like answers `unsupported`.
 */
export function createStaticRuntime(): RuntimeAdapter {
  let files = new Map<string, string>();
  let revision: string | null = null;
  let dirty = false;
  const listeners = new Set<(s: PreviewStatus) => void>();
  const status = (): PreviewStatus => {
    if (revision === null) return "idle";
    if (files.has("package.json")) return "unavailable";
    return files.has("index.html") ? "ready" : "unavailable";
  };
  const emit = () => listeners.forEach((l) => l(status()));
  const capabilities: RuntimeCapabilities = {
    id: "static",
    label: "Static files",
    projectKinds: ["static"],
    install: false,
    processes: false,
    preview: true,
    network: "none",
    productionLicenceVerified: true, // our own MIT code
  };

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
        : unsupported(
            files.has("package.json")
              ? "This project has a package.json and needs a Node runtime."
              : "There is no index.html at the project root.",
          ),
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
