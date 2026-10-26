import { authHeaders, classifyStatus } from "../providers/connect";
import type { ProviderId } from "../providers/registry";
import { ProviderStreamError } from "../providers/stream";
import type { ToolCall, ToolResult, ToolSpec } from "./tools";

/** One model turn: any text it said and the tool calls it wants run. */
export interface StepResult {
  text: string;
  calls: ToolCall[];
}

/**
 * A provider-native conversation. Messages stay in each provider's own format so nothing the
 * provider needs echoed back (Gemini thought signatures, Anthropic blocks) is lost in translation.
 */
export interface Conversation {
  step(signal?: AbortSignal): Promise<StepResult>;
  addResults(results: ToolResult[]): void;
}

export interface ConversationOptions {
  provider: ProviderId;
  key: string;
  model: string;
  system: string;
  prompt: string;
  tools: ToolSpec[];
  fetchImpl?: typeof fetch;
}

const emptySchema = { type: "object", properties: {}, required: [] as string[] };

/* eslint-disable @typescript-eslint/no-explicit-any -- provider JSON is checked field by field */
async function postJson(
  o: ConversationOptions,
  url: string,
  body: unknown,
  signal?: AbortSignal,
): Promise<any> {
  let res: Response;
  try {
    res = await (o.fetchImpl ?? fetch)(url, {
      method: "POST",
      headers: { ...authHeaders(o.provider, o.key), "content-type": "application/json" },
      body: JSON.stringify(body),
      signal,
      credentials: "omit",
      cache: "no-store",
      redirect: "error",
      referrerPolicy: "no-referrer",
    });
  } catch (e) {
    throw new ProviderStreamError(
      signal?.aborted ? "aborted" : e instanceof TypeError ? "network" : "unexpected",
    );
  }
  if (res.ok) {
    try {
      return await res.json();
    } catch {
      throw new ProviderStreamError(signal?.aborted ? "aborted" : "interrupted");
    }
  }
  if (res.status === 400 || res.status === 404 || res.status === 422) {
    // Usually a model without tool support or a rejected schema; Gemini also uses 400 for bad keys.
    const text = await res.text().catch(() => "");
    throw new ProviderStreamError(/API_KEY_INVALID/.test(text) ? "invalid-key" : "rejected");
  }
  throw new ProviderStreamError(classifyStatus(res.status));
}

function parseArgs(raw: unknown): unknown {
  if (typeof raw !== "string") return raw ?? {};
  try {
    return JSON.parse(raw);
  } catch {
    return { __invalid: raw.slice(0, 200) };
  }
}

function openAiCompatible(o: ConversationOptions): Conversation {
  const url =
    o.provider === "openai"
      ? "https://api.openai.com/v1/chat/completions"
      : "https://openrouter.ai/api/v1/chat/completions";
  const messages: any[] = [
    { role: "system", content: o.system },
    { role: "user", content: o.prompt },
  ];
  const tools = o.tools.map((t) => ({
    type: "function",
    function: { name: t.name, description: t.description, parameters: t.parameters ?? emptySchema },
  }));
  return {
    async step(signal) {
      const j = await postJson(o, url, { model: o.model, messages, tools }, signal);
      if (j?.error)
        throw new ProviderStreamError(classifyStatus(Number(j.error.code)) ?? "unexpected");
      const msg = j?.choices?.[0]?.message ?? {};
      const toolCalls: any[] = Array.isArray(msg.tool_calls) ? msg.tool_calls : [];
      messages.push({
        role: "assistant",
        content: msg.content ?? null,
        ...(toolCalls.length ? { tool_calls: toolCalls } : {}),
      });
      return {
        text: typeof msg.content === "string" ? msg.content : "",
        calls: toolCalls.map((c) => ({
          id: String(c.id),
          name: String(c.function?.name ?? ""),
          args: parseArgs(c.function?.arguments),
        })),
      };
    },
    addResults(results) {
      for (const r of results)
        messages.push({ role: "tool", tool_call_id: r.call.id, content: r.output });
    },
  };
}

function anthropic(o: ConversationOptions): Conversation {
  const messages: any[] = [{ role: "user", content: o.prompt }];
  const tools = o.tools.map((t) => ({
    name: t.name,
    description: t.description,
    input_schema: t.parameters ?? emptySchema,
  }));
  return {
    async step(signal) {
      const j = await postJson(
        o,
        "https://api.anthropic.com/v1/messages",
        { model: o.model, max_tokens: 16384, system: o.system, messages, tools },
        signal,
      );
      const content: any[] = Array.isArray(j?.content) ? j.content : [];
      messages.push({ role: "assistant", content });
      return {
        text: content
          .filter((b) => b.type === "text")
          .map((b) => String(b.text ?? ""))
          .join(""),
        calls: content
          .filter((b) => b.type === "tool_use")
          .map((b) => ({ id: String(b.id), name: String(b.name), args: b.input ?? {} })),
      };
    },
    addResults(results) {
      messages.push({
        role: "user",
        content: results.map((r) => ({
          type: "tool_result",
          tool_use_id: r.call.id,
          content: r.output,
          is_error: r.isError,
        })),
      });
    },
  };
}

function gemini(o: ConversationOptions): Conversation {
  const contents: any[] = [{ role: "user", parts: [{ text: o.prompt }] }];
  const functionDeclarations = o.tools.map((t) => ({
    name: t.name,
    description: t.description,
    ...(t.parameters ? { parameters: t.parameters } : {}),
  }));
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(o.model)}:generateContent`;
  return {
    async step(signal) {
      const j = await postJson(
        o,
        url,
        {
          systemInstruction: { parts: [{ text: o.system }] },
          contents,
          tools: [{ functionDeclarations }],
        },
        signal,
      );
      const content = j?.candidates?.[0]?.content;
      const parts: any[] = Array.isArray(content?.parts) ? content.parts : [];
      contents.push({ role: "model", parts }); // echoed whole, thought signatures included
      return {
        text: parts
          .filter((p) => typeof p.text === "string" && !p.thought)
          .map((p) => p.text)
          .join(""),
        calls: parts
          .filter((p) => p.functionCall)
          .map((p, i) => ({
            id: String(p.functionCall.id ?? `${p.functionCall.name}-${contents.length}-${i}`),
            name: String(p.functionCall.name),
            args: p.functionCall.args ?? {},
          })),
      };
    },
    addResults(results) {
      contents.push({
        role: "user",
        parts: results.map((r) => ({
          functionResponse: {
            name: r.call.name,
            ...(r.call.id && !/-\d+-\d+$/.test(r.call.id) ? { id: r.call.id } : {}),
            response: r.isError ? { error: r.output } : { result: r.output },
          },
        })),
      });
    },
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export function createConversation(o: ConversationOptions): Conversation {
  if (o.provider === "anthropic") return anthropic(o);
  if (o.provider === "gemini") return gemini(o);
  return openAiCompatible(o);
}
