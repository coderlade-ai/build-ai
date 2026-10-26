// Preview host page: receives project files from the builder, stores them for the service
// worker, and shows the project in a nested frame on this (isolated) origin. ADR 0016.
import { allowedParents } from "./config.js";
import { cacheName, fileHeaders, messageTypes, parseFilesMessage } from "./lib.js";

const frame = /** @type {HTMLIFrameElement} */ (document.getElementById("frame"));
const status = /** @type {HTMLElement} */ (document.getElementById("status"));
let version = 0;

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
      cache.put(`/p/${session}/${path}`, new Response(content, { headers: fileHeaders(path) })),
    ),
  );
}

async function start() {
  if (!("serviceWorker" in navigator)) {
    status.textContent = "This browser can't run the preview (no service workers).";
    return;
  }
  await navigator.serviceWorker.register("/sw.js", { type: "module", scope: "/" });
  await navigator.serviceWorker.ready;

  window.addEventListener("message", async (event) => {
    if (event.source !== window.parent || !allowedParents.includes(event.origin)) return;
    const msg = parseFilesMessage(event.data);
    if (!msg) return;
    await store(msg.session, msg.files);
    status.hidden = true;
    frame.src = `/p/${msg.session}/index.html?v=${++version}`;
    window.parent.postMessage({ type: messageTypes.loaded }, event.origin);
  });

  // The builder's origin is one of the allowed parents; a message to any other is dropped.
  for (const origin of allowedParents)
    window.parent.postMessage({ type: messageTypes.ready }, origin);
}

start().catch(() => {
  status.textContent = "The preview could not start.";
});
