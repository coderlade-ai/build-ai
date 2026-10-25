# ADR 0005: UI component foundation

- **Status:** Accepted
- **Date:** 2026-10-25

## Context

shadcn/ui and React Aria are both named as the base component layer, which would mean two focus and overlay systems.

## Decision

**shadcn/ui (Radix primitives) is the single foundation** for the Next.js builder. React Aria is used only for specialised collection/selection widgets that Radix lacks, wrapped behind our own components, and never mixed inside the same overlay. Kibo UI and Aceternity are opt-in per component after a licence and accessibility audit. The Astro site uses plain Astro components and shared design tokens with minimal client JS.

## Consequences

One focus/portal model, smaller bundles, simpler accessibility testing.
