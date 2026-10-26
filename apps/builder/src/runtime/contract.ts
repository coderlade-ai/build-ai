/**
 * Runtime adapter contract (README §16, ADR 0008/0017). Every browser runtime candidate implements
 * this so they can be benchmarked and swapped. Adapters answer `unsupported` instead of faking
 * success.
 */

export type RuntimeResult<T = void> =
  | { ok: true; value: T }
  | { ok: false; unsupported: boolean; reason: string };

export const ok = <T>(value: T): RuntimeResult<T> => ({ ok: true, value });
export const unsupported = (reason: string): RuntimeResult<never> => ({
  ok: false,
  unsupported: true,
  reason,
});
export const failed = (reason: string): RuntimeResult<never> => ({
  ok: false,
  unsupported: false,
  reason,
});

/** The kinds of project a runtime can run. */
export type ProjectKind = "static" | "node";

export interface RuntimeCapabilities {
  id: string;
  label: string;
  projectKinds: ProjectKind[];
  /** Can install npm dependencies. */
  install: boolean;
  /** Can start processes such as a dev server. */
  processes: boolean;
  preview: boolean;
  /** What the runtime may fetch from the network. */
  network: "none" | "package-registry" | "any";
  /** Licence or terms that allow production use were verified (ADR 0008 hard gate). */
  productionLicenceVerified: boolean;
}

export interface InstallPolicy {
  /** npm install scripts (pre/postinstall) are security-sensitive and off by default. */
  allowInstallScripts: boolean;
}

export type PreviewEndpoint = { kind: "static"; entry: string } | { kind: "url"; url: string };
export type PreviewStatus = "idle" | "starting" | "ready" | "unavailable" | "error";

export interface WorkingSnapshot {
  revision: string;
  files: Record<string, string>;
}

export interface RuntimeAdapter {
  capabilities(): RuntimeCapabilities;
  initialize(): Promise<RuntimeResult>;
  dispose(): Promise<void>;
  /** Replaces the runtime's copy with a coherent set of saved files at one project revision. */
  mountProject(files: Record<string, string>, revision: string): Promise<RuntimeResult>;
  readFile(path: string): Promise<RuntimeResult<string>>;
  writeFile(path: string, content: string): Promise<RuntimeResult>;
  deleteFile(path: string): Promise<RuntimeResult>;
  installDependencies(
    manifest: string,
    lockfile: string | null,
    policy: InstallPolicy,
    signal?: AbortSignal,
  ): Promise<RuntimeResult>;
  startProcess(command: string, args: string[]): Promise<RuntimeResult<{ id: string }>>;
  stopProcess(id: string): Promise<RuntimeResult>;
  /** Returns an unsubscribe function. */
  streamProcessOutput(id: string, onChunk: (chunk: string) => void): RuntimeResult<() => void>;
  getPreviewEndpoint(): RuntimeResult<PreviewEndpoint>;
  /** Calls back with the current status at once and on every change; returns unsubscribe. */
  observePreviewStatus(onStatus: (status: PreviewStatus) => void): () => void;
  snapshotWorkingState(): Promise<RuntimeResult<WorkingSnapshot>>;
  /** True when the runtime's copy matches this project revision. */
  reconcileProjectRevision(revision: string): Promise<RuntimeResult<{ inSync: boolean }>>;
}
