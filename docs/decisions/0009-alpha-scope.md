# ADR 0009: Alpha scope

- **Status:** Accepted
- **Date:** 2026-10-25

## Context

Scope across documents is very large.

## Decision

Public alpha = **React + TypeScript + Vite** projects only; **Chrome and Edge desktop**; agent modes **Code, Plan, Ask, Debug**; flow generate → preview → save → checkpoint → export ZIP. Review, Orchestrate, Custom modes, subagents, MCP and other frameworks are post-alpha. A preview-isolation failure blocks release.

## Consequences

Ship one dependable workflow before breadth.
