import { describe, expect, it } from "vitest";
import { previewKind } from "./files";
import { parsePreviewOrigin } from "./origin";

describe("preview origin", () => {
  it("accepts https and local http origins only", () => {
    expect(parsePreviewOrigin("https://preview.ladestack.in")).toBe("https://preview.ladestack.in");
    expect(parsePreviewOrigin("https://preview.ladestack.in/")).toBe(
      "https://preview.ladestack.in",
    );
    expect(parsePreviewOrigin("http://127.0.0.1:4322")).toBe("http://127.0.0.1:4322");
    for (const bad of [
      undefined,
      "",
      "http://preview.ladestack.in",
      "https://preview.ladestack.in/x",
      "https://u:p@preview.ladestack.in",
      "javascript:alert(1)",
      "nope",
    ])
      expect(parsePreviewOrigin(bad)).toBeNull();
  });
});

describe("preview files", () => {
  it("previews plain HTML projects and waits for the runtime otherwise", () => {
    expect(previewKind(["index.html", "styles.css"])).toBe("static");
    expect(previewKind(["index.html", "package.json", "src/main.tsx"])).toBe("bundle");
    expect(previewKind(["package.json", "src/main.tsx"])).toBe("no-entry");
    expect(previewKind(["about.html"])).toBe("no-entry");
  });
});
