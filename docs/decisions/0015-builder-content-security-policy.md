# ADR 0015: Builder Content-Security-Policy

- **Status:** Accepted
- **Date:** 2026-10-26

## Context

BYOK keys live in the builder tab's `sessionStorage` (ADR 0014). Any script that runs on the builder origin could read one and send it away, so ADR 0014 made a strict CSP a launch requirement. The builder is Next.js App Router on Vercel (ADR 0007), which emits inline bootstrap scripts, and it self-hosts Monaco's AMD build, which injects scripts, styles and web workers at runtime.

## Decision

- **Nonce CSP from middleware** (`apps/builder/src/middleware.ts`, policy in `src/security/csp.ts`): a fresh 128-bit nonce per response; `script-src 'nonce-…' 'strict-dynamic'`. No `unsafe-inline` or `unsafe-eval` for scripts in production. `'strict-dynamic'` lets nonce'd scripts load Next chunks and Monaco's loader without listing hosts.
- **`connect-src 'self'` plus exactly the four provider API origins** (`apiOrigin` in the provider registry). An injected script cannot exfiltrate a key to any other host; adding a provider means adding its origin in one place, and a test fails if code calls a provider URL the CSP does not allow.
- `object-src 'none'`, `base-uri 'none'`, `frame-ancestors 'none'`, `frame-src 'none'` (previews will get their own origin, ADR 0007, and their own policy), `form-action 'self'`, `worker-src 'self' blob:`, `upgrade-insecure-requests`.
- `style-src 'self' 'unsafe-inline'`: Monaco and React set inline styles. Accepted risk: style injection cannot run script or reach the network beyond `connect-src`/`img-src`.
- Static headers from `next.config.ts`: `nosniff`, `Referrer-Policy: no-referrer`, COOP `same-origin`, CORP `same-origin`, `X-Frame-Options: DENY`, restrictive `Permissions-Policy`.
- Dev server only adds `'unsafe-eval'` and `ws:` for React Refresh.
- **Pages render per request** (`dynamic = "force-dynamic"` in both root layouts) because a nonce cannot be baked into prerendered HTML. Unknown locales still 404 via `notFound()`.

## Verification

- Unit tests for the policy (`csp.test.ts`).
- `pnpm --filter @ladestack/builder check:csp` (CI): production server, every page has a nonce CSP, every `<script>` carries that response's nonce, nonces never repeat, unknown locale 404s.
- `check:browser` (CI, Playwright Chromium): welcome hydrates, a template opens the workspace, Monaco mounts, and no CSP violation or page error is reported.

## Consequences

- Builder pages are no longer static; each view is a small serverless render on Vercel. Acceptable for an app surface that is `noindex`.
- Third-party scripts, analytics or CDNs cannot be added without changing this ADR.
- Trusted Types and `require-trusted-types-for` are not enabled yet; revisit once Monaco's policy names are verified in a browser.
