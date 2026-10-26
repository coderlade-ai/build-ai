// Pure helpers shared by the preview host page and its service worker (ADR 0016).

export const messageTypes = {
  ready: "ladestack:preview-ready",
  files: "ladestack:preview-files",
  loaded: "ladestack:preview-loaded",
  log: "ladestack:preview-log",
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

export const logLevels = ["error", "warn", "info", "log"];
export const logLimits = { text: 2000, where: 300, perLoad: 200 };

/**
 * Validates a console message from a project page before it is forwarded to the builder.
 * @param {unknown} data
 * @returns {{ level: string, text: string, where: string } | null}
 */
export function parseLogMessage(data) {
  if (!data || typeof data !== "object") return null;
  const d = /** @type {Record<string, unknown>} */ (data);
  if (d.type !== messageTypes.log || !logLevels.includes(/** @type {string} */ (d.level)))
    return null;
  if (typeof d.text !== "string" || typeof (d.where ?? "") !== "string") return null;
  return {
    level: /** @type {string} */ (d.level),
    text: d.text.slice(0, logLimits.text),
    where: /** @type {string} */ (d.where ?? "").slice(0, logLimits.where),
  };
}

/**
 * Runs first in every project page: forwards console output, uncaught errors, failed loads and
 * unhandled rejections to the host page (same origin), at most logLimits.perLoad per page load.
 */
export const consoleBridge = `(function () {
  var sent = 0, host = window.parent;
  function str(v) {
    try {
      if (v instanceof Error) return v.stack || String(v);
      if (v && typeof v === "object") return JSON.stringify(v);
      return String(v);
    } catch (e) {
      return String(v);
    }
  }
  function send(level, args, where) {
    if (host === window || sent++ >= ${logLimits.perLoad}) return;
    var text = Array.prototype.map.call(args, str).join(" ").slice(0, ${logLimits.text});
    try {
      host.postMessage({ type: "${messageTypes.log}", level: level, text: text, where: where || "" }, location.origin);
    } catch (e) {}
  }
  ["error", "warn", "info", "log"].forEach(function (level) {
    var original = console[level];
    console[level] = function () {
      send(level, arguments);
      return original.apply(console, arguments);
    };
  });
  addEventListener("error", function (e) {
    var t = e.target;
    if (t && t !== window && (t.src || t.href)) return send("error", ["Failed to load " + (t.src || t.href)]);
    send("error", [e.error || e.message], e.filename ? e.filename + ":" + e.lineno : "");
  }, true);
  addEventListener("unhandledrejection", function (e) {
    send("error", ["Unhandled promise rejection:", e.reason]);
  });
})();`;

/**
 * Puts the console bridge first in an HTML document: right after <head>, else after <html>,
 * else at the very start.
 * @param {string} html
 */
export function injectBridge(html) {
  const tag = `<script data-ladestack-preview>${consoleBridge}</script>`;
  const at = /<head(\s[^>]*)?>/i.exec(html) ?? /<html(\s[^>]*)?>/i.exec(html);
  if (!at) return tag + html;
  const end = at.index + at[0].length;
  return html.slice(0, end) + tag + html.slice(end);
}

/**
 * Makes a log location readable: "/p/<session>/src/app.js:3" (full URL) becomes "src/app.js:3".
 * @param {string} where
 * @param {string} origin
 * @param {string} session
 */
export function shortWhere(where, origin, session) {
  const prefix = `${origin}/p/${session}/`;
  const out = where.startsWith(prefix) ? where.slice(prefix.length) : where;
  return out.replace(/\?v=\d+/, "");
}
