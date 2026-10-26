import { describe, expect, it, vi } from "vitest";
import { createConversation, type StepDelta } from "./adapters";
import { agentTools } from "./tools";
import { ProviderStreamError } from "../providers/stream";

const key = "sk-test-secret-123456";
const base = { key, model: "m", system: "sys", prompt: "make a page", tools: agentTools };

/** A streamed response whose SSE events arrive split at awkward byte boundaries. */
function sse(events: unknown[], { done = false } = {}) {
  const text =
    events.map((e) => `data: ${typeof e === "string" ? e : JSON.stringify(e)}\n\n`).join("") +
    (done ? "data: [DONE]\n\n" : "");
  const bytes = new TextEncoder().encode(text);
  return new Response(
    new ReadableStream({
      start(c) {
        for (let i = 0; i < bytes.length; i += 7) c.enqueue(bytes.slice(i, i + 7));
        c.close();
      },
    }),
    { status: 200, headers: { "content-type": "text/event-stream" } },
  );
}

describe("streamed agent turns", () => {
  it("OpenAI: assembles tool-call argument fragments and reports progress", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      sse(
        [
          { choices: [{ delta: { content: "Writing" } }] },
          {
            choices: [
              {
                delta: {
                  tool_calls: [
                    {
                      index: 0,
                      id: "t1",
                      function: { name: "write_file", arguments: '{"path":"a.html",' },
                    },
                  ],
                },
              },
            ],
          },
          {
            choices: [
              { delta: { tool_calls: [{ index: 0, function: { arguments: '"content":"<h1>' } }] } },
            ],
          },
          {
            choices: [
              { delta: { tool_calls: [{ index: 0, function: { arguments: 'Hi</h1>"}' } }] } },
            ],
          },
          { choices: [{ delta: {}, finish_reason: "tool_calls" }] },
        ],
        { done: true },
      ),
    );
    const conv = createConversation({ ...base, provider: "openai", fetchImpl });
    const deltas: StepDelta[] = [];
    const r = await conv.step(undefined, (d) => deltas.push(d));
    expect(r).toEqual({
      text: "Writing",
      calls: [{ id: "t1", name: "write_file", args: { path: "a.html", content: "<h1>Hi</h1>" } }],
    });
    expect(
      deltas.filter((d) => d.type === "tool").map((d) => (d as { args: string }).args),
    ).toEqual([
      '{"path":"a.html",',
      '{"path":"a.html","content":"<h1>',
      '{"path":"a.html","content":"<h1>Hi</h1>"}',
    ]);
    const body = JSON.parse(String((fetchImpl.mock.calls[0] as [string, RequestInit])[1].body));
    expect(body.stream).toBe(true);
    // The assistant turn is echoed back in OpenAI's own shape on the next request.
    conv.addResults([{ call: r.calls[0]!, output: "Wrote a.html", isError: false }]);
    fetchImpl.mockResolvedValueOnce(
      sse([{ choices: [{ delta: { content: "ok" }, finish_reason: "stop" }] }]),
    );
    await conv.step(undefined, () => {});
    const next = JSON.parse(String((fetchImpl.mock.calls[1] as [string, RequestInit])[1].body));
    expect(next.messages.at(-2).tool_calls[0]).toEqual({
      id: "t1",
      type: "function",
      function: { name: "write_file", arguments: '{"path":"a.html","content":"<h1>Hi</h1>"}' },
    });
  });

  it("Anthropic: text and input_json_delta blocks", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      sse([
        { type: "message_start", message: {} },
        { type: "content_block_start", index: 0, content_block: { type: "text", text: "" } },
        { type: "content_block_delta", index: 0, delta: { type: "text_delta", text: "On it" } },
        { type: "content_block_stop", index: 0 },
        {
          type: "content_block_start",
          index: 1,
          content_block: { type: "tool_use", id: "u1", name: "write_file", input: {} },
        },
        {
          type: "content_block_delta",
          index: 1,
          delta: { type: "input_json_delta", partial_json: '{"path":"b.css","con' },
        },
        {
          type: "content_block_delta",
          index: 1,
          delta: { type: "input_json_delta", partial_json: 'tent":"body{}"}' },
        },
        { type: "content_block_stop", index: 1 },
        { type: "message_delta", delta: { stop_reason: "tool_use" } },
        { type: "message_stop" },
      ]),
    );
    const conv = createConversation({ ...base, provider: "anthropic", fetchImpl });
    const deltas: StepDelta[] = [];
    const r = await conv.step(undefined, (d) => deltas.push(d));
    expect(r).toEqual({
      text: "On it",
      calls: [{ id: "u1", name: "write_file", args: { path: "b.css", content: "body{}" } }],
    });
    expect(deltas.some((d) => d.type === "tool" && d.args === '{"path":"b.css","con')).toBe(true);
  });

  it("Gemini: streamGenerateContent with whole functionCall parts", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      sse([
        { candidates: [{ content: { parts: [{ text: "Sure" }] } }] },
        {
          candidates: [
            {
              content: {
                parts: [
                  {
                    functionCall: { name: "read_file", args: { path: "c.js" } },
                    thoughtSignature: "sig",
                  },
                ],
              },
              finishReason: "STOP",
            },
          ],
        },
      ]),
    );
    const conv = createConversation({ ...base, provider: "gemini", fetchImpl });
    const r = await conv.step(undefined, () => {});
    expect(r.text).toBe("Sure");
    expect(r.calls[0]).toMatchObject({ name: "read_file", args: { path: "c.js" } });
    const [url] = fetchImpl.mock.calls[0] as [string];
    expect(url).toContain(":streamGenerateContent?alt=sse");
    expect(url).not.toContain(key);
  });

  it("a stream that stops before finishing is interrupted, and HTTP errors map to codes", async () => {
    const cut = createConversation({
      ...base,
      provider: "openai",
      fetchImpl: vi.fn().mockResolvedValue(sse([{ choices: [{ delta: { content: "par" } }] }])),
    });
    await expect(cut.step(undefined, () => {})).rejects.toEqual(
      new ProviderStreamError("interrupted"),
    );
    const denied = createConversation({
      ...base,
      provider: "anthropic",
      fetchImpl: vi.fn().mockResolvedValue(new Response("{}", { status: 401 })),
    });
    await expect(denied.step(undefined, () => {})).rejects.toMatchObject({ code: "invalid-key" });
    const midError = createConversation({
      ...base,
      provider: "anthropic",
      fetchImpl: vi
        .fn()
        .mockResolvedValue(sse([{ type: "error", error: { type: "overloaded_error" } }])),
    });
    await expect(midError.step(undefined, () => {})).rejects.toMatchObject({ code: "unavailable" });
  });
});
