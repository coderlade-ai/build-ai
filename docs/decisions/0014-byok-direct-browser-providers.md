# ADR 0014: BYOK provider connections go directly from the browser

- **Status:** Accepted
- **Date:** 2026-10-26

## Context

PRD A.17 lists OpenAI, Anthropic, Google Gemini and OpenRouter as initial adapters, allows direct browser calls only where the provider supports them, and otherwise requires a disclosed relay (D-03). D-10 proposes session-only key persistence with encrypted storage as a later opt-in.

## Evidence

CORS preflight (`OPTIONS` with `Origin: https://build.ladestack.in`) checked on 2026-10-26:

| Endpoint | Allowed headers | Allow-Origin |
| --- | --- | --- |
| `api.openai.com/v1/models`, `/v1/chat/completions` | `authorization`, `content-type` | `*` / echoed origin |
| `api.anthropic.com/v1/models` | `x-api-key`, `anthropic-version`, `anthropic-dangerous-direct-browser-access` | `*` |
| `generativelanguage.googleapis.com/v1beta/models` | `x-goog-api-key` | echoed origin |
| `openrouter.ai/api/v1/key` | `Authorization` (and others) | `*` |

Streaming endpoints were checked the same way on 2026-10-26: `api.anthropic.com/v1/messages` (adds `content-type`), `…/models/{model}:streamGenerateContent?alt=sse` (adds `content-type`) and `openrouter.ai/api/v1/chat/completions` all allow `POST` from the builder origin.

This verifies browser transport only, not inference with a valid paid key. Anthropic organisations can disable CORS in their settings; that surfaces as an invalid-key or network error.

## Decision

- All four providers are called **directly from the browser**. No LadeStack relay exists, so keys never reach a LadeStack server.
- Keys go only in request headers, never in URLs. Requests use `credentials: "omit"`, `redirect: "error"`, `cache: "no-store"`, `referrerPolicy: "no-referrer"`.
- **Key persistence: tab session only.** The connection (`provider`, `key`, `model`) is kept in `sessionStorage`: it survives a reload of the same tab and is cleared when the tab closes. It is never written to IndexedDB, projects, exports, checkpoints, logs or `localStorage`. Passphrase-encrypted persistence is a later opt-in.
- Model lists are fetched live from each provider; nothing is hardcoded. Tool-calling capability is shown only when the provider reports it (OpenRouter `supported_parameters`; Anthropic models all support tools).
- Raw provider error bodies are never shown; errors map to localized recovery messages (invalid key, billing, rate limit, unavailable, network, timeout, no models).

## Consequences

- No hosting cost or abuse surface from a relay; the "no LadeStack server sees your key" statement stays true.
- Same-origin XSS could read a key in `sessionStorage` (as it could read one in memory). A strict CSP for the builder is required before launch.
- Adding a provider without browser CORS support needs a new ADR and a disclosed relay.
