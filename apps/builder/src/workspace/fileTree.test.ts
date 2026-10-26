import { describe, expect, it } from "vitest";
import { buildFileTree, defaultFile } from "./fileTree";

describe("file tree", () => {
  it("nests folders first and sorts names", () => {
    const tree = buildFileTree([
      "index.html",
      "src/main.tsx",
      "src/App.tsx",
      "a.css",
      "src/ui/B.tsx",
    ]);
    expect(tree.map((n) => n.name)).toEqual(["src", "a.css", "index.html"]);
    expect(tree[0]!.children!.map((n) => n.path)).toEqual([
      "src/ui",
      "src/App.tsx",
      "src/main.tsx",
    ]);
    expect(tree[0]!.children![0]!.children).toEqual([{ name: "B.tsx", path: "src/ui/B.tsx" }]);
  });

  it("opens the app entry first", () => {
    expect(defaultFile(["index.html", "src/App.tsx"])).toBe("src/App.tsx");
    expect(defaultFile(["styles.css", "index.html"])).toBe("index.html");
    expect(defaultFile(["b.txt", "a.txt"])).toBe("a.txt");
    expect(defaultFile([])).toBeUndefined();
  });
});
