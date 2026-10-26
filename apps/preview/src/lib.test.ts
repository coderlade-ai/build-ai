import { describe, expect, it } from "vitest";
import {
  cacheName,
  contentTypeFor,
  fileHeaders,
  injectBridge,
  parseLogMessage,
  shortWhere,
  isSafePreviewPath,
  limits,
  messageTypes,
  parseFilesMessage,
  previewTarget,
} from "./lib.js";
import { hostHeaders, parseParents } from "../scripts/headers.mjs";
import { newPreviewSession, previewMessages } from "../../builder/src/preview/files";
import { isValidSession } from "./lib.js";

const session = "abcdefghijklmnop1234";

describe("preview protocol", () => {
  it("accepts a well-formed files message", () => {
    expect(
      parseFilesMessage({
        type: messageTypes.files,
        session,
        files: { "index.html": "<h1>x</h1>" },
      }),
    ).toEqual({ session, files: { "index.html": "<h1>x</h1>" } });
  });

  it("rejects bad sessions, paths, content and oversized payloads", () => {
    const ok = { type: messageTypes.files, session, files: {} };
    expect(parseFilesMessage(null)).toBeNull();
    expect(parseFilesMessage({ ...ok, type: "other" })).toBeNull();
    expect(parseFilesMessage({ ...ok, session: "short" })).toBeNull();
    expect(parseFilesMessage({ ...ok, session: "../../aaaaaaaaaaaaaaaa" })).toBeNull();
    for (const bad of ["../x", "/abs", "a\\b", "a//b", "./a", ""])
      expect(parseFilesMessage({ ...ok, files: { [bad]: "x" } })).toBeNull();
    expect(parseFilesMessage({ ...ok, files: { "a.txt": 1 } })).toBeNull();
    expect(parseFilesMessage({ ...ok, files: ["x"] })).toBeNull();
    const big = "x".repeat(limits.totalBytes / 2 + 1);
    expect(parseFilesMessage({ ...ok, files: { "a.txt": big, "b.txt": big } })).toBeNull();
  });

  it("maps preview URLs to files", () => {
    expect(previewTarget(`/p/${session}/`)).toEqual({ session, file: "index.html" });
    expect(previewTarget(`/p/${session}/docs/`)).toEqual({ session, file: "docs/index.html" });
    expect(previewTarget(`/p/${session}/src/a%20b.js`)).toEqual({ session, file: "src/a b.js" });
    expect(previewTarget(`/p/${session}/../x`)).toBeNull();
    expect(previewTarget(`/p/${session}/%2e%2e/x`)).toBeNull();
    expect(previewTarget(`/p/${session}/%E0%A4%A`)).toBeNull();
    expect(previewTarget("/sw.js")).toBeNull();
    expect(isSafePreviewPath("a/b.css")).toBe(true);
    expect(cacheName(session)).toBe(`ladestack-preview-${session}`);
  });

  it("lets only the host and the builder frame project pages", () => {
    expect(fileHeaders("a.html", ["https://build.ladestack.in"])["content-security-policy"]).toBe(
      "frame-ancestors 'self' https://build.ladestack.in",
    );
    expect(fileHeaders("a.html", [])["content-security-policy"]).toBe("frame-ancestors 'self'");
  });

  it("serves sensible content types", () => {
    expect(contentTypeFor("a/INDEX.HTML")).toMatch(/^text\/html/);
    expect(contentTypeFor("x.mjs")).toMatch(/^text\/javascript/);
    expect(contentTypeFor("noext")).toMatch(/^text\/plain/);
  });

  it("frames the host only from configured builder origins", () => {
    expect(parseParents("https://build.ladestack.in, http://localhost:3001")).toEqual([
      "https://build.ladestack.in",
      "http://localhost:3001",
    ]);
    expect(() => parseParents("http://evil.example")).toThrow();
    expect(() => parseParents("https://build.ladestack.in/app")).toThrow();
    const csp = hostHeaders(["https://build.ladestack.in"])["Content-Security-Policy"];
    expect(csp).toContain("frame-ancestors https://build.ladestack.in");
    expect(hostHeaders([])["Content-Security-Policy"]).toContain("frame-ancestors 'none'");
  });
});

describe("builder and preview agree", () => {
  it("on message types and session ids", () => {
    expect(previewMessages).toEqual(messageTypes);
    for (let i = 0; i < 20; i++) expect(isValidSession(newPreviewSession())).toBe(true);
  });
});

describe("preview console bridge", () => {
  it("runs first in the page", () => {
    const head = injectBridge(
      '<!doctype html><html lang="en"><head><title>x</title></head></html>',
    );
    expect(head.indexOf("data-ladestack-preview")).toBeGreaterThan(head.indexOf("<head>"));
    expect(head.indexOf("data-ladestack-preview")).toBeLessThan(head.indexOf("<title>"));
    const htmlOnly = injectBridge("<html><body>x</body></html>");
    expect(htmlOnly.startsWith("<html><script data-ladestack-preview>")).toBe(true);
    expect(injectBridge("<p>x</p>").startsWith("<script data-ladestack-preview>")).toBe(true);
    expect(injectBridge("<header>x</header>").startsWith("<script")).toBe(true);
  });

  it("is valid JavaScript", () => {
    const src = injectBridge("")
      .replace(/^<script[^>]*>/, "")
      .replace(/<\/script>$/, "");
    expect(() => new Function(src)).not.toThrow();
  });

  it("validates and trims console messages", () => {
    const ok = { type: messageTypes.log, level: "error", text: "boom", where: "x" };
    expect(parseLogMessage(ok)).toEqual({ level: "error", text: "boom", where: "x" });
    expect(parseLogMessage({ ...ok, level: "trace" })).toBeNull();
    expect(parseLogMessage({ ...ok, text: {} })).toBeNull();
    expect(parseLogMessage({ ...ok, text: "x".repeat(3000) })?.text).toHaveLength(2000);
  });

  it("shortens locations to project paths", () => {
    expect(
      shortWhere(`https://p.example/p/${session}/src/a.js:3`, "https://p.example", session),
    ).toBe("src/a.js:3");
    expect(
      shortWhere(`https://p.example/p/${session}/index.html?v=4:12`, "https://p.example", session),
    ).toBe("index.html:12");
  });
});
