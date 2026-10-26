import { IDBFactory } from "fake-indexeddb";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { openProjectDb, ProjectStore } from "../storage/projectStore";
import { createConversation, type Conversation, type StepResult } from "./adapters";
import { runAgent } from "./loop";
import { agentTools, maxWriteBytes, runTool, type ToolCall } from "./tools";

let store: ProjectStore;
let projectId: string;
const key = "sk-test-0123456789abcdefghijklmnop";
const call = (name: string, args: unknown, id = "c1"): ToolCall => ({ id, name, args });

beforeEach(async () => {
  store = new ProjectStore(await openProjectDb(new IDBFactory()));
  const p = await store.createProject({
    name: "T",
    profile: "static",
    files: { "index.html": "<h1>Hi</h1>" },
  });
  projectId = p.id;
});

describe("agent tools", () => {
  it("lists, reads, creates and updates files", async () => {
    expect((await runTool(store, projectId, call("list_files", {}))).output).toContain(
      "index.html",
    );
    expect(
      (await runTool(store, projectId, call("read_file", { path: "index.html" }))).output,
    ).toBe("<h1>Hi</h1>");
    expect(
      (await runTool(store, projectId, call("write_file", { path: "src/a.js", content: "1" })))
        .output,
    ).toBe("Created src/a.js");
    expect(
      (await runTool(store, projectId, call("write_file", { path: "src/a.js", content: "2" })))
        .output,
    ).toBe("Updated src/a.js");
    expect((await store.readFile(projectId, "src/a.js"))?.content).toBe("2");
  });

  it("refuses unsafe paths, secrets, binaries, oversize and malformed args", async () => {
    for (const path of [
      "../x",
      "/etc/passwd",
      ".env",
      "a/.env.local",
      "node_modules/x.js",
      ".git/config",
      "a\\b",
    ]) {
      const r = await runTool(store, projectId, call("write_file", { path, content: "x" }));
      expect(r.isError, path).toBe(true);
    }
    expect(
      (await runTool(store, projectId, call("write_file", { path: "b.txt", content: "a\0b" })))
        .isError,
    ).toBe(true);
    expect(
      (
        await runTool(
          store,
          projectId,
          call("write_file", { path: "b.txt", content: "x".repeat(maxWriteBytes + 1) }),
        )
      ).isError,
    ).toBe(true);
    expect((await runTool(store, projectId, call("write_file", { path: "b.txt" }))).isError).toBe(
      true,
    );
    expect((await runTool(store, projectId, call("write_file", "nope"))).isError).toBe(true);
    expect(
      (await runTool(store, projectId, call("delete_file", { path: "index.html" }))).isError,
    ).toBe(true);
    expect((await store.listFiles(projectId)).map((f) => f.path)).toEqual(["index.html"]);
  });
});

function scripted(steps: StepResult[]): Conversation & { results: unknown[] } {
  const results: unknown[] = [];
  return {
    results,
    step: async () => steps.shift() ?? { text: "", calls: [] },
    addResults: (r) => results.push(r),
  };
}

describe("agent loop", () => {
  it("runs tools until the model stops calling them", async () => {
    const conv = scripted([
      { text: "", calls: [call("write_file", { path: "style.css", content: "body{}" })] },
      { text: "Added style.css", calls: [] },
    ]);
    const events: string[] = [];
    const out = await runAgent({
      conversation: conv,
      fs: store,
      projectId,
      onEvent: (e) => events.push(e.type),
    });
    expect(out).toEqual({ reason: "done" });
    expect(events).toEqual(["tool", "text"]);
    expect((await store.readFile(projectId, "style.css"))?.content).toBe("body{}");
  });

  it("stops at the step budget and when aborted", async () => {
    const forever: Conversation = {
      step: async () => ({ text: "", calls: [call("list_files", {})] }),
      addResults: () => {},
    };
    expect(
      await runAgent({
        conversation: forever,
        fs: store,
        projectId,
        maxSteps: 3,
        onEvent: () => {},
      }),
    ).toEqual({
      reason: "max-steps",
      steps: 3,
    });
    const c = new AbortController();
    c.abort();
    expect(
      await runAgent({
        conversation: forever,
        fs: store,
        projectId,
        signal: c.signal,
        onEvent: () => {},
      }),
    ).toEqual({
      reason: "stopped",
    });
  });
});

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });

describe("provider tool-calling adapters", () => {
  const base = { key, model: "m", system: "sys", prompt: "make a page", tools: agentTools };

  it("OpenAI: parses tool calls and sends results with the call id", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(
        json({
          choices: [
            {
              message: {
                content: null,
                tool_calls: [
                  {
                    id: "t1",
                    type: "function",
                    function: { name: "read_file", arguments: '{"path":"a"}' },
                  },
                ],
              },
            },
          ],
        }),
      )
      .mockResolvedValueOnce(json({ choices: [{ message: { content: "ok" } }] }));
    const conv = createConversation({ ...base, provider: "openai", fetchImpl });
    const s1 = await conv.step();
    expect(s1.calls).toEqual([{ id: "t1", name: "read_file", args: { path: "a" } }]);
    conv.addResults([{ call: s1.calls[0]!, output: "x", isError: false }]);
    await conv.step();
    const [url, init] = fetchImpl.mock.calls[1] as [string, RequestInit];
    expect(url).not.toContain(key);
    const body = JSON.parse(String(init.body));
    expect(body.messages.at(-1)).toEqual({ role: "tool", tool_call_id: "t1", content: "x" });
    expect(body.tools[0].function.parameters).toEqual({
      type: "object",
      properties: {},
      required: [],
    });
    expect(String(init.body)).not.toContain(key);
  });

  it("Anthropic: tool_use blocks and tool_result replies", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(
        json({
          content: [
            { type: "text", text: "Let me look" },
            { type: "tool_use", id: "u1", name: "list_files", input: {} },
          ],
        }),
      )
      .mockResolvedValueOnce(json({ content: [{ type: "text", text: "done" }] }));
    const conv = createConversation({ ...base, provider: "anthropic", fetchImpl });
    const s1 = await conv.step();
    expect(s1).toEqual({
      text: "Let me look",
      calls: [{ id: "u1", name: "list_files", args: {} }],
    });
    conv.addResults([{ call: s1.calls[0]!, output: "a.html", isError: false }]);
    await conv.step();
    const body = JSON.parse(String((fetchImpl.mock.calls[1] as [string, RequestInit])[1].body));
    expect(body.messages.at(-1).content[0]).toEqual({
      type: "tool_result",
      tool_use_id: "u1",
      content: "a.html",
      is_error: false,
    });
    expect(body.tools[0].input_schema.type).toBe("object");
  });

  it("Gemini: echoes model parts and answers with functionResponse", async () => {
    const parts = [
      {
        functionCall: { name: "write_file", args: { path: "a", content: "b" } },
        thoughtSignature: "sig",
      },
    ];
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(json({ candidates: [{ content: { role: "model", parts } }] }))
      .mockResolvedValueOnce(
        json({ candidates: [{ content: { role: "model", parts: [{ text: "ok" }] } }] }),
      );
    const conv = createConversation({ ...base, provider: "gemini", fetchImpl });
    const s1 = await conv.step();
    expect(s1.calls[0]).toMatchObject({ name: "write_file", args: { path: "a", content: "b" } });
    conv.addResults([{ call: s1.calls[0]!, output: "Created a", isError: false }]);
    await conv.step();
    const body = JSON.parse(String((fetchImpl.mock.calls[1] as [string, RequestInit])[1].body));
    expect(body.contents[1]).toEqual({ role: "model", parts });
    expect(body.contents[2].parts[0].functionResponse).toEqual({
      name: "write_file",
      response: { result: "Created a" },
    });
    expect(body.tools[0].functionDeclarations[0]).not.toHaveProperty("parameters");
  });

  it("maps a rejected request (e.g. no tool support) to its own code", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(new Response("No endpoints found that support tool use", { status: 404 }));
    const conv = createConversation({ ...base, provider: "openrouter", fetchImpl });
    await expect(conv.step()).rejects.toMatchObject({ code: "rejected" });
    const bad = vi
      .fn()
      .mockResolvedValue(
        new Response('{"error":{"details":[{"reason":"API_KEY_INVALID"}]}}', { status: 400 }),
      );
    await expect(
      createConversation({ ...base, provider: "gemini", fetchImpl: bad }).step(),
    ).rejects.toMatchObject({ code: "invalid-key" });
  });
});
