import type { ProjectKind, RuntimeAdapter } from "./contract";
import { createStaticRuntime } from "./static";

/** Which kind of project these files are (README §16 package.json policy). */
export function projectKind(paths: string[]): ProjectKind | null {
  if (paths.includes("package.json")) return "node";
  return paths.includes("index.html") ? "static" : null;
}

/** Runtimes available in this build. Node candidates join only after ADR 0008's benchmark. */
const available: (() => RuntimeAdapter)[] = [createStaticRuntime];

export type RuntimeChoice =
  | { ok: true; adapter: RuntimeAdapter }
  | { ok: false; kind: ProjectKind | null; reason: string };

/** Picks a runtime whose capabilities cover the project, or says honestly that none does. */
export function selectRuntime(paths: string[]): RuntimeChoice {
  const kind = projectKind(paths);
  if (!kind) return { ok: false, kind, reason: "There is no index.html or package.json." };
  for (const make of available) {
    const adapter = make();
    if (adapter.capabilities().projectKinds.includes(kind)) return { ok: true, adapter };
  }
  return {
    ok: false,
    kind,
    reason:
      "Node projects (package.json) need a browser runtime, which is chosen only after the benchmark and licence check in ADR 0008.",
  };
}
