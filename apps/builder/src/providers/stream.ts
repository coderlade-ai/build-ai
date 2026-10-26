import { authHeaders, classifyStatus, type ConnectError } from "./connect";
import type { ProviderId } from "./registry";
import { readSse } from "./sse";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export type StreamError = ConnectError | "interrupted" | "aborted" | "rejected";

export class ProviderStreamError extends Error {
  constructor(readonly code: StreamError) {
    super(code); // never the provider's body or the request
    this.name = "ProviderStreamError";
  }
}

export interface StreamOptions {
  provider: ProviderId;
  key: string;
  model: string;
  system: string;
  messages: ChatMessage[];
  signal?: AbortSignal;
  maxTokens?: number;
  fetchImpl?: typeof fetch;
}

interface Request {
  url: string;
  body: unknown;
}

export function buildRequest(o: StreamOptions): Request {
  const maxTokens = o.maxTokens ?? 4096;
  switch (o.provider) {
    case "anthropic":
      return {
        url: "https://api.anthropic.com/v1/messages",
        body: {
          model: o.model,
          max_tokens: maxTokens,
          system: o.system,
          messages: o.messages,
          stream: true,
        },
      };
    case "gemini":
      return {
        url: `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(o.model)}:streamGenerateContent?alt=sse`,
        body: {
          systemInstruction: { parts: [{ text: o.system }] },
          contents: o.messages.map((m) => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.content }],
          })),
          generationConfig: { maxOutputTokens: maxTokens },
        },
      };
    default:
      return {
        url:
          o.provider === "openai"
            ? "https://api.openai.com/v1/chat/completions"
            : "https://openrouter.ai/api/v1/chat/completions",
        body: {
          model: o.model,
          messages: [{ role: "system", content: o.system }, ...o.messages],
          stream: true,
        },
      };
  }
}

/** Text in one SSE payload, and whether it marks a clean finish. Throws on in-stream errors. */
export function readChunk(provider: ProviderId, payload: string): { text: string; done: boolean } {
  if (payload === "[DONE]") return { text: "", done: true };
  let j: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  try {
    j = JSON.parse(payload);
  } catch {
    return { text: "", done: false };
  }
  if (j.error || j.type === "error") {
    const status = Number(j.error?.code ?? j.error?.status);
    throw new ProviderStreamError(
      j.error?.type === "overloaded_error"
        ? "unavailable"
        : Number.isFinite(status)
          ? classifyStatus(status)
          : "unexpected",
    );
  }
  switch (provider) {
    case "anthropic":
      if (j.type === "content_block_delta" && j.delta?.type === "text_delta")
        return { text: String(j.delta.text ?? ""), done: false };
      return { text: "", done: j.type === "message_stop" };
    case "gemini": {
      const c = j.candidates?.[0];
      const parts: { text?: string; thought?: boolean }[] = c?.content?.parts ?? [];
      const text = parts
        .filter((p) => !p.thought)
        .map((p) => p.text ?? "")
        .join("");
      return { text, done: Boolean(c?.finishReason) };
    }
    default: {
      const c = j.choices?.[0];
      return { text: String(c?.delta?.content ?? ""), done: false };
    }
  }
}

/**
 * Streams a chat reply straight from the provider (ADR 0014). Yields text deltas.
 * Throws ProviderStreamError with a code only; already-yielded text stays with the caller.
 */
export async function* streamChat(o: StreamOptions): AsyncGenerator<string> {
  const { url, body } = buildRequest(o);
  let res: Response;
  try {
    res = await (o.fetchImpl ?? fetch)(url, {
      method: "POST",
      headers: { ...authHeaders(o.provider, o.key), "content-type": "application/json" },
      body: JSON.stringify(body),
      signal: o.signal,
      credentials: "omit",
      cache: "no-store",
      redirect: "error",
      referrerPolicy: "no-referrer",
    });
  } catch (e) {
    throw new ProviderStreamError(
      o.signal?.aborted ? "aborted" : e instanceof TypeError ? "network" : "unexpected",
    );
  }
  if (!res.ok || !res.body)
    throw new ProviderStreamError(res.ok ? "unexpected" : classifyStatus(res.status));

  let finished = false;
  try {
    for await (const payload of readSse(res.body)) {
      const { text, done } = readChunk(o.provider, payload);
      if (text) yield text;
      if (done) finished = true;
    }
  } catch (e) {
    if (e instanceof ProviderStreamError) throw e;
    throw new ProviderStreamError(o.signal?.aborted ? "aborted" : "interrupted");
  }
  // OpenAI-style streams finish with [DONE]; a stream that just stops was cut off.
  if (!finished) throw new ProviderStreamError(o.signal?.aborted ? "aborted" : "interrupted");
}

/** Ask mode: answers only, no tools, no file changes (PRD Ask mode). */
export const askSystemPrompt = [
  "You are the Ask mode of LadeStack Build, a browser-based builder for websites and web apps.",
  "Answer questions about web development, the user's ideas and code clearly and concisely.",
  "In Ask mode you have no tools: never claim to have created, changed, run or saved files.",
  "Reply in the language the user writes in.",
].join(" ");
