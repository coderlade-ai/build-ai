/**
 * Initial BYOK providers (PRD A.17). Each one accepts direct browser requests (CORS
 * preflight verified 2026-10-26, see docs/decisions/0014), so keys never pass through
 * a LadeStack server. Model lists come live from the provider; nothing is hardcoded.
 */
export const providerIds = ["openai", "anthropic", "gemini", "openrouter"] as const;
export type ProviderId = (typeof providerIds)[number];

export interface ProviderInfo {
  id: ProviderId;
  name: string;
  /** Where the user creates a key, on the provider's own site. */
  keyUrl: string;
}

export const providers: Record<ProviderId, ProviderInfo> = {
  openai: { id: "openai", name: "OpenAI", keyUrl: "https://platform.openai.com/api-keys" },
  anthropic: {
    id: "anthropic",
    name: "Anthropic",
    keyUrl: "https://console.anthropic.com/settings/keys",
  },
  gemini: { id: "gemini", name: "Google Gemini", keyUrl: "https://aistudio.google.com/apikey" },
  openrouter: { id: "openrouter", name: "OpenRouter", keyUrl: "https://openrouter.ai/keys" },
};

export function isProviderId(value: unknown): value is ProviderId {
  return typeof value === "string" && (providerIds as readonly string[]).includes(value);
}

/** Cheap shape check before any network call: printable ASCII, no spaces, sane length. */
export function looksLikeKey(key: string): boolean {
  return /^[\x21-\x7e]{20,400}$/.test(key);
}
