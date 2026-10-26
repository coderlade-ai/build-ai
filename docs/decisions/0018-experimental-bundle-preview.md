# ADR 0018: Experimental in-browser bundle preview for package.json projects

- **Status:** Accepted (experimental)
- **Date:** 2026-10-26

## Context

The alpha targets React + TypeScript + Vite, but ADR 0008 keeps the full Node/npm runtime choice open until the benchmark and licence check. Until then `package.json` projects could not be previewed at all.

## Decision

- The preview origin (ADR 0016) bundles `package.json` projects before serving them, using **esbuild-wasm 0.28.2 (MIT)**, self-hosted under `/vendor/esbuild/` and run on the preview origin only (`script-src 'self' 'wasm-unsafe-eval'` there; the builder's CSP is unchanged).
- Entry: the first local `<script type="module" src>` in `index.html` (the Vite convention). Local imports resolve like Vite (extensions, `index.*`); `.module.css` uses esbuild's `local-css`; `public/` is served at the root; `import.meta.env` and `process.env.NODE_ENV` are defined for development.
- Bare imports become `https://esm.sh/<name>@<range from package.json><subpath>`. Imports not listed in `package.json`, Node built-ins, and non-registry versions (`file:`, `git:`, `workspace:` …) are build errors. CSS imported from packages becomes a `<link>` to esm.sh.
- **Tailwind CSS**: a stylesheet containing `@import "tailwindcss"` (or v3 `@tailwind base/components/utilities`, rewritten to the v4 import) is not bundled by esbuild; it goes into a `<style type="text/tailwindcss">` compiled in the page by **@tailwindcss/browser 4.3.3 (MIT)**, self-hosted at `/vendor/tailwind/browser.js` and copied into the project's preview files. `@theme`, `@apply` and utilities work; `tailwind.config.js`, `@plugin`/`@config` and PostCSS plugins are not applied. Every `@import` is removed from the Tailwind source (the browser compiler adds `@import "tailwindcss"` itself, and Chrome would otherwise fetch the import as a file): remote `@import`s such as web fonts move to a plain `<style>`, and local ones are not followed.
- Build errors show as an error page in the preview and are sent to the builder console as `Build error:` entries, so Debug mode and `check_preview` see them.
- The builder labels these previews "Experimental" and says packages load from esm.sh. The runtime contract (ADR 0017) lists it as `esbuild-bundle` with `install: false`, `processes: false`, `network: "package-registry"`.

## Limits (stated to users and to the agent)

Not a Node runtime: no `npm install`, no dev server or HMR, no Vite config or plugins, no PostCSS processing (Tailwind only through the browser compiler above), no Node APIs. Package names and versions are requested from esm.sh, a third-party public CDN, when a bundled preview loads.

## Consequences

The React template and agent-generated React apps preview today. ADR 0008 stays open: a benchmarked runtime can replace or sit beside this adapter without changing the builder's preview protocol.
