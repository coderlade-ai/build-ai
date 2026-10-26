import { beforeEach, describe, expect, it, vi } from "vitest";
import { authHeaders, classifyStatus, parseModels, testConnection } from "./connect";
import { looksLikeKey, providerIds, providers } from "./registry";
import { getSession, parseSession, resetSessionCache, setSession, subscribe } from "./session";

class MemoryStorage {
  private m = new Map<string, string>();
  get length() {
    return this.m.size;
  }
  clear() {
    this.m.clear();
  }
  getItem(k: string) {
    return this.m.get(k) ?? null;
  }
  setItem(k: string, v: string) {
    this.m.set(k, v);
  }
  removeItem(k: string) {
    this.m.delete(k);
  }
}
const sessionStorage = new MemoryStorage();
const localStorage = new MemoryStorage();
vi.stubGlobal("window", { sessionStorage, localStorage });

const key = "sk-test-0123456789abcdefghijklmnop";
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

describe("provider registry", () => {
  it("lists the four initial providers with https key pages", () => {
    expect(providerIds).toEqual(["openai", "anthropic", "gemini", "openrouter"]);
    for (const id of providerIds) expect(providers[id].keyUrl.startsWith("https://")).toBe(true);
  });

  it("rejects obviously wrong keys before any request", () => {
    expect(looksLikeKey(key)).toBe(true);
    expect(looksLikeKey("short")).toBe(false);
    expect(looksLikeKey("sk-has a space-0123456789abcdef")).toBe(false);
  });
});

describe("connection test", () => {
  it("puts the key only in headers, never in the URL", async () => {
    for (const id of providerIds) {
      const fetchImpl = vi.fn(async () =>
        json(
          id === "gemini"
            ? { models: [{ name: "models/g", supportedGenerationMethods: ["generateContent"] }] }
            : { data: [{ id: "m-1" }] },
        ),
      );
      await testConnection(id, key, { fetchImpl });
      for (const [url, init] of fetchImpl.mock.calls as unknown as [string, RequestInit][]) {
        expect(url).not.toContain(key);
        expect(init.credentials).toBe("omit");
        expect(init.redirect).toBe("error");
        expect(JSON.stringify(init.headers)).toContain(key);
      }
    }
    expect(authHeaders("anthropic", key)["anthropic-dangerous-direct-browser-access"]).toBe("true");
  });

  it("checks the OpenRouter key before the public model list", async () => {
    const fetchImpl = vi.fn(async () => json({}, 401));
    expect(await testConnection("openrouter", key, { fetchImpl })).toEqual({
      ok: false,
      error: "invalid-key",
    });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect((fetchImpl.mock.calls[0] as unknown as [string])[0]).toBe(
      "https://openrouter.ai/api/v1/key",
    );
  });

  it("classifies failures without exposing provider bodies", async () => {
    expect(classifyStatus(401)).toBe("invalid-key");
    expect(classifyStatus(402)).toBe("billing");
    expect(classifyStatus(429)).toBe("rate-limit");
    expect(classifyStatus(503)).toBe("unavailable");
    const network = vi.fn(async () => {
      throw new TypeError("Failed to fetch");
    });
    expect(await testConnection("openai", key, { fetchImpl: network })).toEqual({
      ok: false,
      error: "network",
    });
    const empty = vi.fn(async () => json({ data: [] }));
    expect(await testConnection("openai", key, { fetchImpl: empty })).toEqual({
      ok: false,
      error: "no-models",
    });
  });

  it("parses each provider's model list", () => {
    expect(
      parseModels("openai", {
        data: [{ id: "gpt-x" }, { id: "text-embedding-3" }, { id: "whisper-1" }],
      }),
    ).toEqual([{ id: "gpt-x", label: "gpt-x" }]);
    expect(
      parseModels("anthropic", { data: [{ id: "claude-x", display_name: "Claude X" }] }),
    ).toEqual([{ id: "claude-x", label: "Claude X", tools: true }]);
    expect(
      parseModels("gemini", {
        models: [
          {
            name: "models/gem-x",
            displayName: "Gem X",
            supportedGenerationMethods: ["generateContent"],
          },
          { name: "models/embed", supportedGenerationMethods: ["embedContent"] },
        ],
      }),
    ).toEqual([{ id: "gem-x", label: "Gem X" }]);
    expect(
      parseModels("openrouter", {
        data: [
          { id: "a/one", name: "One", supported_parameters: ["tools"] },
          { id: "b/two", name: "Two", supported_parameters: ["temperature"] },
        ],
      }),
    ).toEqual([
      { id: "a/one", label: "One", tools: true },
      { id: "b/two", label: "Two", tools: false },
    ]);
    expect(parseModels("openai", null)).toEqual([]);
  });
});

describe("provider session", () => {
  beforeEach(() => {
    sessionStorage.clear();
    resetSessionCache();
  });

  it("round-trips through sessionStorage and notifies listeners", () => {
    const seen = vi.fn();
    const off = subscribe(seen);
    setSession({ provider: "openai", key, model: "gpt-x" });
    resetSessionCache();
    expect(getSession()).toEqual({ provider: "openai", key, model: "gpt-x" });
    setSession(null);
    expect(getSession()).toBeNull();
    expect(sessionStorage.length).toBe(0);
    expect(seen).toHaveBeenCalledTimes(2);
    off();
  });

  it("never touches localStorage", () => {
    setSession({ provider: "gemini", key, model: "g" });
    expect(localStorage.length).toBe(0);
  });

  it("ignores malformed stored values", () => {
    expect(parseSession("{bad")).toBeNull();
    expect(parseSession(JSON.stringify({ provider: "evil", key, model: "m" }))).toBeNull();
    expect(parseSession(JSON.stringify({ provider: "openai", key: "", model: "m" }))).toBeNull();
  });
});
