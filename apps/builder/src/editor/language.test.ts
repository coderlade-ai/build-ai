import { describe, expect, it } from "vitest";
import { languageForPath, monacoBasePath } from "./language";

describe("editor languages", () => {
  it("maps common project files", () => {
    expect(languageForPath("src/App.tsx")).toBe("typescript");
    expect(languageForPath("index.html")).toBe("html");
    expect(languageForPath("src/App.CSS")).toBe("css");
    expect(languageForPath("package.json")).toBe("json");
    expect(languageForPath("script.js")).toBe("javascript");
  });

  it("falls back to plain text", () => {
    expect(languageForPath("LICENSE")).toBe("plaintext");
    expect(languageForPath(".gitignore")).toBe("plaintext");
    expect(languageForPath("data.bin")).toBe("plaintext");
  });

  it("loads Monaco from this origin, never a CDN", () => {
    expect(monacoBasePath.startsWith("/app/")).toBe(true);
  });
});
