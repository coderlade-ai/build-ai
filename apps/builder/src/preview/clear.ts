import { previewMessages } from "./files";

export type ClearResult = "cleared" | "off" | "unreachable";

/** The parts of the page this needs, so it can be tested without a browser. */
export interface ClearDeps {
  origin: string | null;
  /** Opens the preview host in a hidden frame; returns its window and a cleanup. */
  openFrame: (src: string) => { target: () => MessageEventSource | null; remove: () => void };
  listen: (handler: (e: MessageEvent) => void) => () => void;
  timeoutMs?: number;
}

/**
 * SET-03: the preview origin keeps a copy of the last previewed project in Cache Storage.
 * Opens its host page in a hidden frame and asks it to delete every preview cache. Resolves
 * "unreachable" when the host does not answer in time, so the caller can say so honestly.
 */
export function clearPreviewCache(deps: ClearDeps): Promise<ClearResult> {
  const origin = deps.origin;
  if (!origin) return Promise.resolve("off");
  return new Promise((resolve) => {
    const frame = deps.openFrame(`${origin}/`);
    let done = false;
    const finish = (r: ClearResult) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      stop();
      frame.remove();
      resolve(r);
    };
    const timer = setTimeout(() => finish("unreachable"), deps.timeoutMs ?? 8000);
    const stop = deps.listen((e) => {
      if (e.origin !== origin || e.source !== frame.target()) return;
      const data = e.data as { type?: unknown; ok?: unknown } | null;
      if (data?.type === previewMessages.ready)
        (frame.target() as Window | null)?.postMessage({ type: previewMessages.clear }, origin);
      else if (data?.type === previewMessages.cleared)
        finish(data.ok === true ? "cleared" : "unreachable");
    });
  });
}

/** Browser wiring for clearPreviewCache. */
export function browserClearDeps(origin: string | null): ClearDeps {
  return {
    origin,
    openFrame(src) {
      const el = document.createElement("iframe");
      el.hidden = true;
      el.setAttribute("aria-hidden", "true");
      el.tabIndex = -1;
      el.src = src;
      document.body.appendChild(el);
      return { target: () => el.contentWindow, remove: () => el.remove() };
    },
    listen(handler) {
      window.addEventListener("message", handler);
      return () => window.removeEventListener("message", handler);
    },
  };
}
