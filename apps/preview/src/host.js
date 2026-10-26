// Preview host page: receives project files from the builder, stores them for the service
// worker, and shows the project in a nested frame on this (isolated) origin. ADR 0016.
import { bundleProject, errorPage } from "./bundle.js";
import { allowedParents } from "./config.js";
import {
  cacheName,
  fileHeaders,
  messageTypes,
  parseFilesMessage,
  parseLogMessage,
  shortWhere,
} from "./lib.js";

const frame = /** @type {HTMLIFrameElement} */ (document.getElementById("frame"));
const status = /** @type {HTMLElement} */ (document.getElementById("status"));
let version = 0;
/** The builder that sent the current files, and their session. */
let builder = "";
let current = "";

async function store(session, files) {
  for (const name of await caches.keys())
    if (name.startsWith("ladestack-preview-") && name !== cacheName(session))
      await caches.delete(name);
  const cache = await caches.open(cacheName(session));
  for (const req of await cache.keys())
    if (!(new URL(req.url).pathname.slice(`/p/${session}/`.length) in files))
      await cache.delete(req);
  await Promise.all(
    Object.entries(files).map(([path, content]) =>
      cache.put(
        `/p/${session}/${path}`,
        new Response(content, { headers: fileHeaders(path, allowedParents) }),
      ),
    ),
  );
}

/** @type {Promise<any> | null} */
let esbuild = null;
function loadEsbuild() {
  esbuild ??= (async () => {
    const m = await import("/vendor/esbuild/esbuild.js");
    await m.initialize({ wasmURL: "/vendor/esbuild/esbuild.wasm", worker: false });
    return m;
  })().catch((e) => {
    esbuild = null;
    throw e;
  });
  return esbuild;
}

/**
 * package.json projects are bundled here first (ADR 0018); a failed build shows an error page.
 * @param {Record<string, string>} files
 * @returns {Promise<{ files: Record<string, string>, errors: { text: string, where: string }[] }>}
 */
async function prepare(files) {
  if (!("package.json" in files)) return { files, errors: [] };
  status.hidden = false;
  status.textContent = "Building…";
  let result;
  try {
    result = await bundleProject(await loadEsbuild(), files);
  } catch {
    result = {
      ok: false,
      errors: [{ text: "The in-browser bundler could not start.", where: "" }],
    };
  }
  if (result.ok) return { files: result.files, errors: [] };
  const lines = result.errors.map((e) => (e.where ? `${e.where}: ${e.text}` : e.text));
  return { files: { "index.html": errorPage(lines) }, errors: result.errors };
}

async function start() {
  if (!("serviceWorker" in navigator)) {
    status.textContent = "This browser can't run the preview (no service workers).";
    return;
  }
  await navigator.serviceWorker.register("/sw.js", { type: "module", scope: "/" });
  await navigator.serviceWorker.ready;

  window.addEventListener("message", async (event) => {
    // Console output from the project page: forward it to the builder that sent the files.
    if (event.source === frame.contentWindow && event.origin === location.origin) {
      const log = parseLogMessage(event.data);
      if (log && builder)
        window.parent.postMessage(
          {
            type: messageTypes.log,
            ...log,
            where: shortWhere(log.where, location.origin, current),
          },
          builder,
        );
      return;
    }
    if (event.source !== window.parent || !allowedParents.includes(event.origin)) return;
    const msg = parseFilesMessage(event.data);
    if (!msg) return;
    const v = ++version;
    const origin = event.origin;
    const { files, errors } = await prepare(msg.files);
    if (v !== version) return; // newer files arrived while building
    await store(msg.session, files);
    if (v !== version) return;
    builder = origin;
    current = msg.session;
    status.hidden = true;
    for (const e of errors)
      window.parent.postMessage(
        { type: messageTypes.log, level: "error", text: `Build error: ${e.text}`, where: e.where },
        origin,
      );
    // "loaded" means the project page finished loading (its scripts ran), not just that files arrived.
    frame.addEventListener(
      "load",
      () => {
        if (v === version) window.parent.postMessage({ type: messageTypes.loaded }, origin);
      },
      { once: true },
    );
    frame.src = `/p/${msg.session}/index.html?v=${v}`;
  });

  // The builder's origin is one of the allowed parents; a message to any other is dropped.
  for (const origin of allowedParents)
    window.parent.postMessage({ type: messageTypes.ready }, origin);
}

start().catch(() => {
  status.textContent = "The preview could not start.";
});
