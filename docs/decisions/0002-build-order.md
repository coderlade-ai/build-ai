# ADR 0002: Build order

- **Status:** Accepted
- **Date:** 2026-10-25

## Context

PRD.md builds local storage, checkpoints and ZIP export before the agent engine; GUIDE.md places storage and checkpoints after the agent and runtime (M7).

## Decision

Follow the **PRD order**: Phase 0 Discovery → 1 Foundations → 2 Astro site → 3 Content/i18n → 4 Next.js shell → 5 Local project core (IndexedDB, checkpoints, ZIP) → 6 BYOK + agents → 7 Runtime integration → 8 Quality/security → 9 Public alpha → 10 Advanced.

Runtime feasibility benchmarks (Phase 0 research gate) start early and run in parallel; their results gate Phase 7, not Phases 1–5.

## Consequences

The agent always writes into a durable, recoverable store, so no generated work is ever lost during early agent development.
