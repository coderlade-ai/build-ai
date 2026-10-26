import { describe, expect, it, vi } from "vitest";
import { readSse } from "./sse";
import {
  buildRequest,
  ProviderStreamError,
  readChunk,
  streamChat,
  type StreamOptions,
} from "./stream";

const key = "sk-test-0123456789abcdefghijklmnop";
const sse = (chunks: string[]) =>
  new ReadableStream<Uint8Array>({
    start(c) {
      const enc = new TextEncoder();
      chunks.forEach((x) => c.enqueue(enc.encode(x)));
      c.close();
    },
  });
const base: StreamOptions = {
  provider: "openai",
  key,
  model: "m",
  system: "sys",
  messages: [{ role: "user", content: "hi" }],
};

async function collect(it: AsyncGenerator<string>) {
  let out = "";
  for await (const t of it) out += t;
  return out;
}

describe("SSE reader", () => {
  it("joins data lines, handles CRLF, split chunks and comments", async () => {
    const got: string[] = [];
    for await (const d of readSse(
      sse([': ping\r\n\r\ndata: {"a"', ":1}\r\n\r\ndata: x\ndata: y\n\n", "data: tail"]),
    ))
      got.push(d);
    expect(got).toEqual(['{"a":1}', "x\ny", "tail"]);
  });
});

describe("provider requests", () => {
  it("never puts the key in the URL or body", () => {
    for (const provider of ["openai", "anthropic", "gemini", "openrouter"] as const) {
      const r = buildRequest({ ...base, provider });
      expect(r.url).not.toContain(key);
      expect(JSON.stringify(r.body)).not.toContain(key);
    }
  });

  it("maps roles and system prompt per provider", () => {
    const g = buildRequest({
      ...base,
      provider: "gemini",
      messages: [{ role: "assistant", content: "a" }],
    }).body as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    expect(g.contents[0].role).toBe("model");
    expect(g.systemInstruction.parts[0].text).toBe("sys");
    const a = buildRequest({ ...base, provider: "anthropic" }).body as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    expect(a.system).toBe("sys");
    expect(a.max_tokens).toBe(4096);
    const o = buildRequest(base).body as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    expect(o.messages[0]).toEqual({ role: "system", content: "sys" });
  });

  it("reads deltas and finish markers", () => {
    expect(readChunk("openai", '{"choices":[{"delta":{"content":"Hi"}}]}')).toEqual({
      text: "Hi",
      done: false,
    });
    expect(readChunk("openai", "[DONE]").done).toBe(true);
    expect(
      readChunk(
        "anthropic",
        '{"type":"content_block_delta","delta":{"type":"text_delta","text":"Yo"}}',
      ).text,
    ).toBe("Yo");
    expect(readChunk("anthropic", '{"type":"message_stop"}').done).toBe(true);
    expect(
      readChunk(
        "gemini",
        '{"candidates":[{"content":{"parts":[{"text":"think","thought":true},{"text":"ok"}]},"finishReason":"STOP"}]}',
      ),
    ).toEqual({ text: "ok", done: true });
    expect(() => readChunk("openrouter", '{"error":{"code":429,"message":"x"}}')).toThrow(
      ProviderStreamError,
    );
  });
});

describe("streamChat", () => {
  it("streams text and finishes cleanly", async () => {
    const fetchImpl = vi.fn(
      async () =>
        new Response(
          sse([
            'data: {"choices":[{"delta":{"content":"Hel"}}]}\n\n',
            'data: {"choices":[{"delta":{"content":"lo"}}]}\n\ndata: [DONE]\n\n',
          ]),
        ),
    );
    expect(await collect(streamChat({ ...base, fetchImpl }))).toBe("Hello");
    const init = (fetchImpl.mock.calls[0] as unknown as [string, RequestInit])[1];
    expect(init.credentials).toBe("omit");
  });

  it("reports a stream that stops without finishing as interrupted, keeping text", async () => {
    const fetchImpl = vi.fn(
      async () => new Response(sse(['data: {"choices":[{"delta":{"content":"part"}}]}\n\n'])),
    );
    let text = "";
    await expect(async () => {
      for await (const t of streamChat({ ...base, fetchImpl })) text += t;
    }).rejects.toMatchObject({ code: "interrupted" });
    expect(text).toBe("part");
  });

  it("classifies HTTP and network failures", async () => {
    const r401 = vi.fn(async () => new Response("{}", { status: 401 }));
    await expect(collect(streamChat({ ...base, fetchImpl: r401 }))).rejects.toMatchObject({
      code: "invalid-key",
    });
    const net = vi.fn(async () => {
      throw new TypeError("Failed to fetch");
    });
    await expect(collect(streamChat({ ...base, fetchImpl: net }))).rejects.toMatchObject({
      code: "network",
    });
  });
});
