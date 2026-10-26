import { alphaAgentModes, type AlphaAgentMode } from "@ladestack/shared-types";

export type AlphaMode = AlphaAgentMode;

/** Upper bound for a prompt typed into the welcome composer. */
export const maxPromptLength = 20_000;

/** sessionStorage key: the draft lives only in this tab and holds no secrets. */
export const draftStorageKey = "ladestack.welcome-draft.v1";

export interface Draft {
  prompt: string;
  mode: AlphaMode;
}

export const emptyDraft: Draft = { prompt: "", mode: "code" };

export function isAlphaMode(value: unknown): value is AlphaMode {
  return typeof value === "string" && (alphaAgentModes as readonly string[]).includes(value);
}

/** A prompt can be sent when it has visible text and fits the limit. */
export function canSubmit(prompt: string): boolean {
  const trimmed = prompt.trim();
  return trimmed.length > 0 && prompt.length <= maxPromptLength;
}

/** Ctrl+Enter or Cmd+Enter submits; plain Enter adds a new line; ignored while composing IME text. */
export function isSubmitShortcut(e: {
  key: string;
  ctrlKey: boolean;
  metaKey: boolean;
  isComposing?: boolean;
}): boolean {
  return e.key === "Enter" && (e.ctrlKey || e.metaKey) && !e.isComposing;
}

export function serializeDraft(d: Draft): string {
  return JSON.stringify({ prompt: d.prompt.slice(0, maxPromptLength), mode: d.mode });
}

/** Reads a stored draft defensively: anything malformed becomes the empty draft. */
export function parseDraft(raw: string | null): Draft {
  if (!raw) return emptyDraft;
  try {
    const v: unknown = JSON.parse(raw);
    if (typeof v !== "object" || v === null) return emptyDraft;
    const { prompt, mode } = v as Record<string, unknown>;
    return {
      prompt: typeof prompt === "string" ? prompt.slice(0, maxPromptLength) : "",
      mode: isAlphaMode(mode) ? mode : "code",
    };
  } catch {
    return emptyDraft;
  }
}
