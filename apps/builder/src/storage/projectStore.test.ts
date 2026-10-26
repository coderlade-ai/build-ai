import { IDBFactory } from "fake-indexeddb";
import { beforeEach, describe, expect, it } from "vitest";
import { starterTemplates } from "../templates";
import { openProjectDb, ProjectStore, sha256 } from "./projectStore";

let store: ProjectStore;
let factory: IDBFactory;

beforeEach(async () => {
  factory = new IDBFactory();
  let t = Date.parse("2026-10-25T00:00:00Z");
  store = new ProjectStore(await openProjectDb(factory), () => new Date((t += 1000)));
});

const files = { "index.html": "<h1>Hi</h1>", "styles.css": "body{}" };

describe("project store", () => {
  it("creates a project with checksummed files", async () => {
    const p = await store.createProject({ name: "Site", profile: "static", files });
    expect(await store.listFiles(p.id)).toMatchObject([
      {
        path: "index.html",
        revision: "1",
        size: 11,
        contentHash: await sha256(files["index.html"]),
      },
      { path: "styles.css", revision: "1" },
    ]);
    expect((await store.readFile(p.id, "index.html"))?.content).toBe("<h1>Hi</h1>");
  });

  it("refuses unsafe paths without writing anything", async () => {
    await expect(
      store.createProject({ name: "Bad", profile: "static", files: { "../x": "" } }),
    ).rejects.toThrow("Unsafe project path");
    expect(await store.listProjects()).toEqual([]);
  });

  it("writes with the matching base revision and bumps revisions", async () => {
    const p = await store.createProject({ name: "Site", profile: "static", files });
    const r = await store.writeFile(p.id, "index.html", "<h1>Hello</h1>", "1");
    expect(r).toMatchObject({ ok: true, file: { revision: "2" } });
    expect((await store.readFile(p.id, "index.html"))?.content).toBe("<h1>Hello</h1>");
    expect((await store.getProject(p.id))?.headRevision).toBe("2");
  });

  it("reports a conflict instead of overwriting a newer revision", async () => {
    const p = await store.createProject({ name: "Site", profile: "static", files });
    await store.writeFile(p.id, "index.html", "manual edit", "1");
    const stale = await store.writeFile(p.id, "index.html", "AI edit", "1");
    expect(stale).toMatchObject({ ok: false, reason: "conflict", current: { revision: "2" } });
    expect((await store.readFile(p.id, "index.html"))?.content).toBe("manual edit");
  });

  it("creates new files only with a null base and rejects unsafe or orphan writes", async () => {
    const p = await store.createProject({ name: "Site", profile: "static", files });
    expect(await store.writeFile(p.id, "src/app.js", "x", null)).toMatchObject({ ok: true });
    expect(await store.writeFile(p.id, "src/app.js", "y", null)).toMatchObject({
      reason: "conflict",
    });
    expect(await store.writeFile(p.id, ".env", "SECRET=1", null)).toMatchObject({
      reason: "invalid-path",
    });
    expect(await store.writeFile("nope", "a.txt", "x", null)).toMatchObject({
      reason: "missing-project",
    });
  });

  it("deletes files and projects", async () => {
    const p = await store.createProject({ name: "Site", profile: "static", files });
    expect(await store.deleteFile(p.id, "styles.css", "9")).toMatchObject({ reason: "conflict" });
    expect(await store.deleteFile(p.id, "styles.css", "1")).toMatchObject({ ok: true });
    expect((await store.listFiles(p.id)).map((f) => f.path)).toEqual(["index.html"]);
    await store.deleteProject(p.id);
    expect(await store.getProject(p.id)).toBeUndefined();
    expect(await store.listFiles(p.id)).toEqual([]);
  });

  it("lists projects newest first and renames them", async () => {
    const a = await store.createProject({ name: "A", profile: "static", files });
    const b = await store.createProject({ name: "B", profile: "static", files });
    expect((await store.listProjects()).map((p) => p.name)).toEqual(["B", "A"]);
    await store.renameProject(a.id, "A2");
    expect((await store.listProjects()).map((p) => p.name)).toEqual(["A2", "B"]);
    expect(b.name).toBe("B");
  });

  it("survives reopening the database (reload)", async () => {
    const p = await store.createProject({ name: "Site", profile: "static", files });
    const reopened = new ProjectStore(await openProjectDb(factory));
    expect((await reopened.readFile(p.id, "styles.css"))?.content).toBe("body{}");
  });

  it("stores every starter template with consistent checksums", async () => {
    for (const t of starterTemplates) {
      const p = await store.createProject({ name: t.id, profile: t.profile, files: t.files });
      for (const f of await store.listFiles(p.id)) {
        const read = await store.readFile(p.id, f.path);
        expect(await sha256(read!.content), f.path).toBe(f.contentHash);
        expect(read!.content).toBe(t.files[f.path]);
      }
    }
  });
});
