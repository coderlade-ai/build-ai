# ADR 0007: Hosting and routing

- **Status:** Accepted
- **Date:** 2026-10-25

## Context

Documents alternate between "Vercel and Cloudflare" and "Vercel or Cloudflare".

## Decision

Primary target for alpha: **Vercel** for the Next.js builder (`basePath: /app`) and **Cloudflare Pages** (static) for the Astro site, joined behind `build.ladestack.in` by an edge path router (`/app/**` → builder, everything else → website). Cloudflare-hosted Next.js (vinext) stays a research item and is not a launch dependency. Generated-project previews run on a **separate preview origin**, never on `build.ladestack.in`.

## Consequences

Native Next.js support with the least risk; each app deploys and rolls back independently.
