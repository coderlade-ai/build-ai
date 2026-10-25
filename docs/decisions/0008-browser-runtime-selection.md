# ADR 0008: Browser runtime selection

- **Status:** Accepted
- **Date:** 2026-10-25

## Context

Runtime candidates: WebContainers, Lifo, Wasmer, Sandpack, esbuild-wasm. WebContainers needs a commercial licence for production.

## Decision

No runtime is chosen yet. The runtime is selected only after the R01–R15 benchmark suite runs on a declared reference machine and the licence for production use is confirmed. Hard gates (no source corruption, no preview-origin exposure, valid commercial rights) override averages. The adapter contract in README §16 is implemented first so candidates are swappable.

## Consequences

Avoids locking into an unlicensed or unproven runtime.
