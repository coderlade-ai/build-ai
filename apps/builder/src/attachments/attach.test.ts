import { describe, expect, it } from "vitest";
import {
  admit,
  attachmentLimits,
  classifyFile,
  composeUserMessage,
  readAttachment,
  type Attachment,
} from "./attach";

const text = (name: string, size = 10): Attachment => ({ kind: "text", name, size, text: "x" });

describe("classifyFile", () => {
  it("accepts code, Markdown and images within limits", () => {
    expect(classifyFile("App.tsx", "", 100)).toEqual({ ok: true, kind: "text" });
    expect(classifyFile("README.md", "text/markdown", 100)).toEqual({ ok: true, kind: "text" });
    expect(classifyFile("shot.png", "image/png", 100)).toEqual({ ok: true, kind: "image" });
    expect(classifyFile("spec.pdf", "application/pdf", 100)).toEqual({ ok: true, kind: "pdf" });
  });

  it("never reads credentials or executables", () => {
    for (const n of [".env", ".env.local", "id_rsa", "server.pem", "run.sh", "setup.exe", ".npmrc"])
      expect(classifyFile(n, "text/plain", 10)).toEqual({ ok: false, reason: "blocked" });
  });

  it("rejects unknown types and oversized files", () => {
    expect(classifyFile("doc.docx", "application/zip", 10).ok).toBe(false);
    expect(classifyFile("a.ts", "", attachmentLimits.textBytes + 1)).toEqual({
      ok: false,
      reason: "too-large",
    });
    expect(classifyFile("a.png", "image/png", attachmentLimits.imageBytes + 1)).toEqual({
      ok: false,
      reason: "too-large",
    });
  });
});

describe("admit", () => {
  it("bounds the count and the total text size", () => {
    const six = Array.from({ length: attachmentLimits.files }, (_, i) => text(`${i}.md`));
    expect(admit(six, text("x.md"))).toEqual({ ok: false, reason: "too-many" });
    const big = [text("a.md", attachmentLimits.totalTextBytes - 5)];
    expect(admit(big, text("b.md", 10))).toEqual({ ok: false, reason: "too-large" });
    expect(admit(big, text("b.md", 5))).toEqual({ ok: true });
  });
});

describe("readAttachment", () => {
  it("reads text and base64-encodes images", async () => {
    const t = await readAttachment(new File(["# Hi"], "a.md", { type: "text/markdown" }));
    expect(t).toMatchObject({ ok: true, attachment: { kind: "text", text: "# Hi" } });
    const i = await readAttachment(
      new File([new Uint8Array([1, 2, 3])], "p.png", { type: "image/png" }),
    );
    expect(i).toMatchObject({ ok: true, attachment: { kind: "image", data: "AQID" } });
  });

  it("reads PDFs by signature and refuses renamed files", async () => {
    const pdf = await readAttachment(
      new File(["%PDF-1.7\n"], "spec.pdf", { type: "application/pdf" }),
    );
    expect(pdf).toMatchObject({ ok: true, attachment: { kind: "pdf", name: "spec.pdf" } });
    const fake = await readAttachment(new File(["hello"], "x.pdf", { type: "application/pdf" }));
    expect(fake).toEqual({ ok: false, reason: "unsupported" });
  });

  it("refuses binary content behind a text extension", async () => {
    const r = await readAttachment(new File([new Uint8Array([0, 1])], "x.txt"));
    expect(r).toEqual({ ok: false, reason: "unsupported" });
  });
});

describe("composeUserMessage", () => {
  it("quotes text files with a fence longer than any inside and keeps images apart", () => {
    const m = composeUserMessage("Explain", [
      { kind: "text", name: "a.md", size: 9, text: "```js\n1\n```" },
      { kind: "image", name: "p.png", size: 3, mediaType: "image/png", data: "AQID" },
    ]);
    expect(m.content.startsWith("Explain\n\nAttached files")).toBe(true);
    expect(m.content).toContain("a.md\n````\n```js");
    expect(m.images).toEqual([{ mediaType: "image/png", data: "AQID" }]);
  });

  it("leaves a prompt without attachments unchanged", () => {
    expect(composeUserMessage("Hi", [])).toEqual({ content: "Hi", images: [] });
  });
});
