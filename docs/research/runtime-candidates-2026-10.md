# Runtime candidates: licence and capability review (2026-10-26)

Input for ADR 0008. This is a **desk review** of published packages, licence files and
documentation. Nothing here is a benchmark result; each candidate still has to pass the R01–R15
harness (`apps/builder/src/runtime/benchmark.ts`) and browser runs before it can be selected.
Not legal advice: anything marked "owner/legal" needs a decision before production use.

Sources were read on 2026-10-26 from the npm tarballs (`npm pack`) and the projects' pages.

| Candidate                | Version checked | Licence (as published)                                                                 | npm install         | Vite dev server / HMR                 | Isolation model                                    | Licence gate                                                       |
| ------------------------ | --------------- | -------------------------------------------------------------------------------------- | ------------------- | ------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------ |
| almostnode               | 0.2.14          | MIT (LICENSE in tarball)                                                               | Claimed             | Claimed (built-in Vite + Next.js, React Refresh) | Cross-origin sandbox page + service worker         | Passes on paper                                                    |
| Lifo (`@lifo-sh/core`)   | 0.10.24         | "MIT" in package.json and README; **no LICENSE file** in the tarball or repo root      | Not documented for npm registry packages | Not documented                        | Runs in page or worker; no documented origin split | Needs a LICENSE file from the maintainers (owner/legal)            |
| WebContainers (`@webcontainer/api`) | 1.6.4 | Client package MIT; runtime use governed by StackBlitz Terms. Commercial, for-profit **production** use needs a licence (POCs exempt) | Yes (documented)     | Yes (documented)                      | Requires cross-origin isolation headers (COOP/COEP) | Owner must ask StackBlitz whether a free, MIT, no-revenue product needs a licence |
| Wasmer JS SDK (`@wasmer/sdk`) | 0.19.1     | "Modified MIT": MIT plus a duty to display "Wasmer" in the UI above 1M MAU or US$1M monthly revenue | No (runs WASI/WASIX packages, not npm) | No                                    | Worker + WASI sandbox                              | Passes, with attribution clause noted                              |
| Nodebox (`@codesandbox/nodebox`) | 0.1.9   | Sustainable Use License 1.0: internal business, non-commercial or personal use only; free non-commercial distribution | Yes (documented by CodeSandbox) | Partial                               | CodeSandbox-hosted preview iframe                  | Fails for a public product without legal sign-off                  |
| esbuild-wasm (current experimental preview, ADR 0018) | 0.28.2 | MIT                                                | No (esm.sh CDN)     | No dev server; rebuild on save        | Our preview origin (ADR 0016)                      | Passes                                                             |

## Notes per candidate

- **almostnode**: MIT, emulates Node 20 APIs, `npm install`, `npm run`, bin stubs, Vite and Next.js
  dev servers through a service worker, and a cross-origin sandbox mode (`createRuntime` with a
  `sandbox` URL; same-origin needs an explicit `dangerouslyAllowSameOrigin`). That sandbox maps
  onto our preview origin (ADR 0016). Risks: self-described experimental, 0.x, 15 MB `dist`, and
  runtime dependencies that look unrelated to a runtime (`ai`, `@ai-sdk/*`, `@xterm/*`) to be
  checked for what actually ships to the preview.
- **Lifo**: a TypeScript Unix-like OS (shell, VFS with IndexedDB persistence, `node` with 15 shimmed
  modules, `pkg` installing from URLs). Strong for commands and persistence; npm-registry installs
  and a Vite dev server are not documented. The missing LICENSE file is a hard-gate blocker until
  the maintainers add one.
- **WebContainers**: the most complete Node/npm/Vite compatibility, but production use in a
  "commercial, for-profit setting" needs a StackBlitz licence, and it needs COOP/COEP headers on
  the page that hosts it. LadeStack Build is free and MIT, but whether that counts as for-profit
  is for StackBlitz to confirm in writing.
- **Wasmer SDK**: good WASI sandbox; not a Node/npm/Vite runtime, so it does not meet the minimum
  React/Vite compatibility gate on its own.
- **Nodebox**: licence restricts use to non-commercial/internal purposes; excluded unless legal
  review says otherwise.

## Proposed next step

1. Write a `RuntimeAdapter` for **almostnode** in its cross-origin sandbox mode on the preview
   origin and run the R01–R15 harness plus the CI browser check on fixture F1.
2. In parallel, owner asks StackBlitz about WebContainers licensing for a free MIT product, and
   asks the Lifo maintainers to add a LICENSE file.
3. ADR 0008 stays open until a candidate passes the hard gates with browser evidence.
