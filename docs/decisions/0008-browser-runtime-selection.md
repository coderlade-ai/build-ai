# ADR 0008: Browser runtime selection

- **Status:** Accepted
- **Date:** 2026-10-25

## Context

Runtime candidates: WebContainers, Lifo, Wasmer, Sandpack, esbuild-wasm. WebContainers needs a commercial licence for production.

## Decision

No runtime is chosen yet. The runtime is selected only after the R01–R15 benchmark suite runs on a declared reference machine and the licence for production use is confirmed. Hard gates (no source corruption, no preview-origin exposure, valid commercial rights) override averages. The adapter contract in README §16 is implemented first so candidates are swappable.

## Consequences

Avoids locking into an unlicensed or unproven runtime.

## Addendum (2026-10-26): benchmark harness

`apps/builder/src/runtime/benchmark.ts` runs R01–R06 and R11–R12 through the `RuntimeAdapter`
contract (ADR 0017) on fixtures F0 (static) and F1 (React + TS + Vite + Tailwind, 50–200 files),
marks what a runtime does not offer as `unsupported`, and leaves browser-only scenarios (R13–R15,
plus R07–R10 for runtimes with processes) as `manual`. Hard gates R02, R11, R15 and the licence
block selection unless proven. First results: `docs/benchmarks/runtime-contract-2026-10-26.md`.
No Node runtime candidate has been benchmarked yet; the decision above still stands.

## Addendum (2026-10-26): candidate licence review

Desk review in `docs/research/runtime-candidates-2026-10.md`. On paper, almostnode (MIT) is the
first candidate worth an adapter; WebContainers needs a written answer from StackBlitz; Lifo needs
a LICENSE file; Wasmer SDK is not an npm/Vite runtime; Nodebox's Sustainable Use License excludes
it without legal sign-off. No runtime is selected.
