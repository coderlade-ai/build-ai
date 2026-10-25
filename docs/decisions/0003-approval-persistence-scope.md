# ADR 0003: Approval persistence scope

- **Status:** Accepted
- **Date:** 2026-10-25

## Context

GUIDE.md offers "Always allow in this project"; PRD.md forbids always-allow and only allows scoped, per-session consent.

## Decision

Adopt the **stricter PRD rule** for alpha: approvals persist at most for the current session and only for a narrow pattern (one tool + one path or command pattern). There is no "always allow in this project" option. Every persisted approval is visible and revocable in Settings → Permissions.

## Consequences

Safer default; can be relaxed later by a new ADR with a security review.
