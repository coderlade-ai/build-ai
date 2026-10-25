# ADR 0006: Canonical names glossary

- **Status:** Accepted
- **Date:** 2026-10-25

## Context

Tool, state, store, event and benchmark names differ across documents (e.g. `move_file` vs `rename_file`, `run_command` vs `execute_command`; F0–F8 vs T01–T15 vs R01–R15).

## Decision

Canonical names live in code in `packages/shared-types` and override any document spelling:

- **Tools:** `list_files`, `read_file`, `search_code`, `write_file`, `apply_patch`, `rename_file`, `delete_file`, `read_diagnostics`, `install_dependencies`, `run_command`, `read_terminal`, `get_preview_status`, `capture_preview`, `create_checkpoint`, `restore_checkpoint`, `delegate_task`, `search_web`, `export_source_zip`.
- **File status:** `queued → generating → saving → saved | failed`.
- **Events:** dotted names from README §17 (`agent.task.started`, `project.file.saved`, `runtime.server.ready`, …).
- **Benchmarks:** README IDs `R01`–`R15`.
- **Brand:** always "LadeStack Build" (never "LadeStack Builder").
- **Design file:** `DESIGN.md`.

## Consequences

One vocabulary for code, tests and docs.
