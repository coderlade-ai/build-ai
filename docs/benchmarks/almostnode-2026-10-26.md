# almostnode candidate: contract benchmark (2026-10-26)

Evidence for ADR 0008. Produced by `apps/builder/src/runtime/almostnode.test.ts` against the real
`almostnode@0.2.14` package, installed outside the workspace and run in **Node 22 on the Hark
sandbox** (Linux arm64), not in a browser and not on a declared reference machine. Timings are
indicative only. Regenerate with:

```sh
ALMOSTNODE_PATH=<dir>/node_modules/almostnode/dist/index.mjs BENCH_REPORT=<file> \
  pnpm vitest run apps/builder/src/runtime/almostnode.test.ts
```

## Findings

- **R03/R06 fail on fixture F1.** almostnode's resolver stops at `No matching version found for
  @oxc-project/types@=0.155.0`, a dependency reached through `@vitejs/plugin-react`. That version
  exists on npm; the resolver does not handle the `=x.y.z` range form. Without
  `@vitejs/plugin-react`, React, Vite, TypeScript and Tailwind installed (16 packages, about 1.7 s).
- `npm install` via `container.run` skips `devDependencies`; the adapter calls
  `installFromPackageJson({ includeDev: true })` instead.
- Dependency install scripts were not observed to run, so the adapter treats
  `allowInstallScripts: true` as unsupported. Lockfiles are not honoured (unsupported).
- Its "Vite dev server" is almostnode's own Vite-compatible server, not the project's Vite: it does
  not load `vite.config.*` or Vite plugins, and its HTML injects React Refresh from `esm.sh`. In
  Node it served TSX untransformed (the transform needs esbuild-wasm in a browser).
- `node -e` is not supported; `node file.cjs` runs and reports Node `v20.0.0` / `linux`.
- Adding almostnode as a workspace dependency pulls about 1,000 lockfile lines including native
  build tools (`@swc/core`, `@mongodb-js/zstd`) with install scripts, so it stays out of the
  workspace; the adapter receives `createContainer` by injection.
- Preview (R04) is unsupported until almostnode's service worker runs on the preview origin; R15
  remains a manual, blocking gate.

## Results

### almostnode 0.2.14 (candidate) (`almostnode`) on F0

| ID | Scenario | Outcome | Time | Note |
| --- | --- | --- | --- | --- |
| R01 | Cold initialize | pass | 1 ms | Initialized. |
| R02 | Project mount | pass | 1 ms | 3 files intact. |
| R03 | npm install | unsupported |  | The fixture has no package.json. |
| R04 | Dev server / preview endpoint | unsupported | 4 ms | almostnode's preview needs its service worker on the preview origin (not wired). |
| R05 | Source update (HMR) | pass | 0 ms | Edit reached the runtime; preview reload is covered by the CI browser check. |
| R06 | Manifest change | unsupported |  | The fixture has no package.json. |
| R07 | Node APIs | manual |  | Needs the fixture's own commands in a browser run. |
| R08 | TypeScript build | manual |  | Needs the fixture's own commands in a browser run. |
| R09 | Node API service | manual |  | Needs the fixture's own commands in a browser run. |
| R10 | Advanced framework (SSR) | manual |  | Needs the fixture's own commands in a browser run. |
| R11 | Failure recovery | pass |  | Rejected; files kept. |
| R12 | Persistence | pass |  | Snapshot remounted intact. |
| R13 | Resource usage | manual |  | Timings captured (6 ms total); memory/CPU need a browser profile. |
| R14 | Browser coverage | manual |  | Chrome is covered by the CI browser check; Edge/Firefox/Safari pending. |
| R15 | Isolation/security | manual |  | Needs the preview-origin isolation tests in a browser (ADR 0016). |

Blocking gates: R15

### almostnode 0.2.14 (candidate) (`almostnode`) on F1

| ID | Scenario | Outcome | Time | Note |
| --- | --- | --- | --- | --- |
| R01 | Cold initialize | pass | 0 ms | Initialized. |
| R02 | Project mount | pass | 2 ms | 66 files intact. |
| R03 | npm install | fail | 1233 ms | Install failed: No matching version found for @oxc-project/types@=0.155.0 |
| R04 | Dev server / preview endpoint | unsupported | 0 ms | almostnode's preview needs its service worker on the preview origin (not wired). |
| R05 | Source update (HMR) | pass | 0 ms | Edit reached the runtime; preview reload is covered by the CI browser check. |
| R06 | Manifest change | fail | 168 ms | Install failed: No matching version found for @oxc-project/types@=0.155.0 |
| R07 | Node APIs | manual |  | Needs the fixture's own commands in a browser run. |
| R08 | TypeScript build | manual |  | Needs the fixture's own commands in a browser run. |
| R09 | Node API service | manual |  | Needs the fixture's own commands in a browser run. |
| R10 | Advanced framework (SSR) | manual |  | Needs the fixture's own commands in a browser run. |
| R11 | Failure recovery | pass |  | Rejected; files kept. |
| R12 | Persistence | pass |  | Snapshot remounted intact. |
| R13 | Resource usage | manual |  | Timings captured (1403 ms total); memory/CPU need a browser profile. |
| R14 | Browser coverage | manual |  | Chrome is covered by the CI browser check; Edge/Firefox/Safari pending. |
| R15 | Isolation/security | manual |  | Needs the preview-origin isolation tests in a browser (ADR 0016). |

Blocking gates: R15
