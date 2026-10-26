// Serves the current project's files from Cache Storage under /p/<session>/ (ADR 0016).
// The host page writes the cache; this worker only reads it, so nothing is lost if it is stopped.
import { cacheName, fileHeaders, previewTarget } from "./lib.js";

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

async function serve(session, file) {
  const cache = await caches.open(cacheName(session));
  const hit = await cache.match(`/p/${session}/${file}`);
  if (!hit)
    return new Response(`Not found: ${file}`, { status: 404, headers: fileHeaders("x.txt") });
  return new Response(hit.body, { status: 200, headers: fileHeaders(file) });
}

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || event.request.method !== "GET") return;
  const target = previewTarget(url.pathname);
  if (target) {
    event.respondWith(serve(target.session, target.file));
    return;
  }
  // Root-relative URLs ("/styles.css") from a project page map into that page's project.
  if (!event.clientId) return;
  event.respondWith(
    (async () => {
      const client = await self.clients.get(event.clientId);
      const from = client && previewTarget(new URL(client.url).pathname);
      if (!from) return fetch(event.request);
      const file = previewTarget(`/p/${from.session}${url.pathname}`);
      return file ? serve(file.session, file.file) : new Response("", { status: 404 });
    })(),
  );
});
