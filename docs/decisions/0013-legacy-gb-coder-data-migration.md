# ADR 0013: Legacy "GB Coder" data migration

- **Status:** Proposed — awaiting owner
- **Date:** 2026-10-25

## Context

README §18 requires preserving data from an existing "GB Coder" IndexedDB installation, but no schema or source is provided.

## Decision

Until the owner supplies the GB Coder repository or schema, no migration code is written and the new database uses its own name (`ladestack-build`), so it can never overwrite legacy data.

## Consequences

Owner input required.
