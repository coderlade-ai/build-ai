import { strFromU8, unzipSync } from "fflate";
import { describe, expect, it } from "vitest";
import { buildProjectZip, zipFileName } from "./zip";

describe("ZIP export", () => {
  const files = [
    { path: "index.html", content: "<h1>Héllo</h1>" },
    { path: "src/main.ts", content: "console.log('hi');" },
  ];

  it("round-trips files with nested folders and UTF-8", () => {
    const out = unzipSync(buildProjectZip(files));
    expect(Object.keys(out).sort()).toEqual(["index.html", "src/main.ts"]);
    expect(strFromU8(out["index.html"]!)).toBe("<h1>Héllo</h1>");
  });

  it("is deterministic", () => {
    expect(buildProjectZip(files)).toEqual(buildProjectZip(files));
  });

  it("refuses unsafe, duplicate, or empty input", () => {
    for (const path of ["../evil", "/etc/passwd", "a\\b", ".env", "node_modules/x.js"]) {
      expect(() => buildProjectZip([{ path, content: "" }])).toThrow(/Unsafe/);
    }
    expect(() => buildProjectZip([files[0]!, files[0]!])).toThrow(/Duplicate/);
    expect(() => buildProjectZip([])).toThrow();
  });

  it("names the download after the project", () => {
    expect(zipFileName("My Café Site!")).toBe("my-cafe-site.zip");
    expect(zipFileName("Сайт 2")).toBe("сайт-2.zip");
    expect(zipFileName("  ***  ")).toBe("project.zip");
  });
});
