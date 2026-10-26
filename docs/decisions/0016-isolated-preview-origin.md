# ADR 0016: Isolated preview origin for project previews

- **Status:** Accepted (implementation); preview hostname awaiting owner
- **Date:** 2026-10-26

## Context

Generated projects contain arbitrary HTML and JavaScript written by a model. If they ran on the builder origin they could read the BYOK key in `sessionStorage` (ADR 0014) and every project in IndexedDB. ADR 0007 already requires previews on a separate origin; ADR 0015 kept `frame-src 'none'` until one existed. The npm/Vite runtime is still unselected (ADR 0008), but plain HTML/CSS/JS projects need no runtime.

## Decision

- **`apps/preview`**: a tiny static host (no framework) deployed on its own origin. `index.html` + `host.js` receive files from the builder; a service worker (`sw.js`) serves them under `/p/<session>/` from Cache Storage, so a stopped worker loses nothing. Root-relative URLs from a project page (`/styles.css`) map into that page's project.
- **Builder → preview protocol** (`postMessage` only): the host announces `ladestack:preview-ready`; the builder answers with `ladestack:preview-files` `{ session, files }`, posted to the preview origin only; the host replies `ladestack:preview-loaded`. Both sides check `event.source` and `event.origin`. The host validates every message (session id format, safe relative paths, string contents, at most 2,000 files / 50 MB) and drops anything else.
- **Who may frame what**: builder CSP `frame-src` is exactly the preview origin (otherwise `'none'`). The host page sends `frame-ancestors` = the configured builder origins; project pages send `frame-ancestors 'self'`, so only the host can frame them. The builder frames the host with `sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups"` (no top navigation). `allow-same-origin` is safe here because the frame is cross-origin: it only gives the preview its own storage.
- **Configuration**: builder `NEXT_PUBLIC_PREVIEW_ORIGIN` (https, or http on localhost for development; unset = preview shows "not set up"). Preview build `PREVIEW_PARENT_ORIGINS` (comma-separated builder origins) is baked into `config.js` and a `_headers` file.
- **Scope now**: projects with a root `index.html` and no `package.json`. Projects with `package.json` show "needs the runtime" until ADR 0008's runtime lands.

## Hosting

The preview must not share an origin with the builder or website. A separate registrable domain is preferred (no shared cookies at all); a subdomain such as `preview.ladestack.in` is acceptable because the builder sets no cookies. Static hosting with the generated `_headers` (Cloudflare Pages / Netlify format) works; other hosts must send the same headers. **The hostname is an owner decision.**

## Consequences

- Alpha browsers (Chrome/Edge desktop, ADR 0009) support the module service worker used here; Firefox support for module workers should be checked before widening browser support.
- The CI browser check builds the builder with a local preview origin, serves `apps/preview`, opens the static template's preview and clicks its button, proving scripts run there under both policies.
- Preview updates on every saved change; unsaved editor text is not previewed.
