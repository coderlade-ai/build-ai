// Response headers for the preview origin (ADR 0016). Used by the build (_headers) and the local server.

/** @param {string | undefined} raw */
export function parseParents(raw) {
  const list = (raw ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  for (const origin of list) {
    const u = new URL(origin);
    const local = u.hostname === "localhost" || u.hostname === "127.0.0.1";
    if (u.origin !== origin || (u.protocol !== "https:" && !(local && u.protocol === "http:")))
      throw new Error(`Invalid parent origin: ${origin}`);
  }
  return list;
}

/** @param {string[]} parents */
export function hostHeaders(parents) {
  return {
    "Content-Security-Policy": [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'unsafe-inline'",
      "frame-src 'self'",
      "worker-src 'self'",
      "object-src 'none'",
      "base-uri 'none'",
      `frame-ancestors ${parents.join(" ") || "'none'"}`,
    ].join("; "),
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
    "Cache-Control": "no-cache",
  };
}
