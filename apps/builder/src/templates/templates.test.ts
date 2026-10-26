import { describe, expect, it } from "vitest";
import { starterTemplates } from "./index";
import { isSafeProjectPath, validateTemplateFiles } from "./validate";

describe("project paths", () => {
  it("accept ordinary relative paths", () => {
    for (const p of ["index.html", "src/App.tsx", "public/img/logo.svg", ".env.example"])
      expect(isSafeProjectPath(p), p).toBe(true);
  });

  it("reject traversal, absolute, hidden-secret and tooling paths", () => {
    for (const p of [
      "",
      "/etc/passwd",
      "../x",
      "src/../../x",
      "a//b",
      "a\\b",
      ".env",
      "config/.env.local",
      ".git/config",
      "node_modules/x/index.js",
    ])
      expect(isSafeProjectPath(p), p).toBe(false);
  });

  it("flag install hooks and broken manifests", () => {
    expect(validateTemplateFiles({ "package.json": "{" })).toEqual([
      { path: "package.json", problem: "invalid JSON" },
    ]);
    expect(
      validateTemplateFiles({ "package.json": JSON.stringify({ scripts: { postinstall: "x" } }) }),
    ).toEqual([{ path: "package.json", problem: 'install hook "postinstall"' }]);
  });
});

describe("starter templates", () => {
  it("have unique ids and pass validation", () => {
    expect(new Set(starterTemplates.map((t) => t.id)).size).toBe(starterTemplates.length);
    for (const t of starterTemplates) expect(validateTemplateFiles(t.files), t.id).toEqual([]);
  });

  it("are runnable: an index.html entry, and a Vite manifest for React", () => {
    for (const t of starterTemplates) expect(t.files["index.html"], t.id).toBeDefined();
    const react = starterTemplates.find((t) => t.id === "react-vite")!;
    const pkg = JSON.parse(react.files["package.json"]!) as {
      scripts: Record<string, string>;
      dependencies: Record<string, string>;
    };
    expect(pkg.scripts.dev).toBe("vite");
    expect(pkg.dependencies.react).toBeDefined();
    expect(react.files["src/main.tsx"]).toContain('from "./App"');
  });
});
