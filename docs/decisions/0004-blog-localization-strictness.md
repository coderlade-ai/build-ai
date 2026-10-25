# ADR 0004: Blog localization strictness

- **Status:** Accepted
- **Date:** 2026-10-25

## Context

do-&-not-do.md §11 relaxes the rule that every article ships in all eight locales; every other document keeps it strict.

## Decision

**Strict:** an article is published only when all eight locale editions (`en, ru, ja, ko, zh, tr, fr, pt`) exist, share one `translationId`, and pass validation. A missing edition blocks publication of the whole set. Drafts may exist in fewer locales with `draft: true`.

## Consequences

Matches PRD owner decision 6 and avoids half-translated public pages.
