import type { RuntimeResult } from "./contract";

/**
 * Dependency reconciliation (README §16): validate the complete manifest, skip unchanged
 * dependencies, coalesce rapid changes, run one install at a time and ignore superseded results.
 */

export type ManifestCheck = { ok: true; key: string } | { ok: false; reason: string };

const depFields = [
  "dependencies",
  "devDependencies",
  "peerDependencies",
  "optionalDependencies",
] as const;

/** Parses package.json and returns a stable key of what affects installation. */
export function dependencyKey(manifest: string, lockfile: string | null): ManifestCheck {
  let pkg: unknown;
  try {
    pkg = JSON.parse(manifest);
  } catch {
    return { ok: false, reason: "package.json is not valid JSON (it may still be streaming)." };
  }
  if (!pkg || typeof pkg !== "object" || Array.isArray(pkg))
    return { ok: false, reason: "package.json must be a JSON object." };
  const picked: Record<string, [string, string][]> = {};
  for (const field of depFields) {
    const v = (pkg as Record<string, unknown>)[field];
    if (v === undefined) continue;
    if (!v || typeof v !== "object" || Array.isArray(v))
      return { ok: false, reason: `${field} must be an object of name to version.` };
    const entries = Object.entries(v as Record<string, unknown>);
    const bad = entries.find(([, ver]) => typeof ver !== "string");
    if (bad) return { ok: false, reason: `${field}.${bad[0]} must be a version string.` };
    picked[field] = (entries as [string, string][]).sort(([a], [b]) => a.localeCompare(b));
  }
  return { ok: true, key: JSON.stringify([picked, lockfile ?? null]) };
}

export type InstallEvent =
  | { type: "invalid"; revision: string; reason: string }
  | { type: "unchanged"; revision: string }
  | { type: "started"; revision: string }
  | { type: "completed"; revision: string }
  | { type: "failed"; revision: string; reason: string }
  | { type: "superseded"; revision: string };

type Install = (
  manifest: string,
  lockfile: string | null,
  signal: AbortSignal,
) => Promise<RuntimeResult>;

interface Pending {
  manifest: string;
  lockfile: string | null;
  revision: string;
  key: string;
}

export class DependencyReconciler {
  private installedKey: string | null = null;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private queued: Pending | null = null;
  private running: { key: string; revision: string; controller: AbortController } | null = null;
  private latestRevision: string | null = null;

  constructor(
    private readonly install: Install,
    private readonly onEvent: (e: InstallEvent) => void,
    private readonly debounceMs = 600,
  ) {}

  /** Call with the saved manifest whenever package.json or the lockfile changes. */
  request(manifest: string, lockfile: string | null, revision: string) {
    this.latestRevision = revision;
    const check = dependencyKey(manifest, lockfile);
    if (!check.ok) {
      this.onEvent({ type: "invalid", revision, reason: check.reason });
      return;
    }
    const target = this.running?.key ?? this.installedKey;
    if (check.key === target && !this.queued) {
      this.cancelTimer();
      this.onEvent({ type: "unchanged", revision });
      return;
    }
    this.queued = { manifest, lockfile, revision, key: check.key };
    this.cancelTimer();
    this.timer = setTimeout(() => {
      this.timer = null;
      void this.drain();
    }, this.debounceMs);
  }

  /** Stops waiting work and the running install (its result is then ignored). */
  dispose() {
    this.cancelTimer();
    this.queued = null;
    this.running?.controller.abort();
  }

  private cancelTimer() {
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
  }

  private async drain(): Promise<void> {
    if (this.running || !this.queued) return;
    const job = this.queued;
    this.queued = null;
    if (job.key === this.installedKey) {
      this.onEvent({ type: "unchanged", revision: job.revision });
      return;
    }
    const controller = new AbortController();
    this.running = { key: job.key, revision: job.revision, controller };
    this.onEvent({ type: "started", revision: job.revision });
    let result: RuntimeResult;
    try {
      result = await this.install(job.manifest, job.lockfile, controller.signal);
    } catch {
      result = { ok: false, unsupported: false, reason: "The install failed unexpectedly." };
    }
    this.running = null;
    // `queued` may have changed while awaiting; re-read it without the earlier narrowing.
    const next = this.queued as Pending | null;
    const stale = controller.signal.aborted || (next !== null && next.key !== job.key);
    if (stale) this.onEvent({ type: "superseded", revision: job.revision });
    else if (result.ok) {
      this.onEvent({ type: "completed", revision: job.revision });
    } else this.onEvent({ type: "failed", revision: job.revision, reason: result.reason });
    if (result.ok && !controller.signal.aborted) this.installedKey = job.key;
    if (this.queued && !this.timer) await this.drain();
  }

  /** The newest revision seen, for callers checking runtime consistency. */
  get revision() {
    return this.latestRevision;
  }
}
