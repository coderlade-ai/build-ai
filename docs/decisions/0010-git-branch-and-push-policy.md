# ADR 0010: Git branch and push policy

- **Status:** Accepted
- **Date:** 2026-10-25

## Context

One document says push to the configured branch; another forbids automatic pushes to `main`.

## Decision

Agents never push directly to `main`. Each phase works on a branch named `<type>/<scope>` (for example `setup/phase-0`, `feat/astro-home`). Every completed atomic unit is validated, committed with a Conventional Commit message, pushed to that branch and verified (`local HEAD == remote HEAD`). Merging to `main` happens through a pull request. Never force-push, never use `git add .` blindly, never commit secrets.

## Consequences

Keeps `main` releasable and gives the owner a review point.
