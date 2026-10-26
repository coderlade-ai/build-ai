// Pure helpers shared by the preview host page and its service worker (ADR 0016).

export const messageTypes = {
  ready: "ladestack:preview-ready",
  files: "ladestack:preview-files",
  loaded: "ladestack:preview-loaded",
};

export const limits = { files: 2000, totalBytes: 50 * 1024 * 1024 };

const types = {
  html: "text/html; charset=utf-8",
  htm: "text/html; charset=utf-8",
  css: "text/css; charset=utf-8",
  js: "text/javascript; charset=utf-8",
  mjs: "text/javascript; charset=utf-8",
  json: "application/json; charset=utf-8",
  svg: "image/svg+xml",
  txt: "text/plain; charset=utf-8",
  md: "text/plain; charset=utf-8",
  xml: "application/xml; charset=utf-8",
  webmanifest: "application/manifest+json",
};

/** @param {string} path */
export function contentTypeFor(path) {
  const ext = path.toLowerCase().split(".").pop() ?? "";
  return types[ext] ?? "text/plain; charset=utf-8";
}

/** @param {string} session */
export function isValidSession(session) {
  return typeof session === "string" && /^[A-Za-z0-9_-]{16,64}$/.test(session);
}

/** @param {unknown} path */
export function isSafePreviewPath(path) {
  if (typeof path !== "string" || !path || path.length > 512) return false;
  if (path.startsWith("/") || path.includes("\\") || path.includes("\0")) return false;
  return path.split("/").every((part) => part !== "" && part !== "." && part !== "..");
}

/**
 * Validates a files message from the builder. Returns null for anything malformed or too large.
 * @param {unknown} data
 * @returns {{ session: string, files: Record<string, string> } | null}
 */
export function parseFilesMessage(data) {
  if (!data || typeof data !== "object") return null;
  const d = /** @type {Record<string, unknown>} */ (data);
  if (d.type !== messageTypes.files || !isValidSession(/** @type {string} */ (d.session)))
    return null;
  if (!d.files || typeof d.files !== "object" || Array.isArray(d.files)) return null;
  const entries = Object.entries(/** @type {Record<string, unknown>} */ (d.files));
  if (entries.length > limits.files) return null;
  let total = 0;
  /** @type {Record<string, string>} */
  const files = {};
  for (const [path, content] of entries) {
    if (!isSafePreviewPath(path) || typeof content !== "string") return null;
    total += content.length;
    if (total > limits.totalBytes) return null;
    files[path] = content;
  }
  return { session: /** @type {string} */ (d.session), files };
}

/** @param {string} session */
export function cacheName(session) {
  return `ladestack-preview-${session}`;
}

/**
 * Maps a preview URL path to its session and project file: /p/<session>/<file>.
 * A trailing slash or an empty rest means that folder's index.html.
 * @param {string} pathname
 */
export function previewTarget(pathname) {
  const m = /^\/p\/([^/]+)\/(.*)$/.exec(pathname);
  if (!m || !isValidSession(m[1])) return null;
  let file;
  try {
    file = decodeURIComponent(m[2]);
  } catch {
    return null;
  }
  if (file === "" || file.endsWith("/")) file += "index.html";
  return isSafePreviewPath(file) ? { session: m[1], file } : null;
}

/**
 * Headers on every file the preview serves for a project. frame-ancestors checks the whole chain
 * (project page <- host page <- builder), so it lists this origin and the builder origins.
 * @param {string} path
 * @param {string[]} parents
 */
export function fileHeaders(path, parents) {
  return {
    "content-type": contentTypeFor(path),
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
    "content-security-policy": `frame-ancestors 'self' ${parents.join(" ")}`.trim(),
  };
}
