import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { RuntimeResult } from "./contract";
import { dependencyKey, DependencyReconciler, type InstallEvent } from "./reconcile";
import { projectKind, selectRuntime } from "./select";
import { createStaticRuntime } from "./static";

describe("static runtime", () => {
  it("serves a static project and refuses Node work honestly", async () => {
    const rt = createStaticRuntime();
    const seen: string[] = [];
    rt.observePreviewStatus((s) => seen.push(s));
    expect(await rt.initialize()).toEqual({ ok: true, value: undefined });
    await rt.mountProject({ "index.html": "<h1>hi</h1>" }, "r1");
    expect(rt.getPreviewEndpoint()).toEqual({
      ok: true,
      value: { kind: "static", entry: "index.html" },
    });
    expect(seen).toEqual(["idle", "ready"]);
    for (const r of [
      await rt.installDependencies("{}", null, { allowInstallScripts: false }),
      await rt.startProcess("npm", ["run", "dev"]),
      await rt.stopProcess("1"),
      rt.streamProcessOutput("1", () => {}),
    ])
      expect(r).toMatchObject({ ok: false, unsupported: true });
    expect(rt.capabilities()).toMatchObject({ install: false, processes: false, preview: true });
  });

  it("tracks files and revision consistency", async () => {
    const rt = createStaticRuntime();
    expect(await rt.writeFile("a.js", "x")).toMatchObject({ ok: false });
    await rt.mountProject({ "index.html": "a" }, "r1");
    expect(await rt.reconcileProjectRevision("r1")).toEqual({ ok: true, value: { inSync: true } });
    await rt.writeFile("app.js", "1");
    expect(await rt.readFile("app.js")).toEqual({ ok: true, value: "1" });
    expect(await rt.reconcileProjectRevision("r1")).toEqual({ ok: true, value: { inSync: false } });
    expect(await rt.writeFile("../x", "1")).toMatchObject({ ok: false, unsupported: false });
    expect(await rt.mountProject({ "/etc/passwd": "" }, "r2")).toMatchObject({ ok: false });
    await rt.deleteFile("index.html");
    expect(rt.getPreviewEndpoint()).toMatchObject({ ok: false, unsupported: true });
    const snap = await rt.snapshotWorkingState();
    expect(snap).toEqual({ ok: true, value: { revision: "r1", files: { "app.js": "1" } } });
  });
});

describe("runtime selection", () => {
  it("picks static for HTML and the experimental bundler for package.json", () => {
    expect(projectKind(["index.html"])).toBe("static");
    expect(projectKind(["package.json", "index.html"])).toBe("node");
    const s = selectRuntime(["index.html"]);
    expect(s.ok && s.adapter.capabilities().id).toBe("static");
    const b = selectRuntime(["package.json", "index.html"]);
    expect(b.ok && b.adapter.capabilities()).toMatchObject({
      id: "esbuild-bundle",
      install: false,
    });
    expect(selectRuntime(["package.json"])).toMatchObject({ ok: false, kind: "node" });
    expect(selectRuntime(["readme.md"])).toMatchObject({ ok: false, kind: null });
  });
});

describe("dependency key", () => {
  it("rejects incomplete or malformed manifests", () => {
    expect(dependencyKey('{"dependencies": {"react"', null).ok).toBe(false);
    expect(dependencyKey("[]", null).ok).toBe(false);
    expect(dependencyKey('{"dependencies": {"react": 18}}', null).ok).toBe(false);
  });

  it("ignores order and fields that don't affect installs", () => {
    const a = dependencyKey('{"name":"a","dependencies":{"b":"1","a":"2"}}', null);
    const b = dependencyKey('{"name":"z","scripts":{},"dependencies":{"a":"2","b":"1"}}', null);
    expect(a).toEqual(b);
    expect(dependencyKey('{"dependencies":{"a":"2"}}', "lock1")).not.toEqual(
      dependencyKey('{"dependencies":{"a":"2"}}', "lock2"),
    );
  });
});

describe("DependencyReconciler", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  const pkg = (v: string) => JSON.stringify({ dependencies: { react: v } });

  function setup() {
    const events: InstallEvent[] = [];
    const resolvers: ((r: RuntimeResult) => void)[] = [];
    const install = vi.fn(
      (_m: string, _l: string | null, _s: AbortSignal) =>
        new Promise<RuntimeResult>((r) => resolvers.push(r)),
    );
    const rec = new DependencyReconciler(install, (e) => events.push(e), 100);
    const finish = async (r: RuntimeResult = { ok: true, value: undefined }) => {
      resolvers.shift()!(r);
      await vi.advanceTimersByTimeAsync(0);
    };
    return { events, install, rec, finish };
  }

  it("coalesces rapid changes into one install and skips unchanged ones", async () => {
    const { events, install, rec, finish } = setup();
    rec.request(pkg("18.0.0"), null, "r1");
    rec.request(pkg("18.1.0"), null, "r2");
    rec.request(pkg("18.2.0"), null, "r3");
    await vi.advanceTimersByTimeAsync(100);
    expect(install).toHaveBeenCalledTimes(1);
    await finish();
    expect(events).toEqual([
      { type: "started", revision: "r3" },
      { type: "completed", revision: "r3" },
    ]);
    rec.request(pkg("18.2.0"), null, "r4");
    expect(events.at(-1)).toEqual({ type: "unchanged", revision: "r4" });
    expect(install).toHaveBeenCalledTimes(1);
  });

  it("never runs two installs at once and marks the stale one superseded", async () => {
    const { events, install, rec, finish } = setup();
    rec.request(pkg("1"), null, "r1");
    await vi.advanceTimersByTimeAsync(100);
    rec.request(pkg("2"), null, "r2");
    await vi.advanceTimersByTimeAsync(100);
    expect(install).toHaveBeenCalledTimes(1);
    await finish();
    expect(events).toContainEqual({ type: "superseded", revision: "r1" });
    expect(install).toHaveBeenCalledTimes(2);
    await finish();
    expect(events.at(-1)).toEqual({ type: "completed", revision: "r2" });
  });

  it("reports invalid manifests and failures without installing", async () => {
    const { events, install, rec, finish } = setup();
    rec.request('{"dependencies":', null, "r1");
    expect(events[0]).toMatchObject({ type: "invalid" });
    rec.request(pkg("1"), null, "r2");
    await vi.advanceTimersByTimeAsync(100);
    await finish({ ok: false, unsupported: false, reason: "network" });
    expect(events.at(-1)).toEqual({ type: "failed", revision: "r2", reason: "network" });
    rec.request(pkg("1"), null, "r3"); // a failed install is retried
    await vi.advanceTimersByTimeAsync(100);
    expect(install).toHaveBeenCalledTimes(2);
  });

  it("dispose aborts the running install and ignores its result", async () => {
    const { events, install, rec, finish } = setup();
    rec.request(pkg("1"), null, "r1");
    await vi.advanceTimersByTimeAsync(100);
    rec.dispose();
    expect(install.mock.calls[0]![2].aborted).toBe(true);
    await finish();
    expect(events.at(-1)).toEqual({ type: "superseded", revision: "r1" });
  });
});
