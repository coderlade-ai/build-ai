import { authHeaders, classifyStatus } from "../providers/connect";
import type { ProviderId } from "../providers/registry";
import { ProviderStreamError } from "../providers/stream";
import { readSse } from "../providers/sse";
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
/** Live progress inside one streamed turn: text so far, or a tool call's raw JSON arguments so far. */
export type StepDelta =
  | { type: "text"; text: string }
  | { type: "tool"; index: number; name: string; args: string };

export interface Conversation {
  /**
   * One model turn. With `onDelta` the request is streamed and progress is reported as it
   * arrives; the result is the same either way.
   */
  step(signal?: AbortSignal, onDelta?: (d: StepDelta) => void): Promise<StepResult>;
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

/** Streams a request; yields each SSE payload. Errors map exactly like postJson. */
async function* postSse(
  o: ConversationOptions,
  url: string,
  body: unknown,
  signal?: AbortSignal,
): AsyncGenerator<any> {
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
  if (!res.ok) {
    if (res.status === 400 || res.status === 404 || res.status === 422) {
      const text = await res.text().catch(() => "");
      throw new ProviderStreamError(/API_KEY_INVALID/.test(text) ? "invalid-key" : "rejected");
    }
    throw new ProviderStreamError(classifyStatus(res.status));
  }
  if (!res.body) throw new ProviderStreamError("unexpected");
  try {
    for await (const payload of readSse(res.body)) {
      if (payload === "[DONE]") {
        yield { __done: true };
        continue;
      }
      let j: any;
      try {
        j = JSON.parse(payload);
      } catch {
        continue;
      }
      if (j?.error || j?.type === "error") {
        const status = Number(j.error?.code ?? j.error?.status);
        throw new ProviderStreamError(
          j.error?.type === "overloaded_error"
            ? "unavailable"
            : Number.isFinite(status)
              ? classifyStatus(status)
              : "unexpected",
        );
      }
      yield j;
    }
  } catch (e) {
    if (e instanceof ProviderStreamError) throw e;
    throw new ProviderStreamError(signal?.aborted ? "aborted" : "interrupted");
  }
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
    async step(signal, onDelta) {
      if (onDelta) {
        let text = "";
        let finished = false;
        const calls: { id: string; name: string; args: string }[] = [];
        for await (const j of postSse(
          o,
          url,
          { model: o.model, messages, tools, stream: true },
          signal,
        )) {
          if (j.__done) {
            finished = true;
            continue;
          }
          const c = j?.choices?.[0];
          if (c?.finish_reason) finished = true;
          const d = c?.delta ?? {};
          if (typeof d.content === "string" && d.content) {
            text += d.content;
            onDelta({ type: "text", text });
          }
          for (const t of Array.isArray(d.tool_calls) ? d.tool_calls : []) {
            const i = Number.isInteger(t.index) ? t.index : calls.length;
            const call = (calls[i] ??= { id: "", name: "", args: "" });
            if (t.id) call.id = String(t.id);
            if (t.function?.name) call.name += String(t.function.name);
            if (typeof t.function?.arguments === "string") call.args += t.function.arguments;
            onDelta({ type: "tool", index: i, name: call.name, args: call.args });
          }
        }
        if (!finished) throw new ProviderStreamError(signal?.aborted ? "aborted" : "interrupted");
        const done = calls.filter(Boolean);
        messages.push({
          role: "assistant",
          content: text || null,
          ...(done.length
            ? {
                tool_calls: done.map((c) => ({
                  id: c.id,
                  type: "function",
                  function: { name: c.name, arguments: c.args },
                })),
              }
            : {}),
        });
        return {
          text,
          calls: done.map((c) => ({ id: c.id, name: c.name, args: parseArgs(c.args) })),
        };
      }
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
    async step(signal, onDelta) {
      if (onDelta) {
        const blocks: any[] = [];
        const json: string[] = [];
        let finished = false;
        let text = "";
        for await (const j of postSse(
          o,
          "https://api.anthropic.com/v1/messages",
          { model: o.model, max_tokens: 16384, system: o.system, messages, tools, stream: true },
          signal,
        )) {
          const i = Number(j.index);
          if (j.type === "content_block_start") {
            blocks[i] = { ...j.content_block };
            if (blocks[i].type === "tool_use") {
              blocks[i].input = {};
              json[i] = "";
            }
          } else if (j.type === "content_block_delta" && blocks[i]) {
            const d = j.delta ?? {};
            if (d.type === "text_delta") {
              blocks[i].text = String(blocks[i].text ?? "") + String(d.text ?? "");
              text += String(d.text ?? "");
              onDelta({ type: "text", text });
            } else if (d.type === "input_json_delta") {
              json[i] = (json[i] ?? "") + String(d.partial_json ?? "");
              onDelta({ type: "tool", index: i, name: String(blocks[i].name), args: json[i]! });
            } else if (d.type === "thinking_delta") {
              blocks[i].thinking = String(blocks[i].thinking ?? "") + String(d.thinking ?? "");
            } else if (d.type === "signature_delta") {
              blocks[i].signature = String(d.signature ?? "");
            }
          } else if (j.type === "content_block_stop" && blocks[i]?.type === "tool_use") {
            blocks[i].input = json[i] ? parseArgs(json[i]) : {};
          } else if (j.type === "message_stop") {
            finished = true;
          }
        }
        if (!finished) throw new ProviderStreamError(signal?.aborted ? "aborted" : "interrupted");
        const content = blocks.filter(Boolean);
        messages.push({ role: "assistant", content });
        return {
          text,
          calls: content
            .filter((b) => b.type === "tool_use")
            .map((b) => ({ id: String(b.id), name: String(b.name), args: b.input ?? {} })),
        };
      }
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
    async step(signal, onDelta) {
      const body = {
        systemInstruction: { parts: [{ text: o.system }] },
        contents,
        tools: [{ functionDeclarations }],
      };
      if (onDelta) {
        const parts: any[] = [];
        let finished = false;
        let text = "";
        for await (const j of postSse(
          o,
          url.replace(":generateContent", ":streamGenerateContent") + "?alt=sse",
          body,
          signal,
        )) {
          const c = j?.candidates?.[0];
          if (c?.finishReason) finished = true;
          for (const p of Array.isArray(c?.content?.parts) ? c.content.parts : []) {
            parts.push(p); // kept whole: thought signatures must be echoed back
            if (typeof p.text === "string" && !p.thought) {
              text += p.text;
              onDelta({ type: "text", text });
            }
            if (p.functionCall)
              onDelta({
                type: "tool",
                index: parts.length - 1,
                name: String(p.functionCall.name),
                args: JSON.stringify(p.functionCall.args ?? {}),
              });
          }
        }
        if (!finished) throw new ProviderStreamError(signal?.aborted ? "aborted" : "interrupted");
        contents.push({ role: "model", parts });
        return {
          text,
          calls: parts
            .filter((p) => p.functionCall)
            .map((p, i) => ({
              id: String(p.functionCall.id ?? `${p.functionCall.name}-${contents.length}-${i}`),
              name: String(p.functionCall.name),
              args: p.functionCall.args ?? {},
            })),
        };
      }
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
