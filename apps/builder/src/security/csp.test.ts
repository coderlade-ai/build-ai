import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { buildCsp, createNonce, providerOrigins } from "./csp";

const directive = (csp: string, name: string) =>
  csp
    .split("; ")
    .find((d) => d.startsWith(`${name} `))
    ?.split(" ")
    .slice(1) ?? [];

describe("builder CSP", () => {
  const csp = buildCsp("abc123");

  it("allows scripts only by nonce, with no unsafe-inline or eval in production", () => {
    expect(directive(csp, "script-src")).toEqual(["'nonce-abc123'", "'strict-dynamic'"]);
    expect(csp).not.toContain("unsafe-eval");
    expect(directive(csp, "object-src")).toEqual(["'none'"]);
    expect(directive(csp, "base-uri")).toEqual(["'none'"]);
    expect(directive(csp, "frame-ancestors")).toEqual(["'none'"]);
    expect(csp).toContain("upgrade-insecure-requests");
  });

  it("limits network access to this origin and the BYOK provider APIs", () => {
    expect(directive(csp, "connect-src")).toEqual(["'self'", ...providerOrigins]);
    expect(providerOrigins).toEqual([
      "https://api.anthropic.com",
      "https://api.openai.com",
      "https://generativelanguage.googleapis.com",
      "https://openrouter.ai",
    ]);
  });

  it("covers every provider URL the code calls", () => {
    const dirs = ["../providers", "../agent"].map((d) =>
      fileURLToPath(new URL(d, import.meta.url)),
    );
    const urls = dirs.flatMap((d) =>
      readdirSync(d)
        .filter((f) => f.endsWith(".ts") && !f.endsWith(".test.ts"))
        .flatMap((f) => readFileSync(join(d, f), "utf8").match(/https:\/\/[a-z0-9.-]+/g) ?? []),
    );
    const called = new Set(
      urls.filter(
        (u) => !/platform\.openai|console\.anthropic|aistudio\.google|openrouter\.ai\/keys/.test(u),
      ),
    );
    for (const u of called) expect(providerOrigins, u).toContain(new URL(u).origin);
  });

  it("only relaxes for the dev server", () => {
    const dev = buildCsp("n", true);
    expect(directive(dev, "script-src")).toContain("'unsafe-eval'");
    expect(dev).not.toContain("upgrade-insecure-requests");
  });

  it("makes a fresh 128-bit nonce each time", () => {
    const a = createNonce();
    expect(atob(a)).toHaveLength(16);
    expect(createNonce()).not.toBe(a);
  });
});

describe("preview framing", () => {
  it("frames nothing by default and only the preview origin when set", () => {
    expect(buildCsp("n")).toContain("frame-src 'none'");
    const csp = buildCsp("n", false, "https://preview.ladestack.in");
    expect(csp).toContain("frame-src https://preview.ladestack.in;");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).not.toMatch(/connect-src[^;]*preview/);
  });
});
