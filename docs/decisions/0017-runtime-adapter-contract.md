# ADR 0017: Runtime adapter contract

- **Status:** Accepted
- **Date:** 2026-10-26

## Context

ADR 0008 defers choosing a Node/npm browser runtime until the R01–R15 benchmark and licence check, and requires the README §16 adapter contract first so candidates are swappable.

## Decision

- `apps/builder/src/runtime/contract.ts` defines `RuntimeAdapter` exactly as README §16 lists it (capabilities, initialize/dispose, mount/read/write/delete, installDependencies, start/stop/stream processes, preview endpoint and status, snapshot, revision reconciliation). Every call returns `RuntimeResult`, and an adapter answers `unsupported` with a reason instead of faking success.
- `RuntimeCapabilities.productionLicenceVerified` records the ADR 0008 licence hard gate per adapter.
- `static.ts` is the only adapter shipped: plain files served by the isolated preview origin (ADR 0016). Install and process calls are `unsupported`.
- `select.ts` picks the first available adapter whose `projectKinds` cover the project; `package.json` projects get an honest "no runtime yet" until a benchmarked candidate is added to its list.
- `reconcile.ts` implements README §16 dependency reconciliation independent of any runtime: complete-manifest validation, a dependency key that ignores unrelated fields and ordering, debounce/coalescing, one install at a time, superseded results ignored, unchanged manifests skipped, failures retried on the next request. Install scripts are off by default in `InstallPolicy`.

## Consequences

Benchmark candidates (WebContainers, Lifo, Wasmer, Sandpack/Nodebox, esbuild-wasm) can each be written as an adapter and measured against the same contract. The preview UI still uses its own static path; moving it onto `selectRuntime` happens with the first Node adapter.
