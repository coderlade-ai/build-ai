import { describe, expect, it, vi } from "vitest";
import { clearPreviewCache, type ClearDeps } from "./clear";
import { previewMessages } from "./files";

const origin = "https://preview.example";

function fake(reply: "ok" | "fail" | "silent", from = origin) {
  const posted: unknown[] = [];
  const target = { postMessage: (m: unknown) => posted.push(m) } as unknown as Window;
  let handler: ((e: MessageEvent) => void) | null = null;
  const removed = vi.fn();
  const send = (data: unknown) => handler?.({ origin: from, source: target, data } as MessageEvent);
  const deps: ClearDeps = {
    origin,
    timeoutMs: 50,
    openFrame: () => {
      queueMicrotask(() => send({ type: previewMessages.ready }));
      return { target: () => target, remove: removed };
    },
    listen: (h) => {
      handler = (e) => {
        h(e);
      };
      return () => (handler = null);
    },
  };
  const realPost = target.postMessage.bind(target);
  (target as { postMessage: (m: unknown) => void }).postMessage = (m) => {
    realPost(m);
    if (reply !== "silent")
      queueMicrotask(() => send({ type: previewMessages.cleared, ok: reply === "ok" }));
  };
  return { deps, posted, removed };
}

describe("clearPreviewCache", () => {
  it("is a no-op when no preview origin is configured", async () => {
    expect(await clearPreviewCache({ ...fake("ok").deps, origin: null })).toBe("off");
  });

  it("asks the host to clear once it is ready and removes the frame", async () => {
    const f = fake("ok");
    expect(await clearPreviewCache(f.deps)).toBe("cleared");
    expect(f.posted).toEqual([{ type: previewMessages.clear }]);
    expect(f.removed).toHaveBeenCalled();
  });

  it("reports a host that failed to delete as unreachable", async () => {
    expect(await clearPreviewCache(fake("fail").deps)).toBe("unreachable");
  });

  it("times out when the host never answers", async () => {
    const f = fake("silent");
    expect(await clearPreviewCache(f.deps)).toBe("unreachable");
    expect(f.removed).toHaveBeenCalled();
  });

  it("ignores messages from other origins", async () => {
    const f = fake("ok", "https://evil.example");
    expect(await clearPreviewCache(f.deps)).toBe("unreachable");
    expect(f.posted).toEqual([]);
  });
});
