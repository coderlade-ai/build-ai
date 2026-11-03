import { describe, expect, it } from "vitest";
import { checkAttachments, inputSupport } from "./capability";
import { parseModels } from "./connect";
import { parseSession } from "./session";

describe("inputSupport", () => {
  it("prefers what the provider reported", () => {
    const s = {
      provider: "openrouter" as const,
      model: "x/y",
      inputs: { images: true, pdf: false },
    };
    expect(inputSupport(s, "image")).toBe("yes");
    expect(inputSupport(s, "pdf")).toBe("no");
  });

  it("knows documented families", () => {
    expect(inputSupport({ provider: "openai", model: "gpt-3.5-turbo" }, "image")).toBe("no");
    expect(inputSupport({ provider: "anthropic", model: "claude-3-haiku-20240307" }, "pdf")).toBe(
      "no",
    );
    expect(inputSupport({ provider: "anthropic", model: "claude-3-haiku-20240307" }, "image")).toBe(
      "yes",
    );
    expect(inputSupport({ provider: "anthropic", model: "claude-sonnet-4-20250514" }, "pdf")).toBe(
      "yes",
    );
    expect(inputSupport({ provider: "gemini", model: "gemini-2.5-flash" }, "pdf")).toBe("yes");
  });

  it("says unknown instead of guessing", () => {
    expect(inputSupport({ provider: "openai", model: "gpt-4o" }, "image")).toBe("unknown");
    expect(inputSupport({ provider: "gemini", model: "gemma-3-27b-it" }, "image")).toBe("unknown");
  });
});

describe("checkAttachments", () => {
  it("blocks known mismatches and flags unknowns, per kind", () => {
    const r = checkAttachments({ provider: "openai", model: "o3-mini" }, [
      { kind: "image" },
      { kind: "text" },
    ]);
    expect(r).toEqual({ blocked: ["image"], unsure: [] });
    const u = checkAttachments({ provider: "openai", model: "gpt-4.1" }, [{ kind: "pdf" }]);
    expect(u).toEqual({ blocked: [], unsure: ["pdf"] });
  });

  it("ignores text-only requests and missing sessions", () => {
    expect(checkAttachments({ provider: "openai", model: "o3-mini" }, [{ kind: "text" }])).toEqual({
      blocked: [],
      unsure: [],
    });
    expect(checkAttachments(null, [{ kind: "image" }])).toEqual({ blocked: [], unsure: [] });
  });
});

describe("reported inputs", () => {
  it("reads OpenRouter input modalities", () => {
    const [m] = parseModels("openrouter", {
      data: [{ id: "a/b", name: "B", architecture: { input_modalities: ["text", "image"] } }],
    });
    expect(m!.inputs).toEqual({ images: true, pdf: false });
    const [n] = parseModels("openrouter", { data: [{ id: "a/c", name: "C" }] });
    expect(n!.inputs).toBeUndefined();
  });

  it("keeps valid inputs in the session and drops malformed ones", () => {
    const base = { provider: "openrouter", key: "k", model: "a/b" };
    expect(
      parseSession(JSON.stringify({ ...base, inputs: { images: true, pdf: false } }))?.inputs,
    ).toEqual({ images: true, pdf: false });
    expect(
      parseSession(JSON.stringify({ ...base, inputs: { images: "yes" } }))?.inputs,
    ).toBeUndefined();
  });
});
