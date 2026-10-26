import type { ProviderId } from "./registry";

export interface ModelInfo {
  id: string;
  label: string;
  /** True or false only when the provider reports it; undefined means unknown. */
  tools?: boolean;
}

export type ConnectError =
  | "invalid-key"
  | "billing"
  | "rate-limit"
  | "unavailable"
  | "network"
  | "timeout"
  | "no-models"
  | "unexpected";

export type ConnectResult = { ok: true; models: ModelInfo[] } | { ok: false; error: ConnectError };

type Fetch = typeof fetch;
const timeoutMs = 15_000;

/** Headers each provider expects. The key only ever goes in a header, never a URL. */
export function authHeaders(provider: ProviderId, key: string): Record<string, string> {
  switch (provider) {
    case "anthropic":
      return {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      };
    case "gemini":
      return { "x-goog-api-key": key };
    default:
      return { authorization: `Bearer ${key}` };
  }
}

const modelsUrl: Record<ProviderId, string> = {
  openai: "https://api.openai.com/v1/models",
  anthropic: "https://api.anthropic.com/v1/models?limit=1000",
  gemini: "https://generativelanguage.googleapis.com/v1beta/models?pageSize=1000",
  openrouter: "https://openrouter.ai/api/v1/models",
};

// OpenAI lists every model family; keep the ones that can hold a conversation.
const openaiNonChat =
  /embedding|tts|whisper|dall-e|davinci|babbage|moderation|transcribe|audio|realtime|image|search|sora/;

export function parseModels(provider: ProviderId, body: unknown): ModelInfo[] {
  const b = body as Record<string, unknown>;
  const list = (
    Array.isArray(b?.data) ? b.data : Array.isArray(b?.models) ? b.models : []
  ) as Record<string, unknown>[];
  const out: ModelInfo[] = [];
  for (const m of list) {
    switch (provider) {
      case "openai": {
        const id = String(m.id ?? "");
        if (id && !openaiNonChat.test(id)) out.push({ id, label: id });
        break;
      }
      case "anthropic": {
        const id = String(m.id ?? "");
        if (id) out.push({ id, label: String(m.display_name ?? id), tools: true });
        break;
      }
      case "gemini": {
        const name = String(m.name ?? "");
        const methods = Array.isArray(m.supportedGenerationMethods)
          ? m.supportedGenerationMethods
          : [];
        if (name.startsWith("models/") && methods.includes("generateContent")) {
          const id = name.slice("models/".length);
          out.push({ id, label: String(m.displayName ?? id) });
        }
        break;
      }
      case "openrouter": {
        const id = String(m.id ?? "");
        const params = Array.isArray(m.supported_parameters) ? m.supported_parameters : null;
        if (id)
          out.push({
            id,
            label: String(m.name ?? id),
            tools: params ? params.includes("tools") : undefined,
          });
        break;
      }
    }
  }
  return out.sort((a, b) => a.label.localeCompare(b.label));
}

export function classifyStatus(status: number): ConnectError {
  if (status === 401 || status === 403) return "invalid-key";
  if (status === 402) return "billing";
  if (status === 429) return "rate-limit";
  if (status >= 500) return "unavailable";
  if (status === 400) return "invalid-key"; // Gemini answers a malformed key with 400
  return "unexpected";
}

async function call(
  fetchImpl: Fetch,
  url: string,
  headers: Record<string, string>,
  signal: AbortSignal,
) {
  return fetchImpl(url, {
    method: "GET",
    headers,
    signal,
    credentials: "omit",
    cache: "no-store",
    redirect: "error",
    referrerPolicy: "no-referrer",
  });
}

/**
 * Checks a key by listing models straight from the provider. Never logs, stores or echoes
 * the key, and never surfaces raw provider bodies (they can quote request details).
 */
export async function testConnection(
  provider: ProviderId,
  key: string,
  { fetchImpl = fetch, signal }: { fetchImpl?: Fetch; signal?: AbortSignal } = {},
): Promise<ConnectResult> {
  const timeout = AbortSignal.timeout(timeoutMs);
  const combined = signal ? AbortSignal.any([signal, timeout]) : timeout;
  const headers = authHeaders(provider, key);
  try {
    // OpenRouter's model list is public, so check the key itself first.
    if (provider === "openrouter") {
      const res = await call(fetchImpl, "https://openrouter.ai/api/v1/key", headers, combined);
      if (!res.ok) return { ok: false, error: classifyStatus(res.status) };
    }
    const res = await call(fetchImpl, modelsUrl[provider], headers, combined);
    if (!res.ok) return { ok: false, error: classifyStatus(res.status) };
    const models = parseModels(provider, await res.json());
    return models.length > 0 ? { ok: true, models } : { ok: false, error: "no-models" };
  } catch (e) {
    if (timeout.aborted) return { ok: false, error: "timeout" };
    if (e instanceof TypeError) return { ok: false, error: "network" };
    return { ok: false, error: "unexpected" };
  }
}
