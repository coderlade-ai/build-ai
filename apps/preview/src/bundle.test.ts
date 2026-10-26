import * as esbuild from "esbuild-wasm";
import { describe, expect, it } from "vitest";
import {
  bundleProject,
  errorPage,
  findModuleEntry,
  isTailwindCss,
  toTailwindBrowserCss,
  packageUrl,
  resolveLocal,
  splitPackage,
} from "./bundle.js";

const pkg = JSON.stringify({
  dependencies: { react: "^19.1.1", "react-dom": "^19.1.1", "@acme/ui": "1.2.0" },
  devDependencies: { vite: "^7.1.0" },
});
const html = `<!doctype html><html><head><title>x</title></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>`;

describe("bundle helpers", () => {
  it("finds the Vite module entry", () => {
    expect(findModuleEntry(html)?.path).toBe("src/main.tsx");
    expect(findModuleEntry('<script src="a.js"></script>')).toBeNull();
    expect(findModuleEntry('<script type="module" src="https://x/y.js"></script>')).toBeNull();
  });

  it("maps bare imports to esm.sh with package.json ranges", () => {
    expect(splitPackage("@acme/ui/button")).toEqual({ name: "@acme/ui", sub: "/button" });
    expect(packageUrl("react-dom/client", { "react-dom": "^19.1.1" })).toEqual({
      url: "https://esm.sh/react-dom@^19.1.1/client",
    });
    expect(packageUrl("lodash", {})).toMatchObject({ error: expect.stringMatching(/not listed/) });
    expect(packageUrl("node:fs", {})).toMatchObject({ error: expect.stringMatching(/built-in/) });
    expect(packageUrl("x", { x: "file:../x" })).toMatchObject({ error: expect.any(String) });
  });

  it("resolves files like Vite (extensions and index files)", () => {
    const files = { "src/App.tsx": "", "src/ui/index.ts": "" };
    expect(resolveLocal(files, "src/App")).toBe("src/App.tsx");
    expect(resolveLocal(files, "src/ui")).toBe("src/ui/index.ts");
    expect(resolveLocal(files, "src/nope")).toBeNull();
  });

  it("escapes the error page", () => {
    expect(errorPage(["<script>"])).not.toContain("<script>");
  });
});

describe("bundleProject (esbuild-wasm)", () => {
  it("bundles TSX + CSS and keeps packages as esm.sh imports", async () => {
    const r = await bundleProject(esbuild, {
      "package.json": pkg,
      "index.html": html,
      "src/main.tsx": `import { createRoot } from "react-dom/client";\nimport App from "./App";\nimport "./App.css";\ncreateRoot(document.getElementById("root")!).render(<App />);`,
      "src/App.tsx": `import { useState } from "react";\nimport s from "./App.module.css";\nexport default function App() { const [n] = useState(import.meta.env.DEV ? 1 : 0); return <p className={s.box}>{n}</p>; }`,
      "src/App.css": "body { color: red }",
      "src/App.module.css": ".box { color: blue }",
      "public/logo.svg": "<svg/>",
    });
    if (!r.ok) throw new Error(JSON.stringify(r.errors));
    const js = r.files["__ladestack/bundle.js"]!;
    expect(js).toContain("https://esm.sh/react-dom@^19.1.1/client");
    expect(js).toContain("https://esm.sh/react@^19.1.1/jsx-runtime");
    expect(r.files["__ladestack/bundle.css"]).toContain("color: red");
    expect(r.files["index.html"]).toContain('src="/__ladestack/bundle.js"');
    expect(r.files["index.html"]).toContain('href="/__ladestack/bundle.css"');
    expect(r.files["index.html"]).not.toContain("/src/main.tsx");
    expect(r.files["logo.svg"]).toBe("<svg/>");
  });

  it("reports readable errors with locations", async () => {
    const syntax = await bundleProject(esbuild, {
      "package.json": pkg,
      "index.html": html,
      "src/main.tsx": `const a: number = ;`,
    });
    expect(syntax).toMatchObject({ ok: false, errors: [{ where: "src/main.tsx:1:19" }] });
    const missing = await bundleProject(esbuild, {
      "package.json": pkg,
      "index.html": html,
      "src/main.tsx": `import "./missing";\nimport x from "lodash";\nconsole.log(x);`,
    });
    expect(missing.ok).toBe(false);
    if (missing.ok) return;
    const all = missing.errors.map((e) => e.text).join("\n");
    expect(all).toMatch(/Cannot find "\.\/missing"/);
    expect(all).toMatch(/"lodash" is imported but not listed/);
  });

  it("explains a missing entry", async () => {
    const r = await bundleProject(esbuild, { "package.json": pkg, "index.html": "<p>hi</p>" });
    expect(r).toMatchObject({ ok: false, errors: [{ text: expect.stringMatching(/entry/) }] });
  });
});

describe("Tailwind in bundled previews", () => {
  it("detects Tailwind v4 and v3 sources and normalises them", () => {
    expect(isTailwindCss('@import "tailwindcss";')).toBe(true);
    expect(isTailwindCss("@tailwind base;\n@tailwind utilities;")).toBe(true);
    expect(isTailwindCss("body { color: red }")).toBe(false);
    expect(
      toTailwindBrowserCss("@tailwind base;\n@tailwind components;\n@tailwind utilities;\n.x{}"),
    ).toBe('@import "tailwindcss";\n\n\n.x{}');
    expect(toTailwindBrowserCss("a{}</style><script>")).not.toContain("</style>");
  });

  it("compiles Tailwind stylesheets in the page with the self-hosted browser build", async () => {
    const r = await bundleProject(
      esbuild,
      {
        "package.json": JSON.stringify({ dependencies: { tailwindcss: "^4.1.0" } }),
        "index.html": html,
        "src/main.tsx": `import "./index.css";\nimport "./plain.css";\ndocument.body.className = "p-4";`,
        "src/index.css": '@import "tailwindcss";\n@theme { --color-brand: #f54e00; }',
        "src/plain.css": "h1 { margin: 0 }",
      },
      { tailwindScript: async () => "/* tw */" },
    );
    if (!r.ok) throw new Error(JSON.stringify(r.errors));
    expect(r.files["__ladestack/tailwind.js"]).toBe("/* tw */");
    expect(r.files["index.html"]).toContain(
      '<style type="text/tailwindcss">@import "tailwindcss";',
    );
    expect(r.files["index.html"]).toContain("--color-brand: #f54e00");
    expect(r.files["index.html"]).toContain('src="/__ladestack/tailwind.js"');
    expect(r.files["__ladestack/bundle.css"]).toContain("margin: 0");
    expect(r.files["__ladestack/bundle.css"]).not.toContain("tailwindcss");
  });

  it("leaves projects without Tailwind untouched", async () => {
    const r = await bundleProject(
      esbuild,
      { "package.json": "{}", "index.html": html, "src/main.tsx": "console.log(1)" },
      { tailwindScript: async () => "x" },
    );
    expect(r.ok && r.files["__ladestack/tailwind.js"]).toBe(undefined);
  });
});
