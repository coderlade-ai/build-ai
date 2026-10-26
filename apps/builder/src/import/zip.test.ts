import { strToU8, zipSync, type Zippable } from "fflate";
import { describe, expect, it } from "vitest";
import { buildProjectZip } from "../export/zip";
import { detectProfile, importLimits, nameFromArchive, parseProjectZip } from "./zip";

const zip = (tree: Record<string, string | Uint8Array>) =>
  zipSync(
    Object.fromEntries(
      Object.entries(tree).map(([k, v]) => [k, typeof v === "string" ? strToU8(v) : v]),
    ) as Zippable,
  );

describe("ZIP import", () => {
  it("round-trips our own export", () => {
    const files = { "index.html": "<h1>Hi</h1>", "src/app.js": "x()" };
    const bytes = buildProjectZip(
      Object.entries(files).map(([path, content]) => ({ path, content })),
    );
    expect(parseProjectZip(bytes)).toMatchObject({ status: "accepted", files, profile: "static" });
  });

  it("strips a single wrapping folder like GitHub archives", () => {
    const r = parseProjectZip(zip({ "site-main/index.html": "a", "site-main/css/s.css": "b" }));
    expect(r.status === "accepted" && Object.keys(r.files)).toEqual(["css/s.css", "index.html"]);
  });

  it("rejects zip-slip and absolute paths", () => {
    for (const bad of ["../evil.js", "a/../../evil.js", "/etc/passwd", "C:/x.js"]) {
      expect(parseProjectZip(zip({ "index.html": "a", [bad]: "x" }))).toMatchObject({
        status: "rejected",
        reason: "unsafe-path",
      });
    }
  });

  it("skips secrets, dependencies and binaries with reasons", () => {
    const r = parseProjectZip(
      zip({
        "index.html": "a",
        ".env": "KEY=1",
        ".env.example": "KEY=",
        "node_modules/x/index.js": "x",
        ".git/config": "x",
        "logo.png": new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0xff, 0xfe, 0x00]),
      }),
    );
    expect(r.status).toBe("partial");
    if (r.status !== "partial") return;
    expect(Object.keys(r.files).sort()).toEqual([".env.example", "index.html"]);
    expect(r.skipped).toEqual([
      { path: ".env", reason: "secret" },
      { path: "logo.png", reason: "binary" },
    ]);
  });

  it("bounds size and count", () => {
    const big = new Uint8Array(importLimits.fileBytes + 1).fill(97);
    const r = parseProjectZip(zip({ "index.html": "a", "big.txt": big }));
    expect(r.status === "partial" && r.skipped).toEqual([{ path: "big.txt", reason: "too-large" }]);
    expect(parseProjectZip(new Uint8Array(importLimits.archiveBytes + 1))).toMatchObject({
      reason: "archive-too-large",
    });
    const many = Object.fromEntries(
      Array.from({ length: importLimits.files + 1 }, (_, i) => [`f${i}.txt`, "x"]),
    );
    expect(parseProjectZip(zip(many))).toMatchObject({ reason: "too-many-files" });
  });

  it("rejects non-zips and empty archives", () => {
    expect(parseProjectZip(strToU8("not a zip"))).toMatchObject({ reason: "not-a-zip" });
    expect(parseProjectZip(zip({ "node_modules/a.js": "x" }))).toMatchObject({ reason: "empty" });
  });

  it("reports install hooks and detects the profile", () => {
    const pkg = JSON.stringify({
      scripts: { postinstall: "node evil.js", dev: "vite" },
      dependencies: { react: "^19" },
      devDependencies: { vite: "^7" },
    });
    const r = parseProjectZip(zip({ "package.json": pkg, "index.html": "a" }));
    expect(r).toMatchObject({ profile: "react-vite", installHooks: ["postinstall"] });
    expect(detectProfile({ "package.json": "{}" })).toBe("unsupported");
    expect(detectProfile({ "readme.md": "" })).toBe("unsupported");
  });

  it("names the project from the file", () => {
    expect(nameFromArchive("my-site-main.ZIP", "Imported")).toBe("my-site-main");
    expect(nameFromArchive(".zip", "Imported")).toBe("Imported");
  });
});
