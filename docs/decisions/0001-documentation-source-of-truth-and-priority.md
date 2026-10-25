# ADR 0001: Documentation source of truth and priority

- **Status:** Accepted
- **Date:** 2026-10-25

## Context

The eight planning documents overlap heavily and disagree on priority: AGENT.md ranks itself above SKILL.md, while SKILL.md calls itself authoritative and never mentions AGENT.md. They also rank "actual code" differently.

## Decision

Priority, highest first, when instructions conflict:

1. Explicit instruction from the product owner in the current task.
2. Security, privacy, secret-handling and data-integrity rules (never overridden).
3. Accepted decisions in `docs/decisions/` (this folder).
4. `PRD.md` — the master product specification.
5. `AGENT.md` and `SKILL.md` — agent operating rules (equal rank; where they differ, the stricter rule wins).
6. `INSTRUCTIONS.md`, `GUIDE.md`, `do-&-not-do.md`.
7. `DESIGN.md` — visual reference only (pricing components excluded).
8. `README.md` — overview.

Verified repository state (code, configs, test output) always describes **what exists**; documents describe **what is intended**. A document never proves a feature is implemented.

## Consequences

Agents get one deterministic ordering. Later work should consolidate AGENT.md and SKILL.md into a single agent manual.
