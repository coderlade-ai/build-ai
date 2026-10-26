import { IDBFactory } from "fake-indexeddb";
import { describe, expect, it } from "vitest";
import { starterTemplates } from "../templates";
import { eraseLocalData } from "./erase";
import { dbName, openProjectDb, ProjectStore } from "./projectStore";

function memoryStorage(entries: Record<string, string>): Storage {
  const m = new Map(Object.entries(entries));
  return {
    get length() {
      return m.size;
    },
    key: (i) => [...m.keys()][i] ?? null,
    getItem: (k) => m.get(k) ?? null,
    setItem: (k, v) => void m.set(k, v),
    removeItem: (k) => void m.delete(k),
    clear: () => m.clear(),
  };
}

describe("eraseLocalData", () => {
  it("deletes the project database and only LadeStack keys", async () => {
    const factory = new IDBFactory();
    const db = await openProjectDb(factory);
    const t = starterTemplates[0]!;
    await new ProjectStore(db).createProject({ name: "A", profile: t.profile, files: t.files });
    const session = memoryStorage({ "ladestack.build.provider": "{}", other: "keep" });
    const local = memoryStorage({ "ladestack:preview-viewport": "mobile", theme: "keep" });

    const r = await eraseLocalData({
      factory,
      storages: [session, local],
      closeOwnConnection: () => db.close(),
    });

    expect(r).toEqual({ ok: true });
    expect((await factory.databases()).map((d) => d.name)).not.toContain(dbName);
    expect(session.getItem("ladestack.build.provider")).toBeNull();
    expect(session.getItem("other")).toBe("keep");
    expect(local.getItem("ladestack:preview-viewport")).toBeNull();
    expect(local.getItem("theme")).toBe("keep");
  });

  it("waits for another tab to close and keeps settings until the database is gone", async () => {
    const factory = new IDBFactory();
    const otherTab = await openProjectDb(factory); // ignores versionchange
    const session = memoryStorage({ "ladestack.welcome-draft.v1": "hi" });
    let blocked = false;
    const pending = eraseLocalData({
      factory,
      storages: [session],
      closeOwnConnection: () => {},
      onBlocked: () => {
        blocked = true;
        expect(session.getItem("ladestack.welcome-draft.v1")).toBe("hi");
        otherTab.close();
      },
    });
    expect(await pending).toEqual({ ok: true });
    expect(blocked).toBe(true);
    expect(session.length).toBe(0);
  });

  it("works when IndexedDB is unavailable", async () => {
    const session = memoryStorage({ "ladestack.agentTask.x": "t" });
    const r = await eraseLocalData({
      factory: undefined,
      storages: [session, null],
      closeOwnConnection: () => {},
    });
    expect(r).toEqual({ ok: true });
    expect(session.length).toBe(0);
  });
});
