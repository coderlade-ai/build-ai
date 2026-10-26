// Experimental preview for package.json projects (ADR 0018): bundles the project's own source with
// esbuild-wasm on the preview origin and loads npm packages as ES modules from esm.sh. This is not
// a Node runtime: no npm install, no dev server, no Vite plugins.

export const packageCdn = "https://esm.sh";
export const bundleDir = "__ladestack";

const extensions = [".tsx", ".ts", ".jsx", ".js", ".mjs", ".json", ".css"];
const loaders = {
  ts: "ts",
  tsx: "tsx",
  js: "jsx",
  jsx: "jsx",
  mjs: "js",
  cjs: "js",
  json: "json",
  css: "css",
  svg: "dataurl",
  txt: "text",
  md: "text",
};

/** @param {string} html */
export function findModuleEntry(html) {
  for (const m of html.matchAll(/<script\b([^>]*)>\s*<\/script>/gi)) {
    const attrs = m[1] ?? "";
    if (!/\btype\s*=\s*["']?module["']?/i.test(attrs)) continue;
    const src = /\bsrc\s*=\s*["']([^"']+)["']/i.exec(attrs)?.[1];
    if (!src || /^[a-z][a-z0-9+.-]*:|^\/\//i.test(src)) continue;
    return { tag: m[0], path: src.replace(/^\.?\//, "").split(/[?#]/)[0] };
  }
  return null;
}

/** "@scope/pkg/sub" -> { name: "@scope/pkg", sub: "/sub" } @param {string} spec */
export function splitPackage(spec) {
  const parts = spec.split("/");
  const n = spec.startsWith("@") ? 2 : 1;
  return {
    name: parts.slice(0, n).join("/"),
    sub: parts.length > n ? `/${parts.slice(n).join("/")}` : "",
  };
}

/**
 * Maps a bare import to an esm.sh URL using the version range from package.json.
 * @param {string} spec
 * @param {Record<string, string>} deps
 * @returns {{ url: string } | { error: string }}
 */
export function packageUrl(spec, deps) {
  if (spec.startsWith("node:"))
    return { error: `"${spec}" is a Node built-in; the preview runs in the browser.` };
  const { name, sub } = splitPackage(spec);
  if (!/^(@[a-z0-9._~-]+\/)?[a-z0-9._~-]+$/i.test(name))
    return { error: `"${spec}" is not a valid package name.` };
  const range = deps[name];
  if (!range)
    return { error: `"${name}" is imported but not listed in package.json dependencies.` };
  if (!/^[\w.^~<>=|* -]+$/.test(range) || /^(workspace|file|link|git|https?):/.test(range))
    return { error: `"${name}@${range}" isn't a registry version the preview can load.` };
  return { url: `${packageCdn}/${name}@${range.replace(/\s+/g, "")}${sub}` };
}

/** @param {string} from @param {string} spec */
function joinPath(from, spec) {
  const base = spec.startsWith("/") ? [] : from.split("/").slice(0, -1);
  for (const part of spec.replace(/^\//, "").split("/")) {
    if (part === "" || part === ".") continue;
    if (part === "..") base.pop();
    else base.push(part);
  }
  return base.join("/");
}

/** @param {Record<string, string>} files @param {string} path */
export function resolveLocal(files, path) {
  const candidates = [
    path,
    ...extensions.map((e) => path + e),
    ...extensions.map((e) => `${path}/index${e}`),
  ];
  return candidates.find((c) => c in files) ?? null;
}

/** @param {string} s */
const escapeHtml = (s) => s.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);

const tailwindDirective =
  /@import\s+(url\()?["']tailwindcss["']|@tailwind\s+(base|components|utilities)\b/;

/** Whether a stylesheet is Tailwind source (v4 `@import "tailwindcss"` or v3 `@tailwind`). @param {string} css */
export function isTailwindCss(css) {
  return tailwindDirective.test(css);
}

/**
 * Turns Tailwind source into what the browser compiler reads: the v3 directives become one v4
 * import, and v4 `@import "tailwindcss"` is kept once.
 * @param {string} css
 */
export function toTailwindBrowserCss(css) {
  let seen = false;
  return css
    .replace(
      /@tailwind\s+(base|components|utilities)\s*;?|@import\s+(url\()?["']tailwindcss["']\)?[^;]*;?/g,
      () => {
        if (seen) return "";
        seen = true;
        return '@import "tailwindcss";';
      },
    )
    .replace(/<\/style/gi, "<\\/style");
}

/** A page shown in the preview when the build fails. @param {string[]} errors */
export function errorPage(errors) {
  return `<!doctype html><html><head><meta charset="utf-8"><title>Build failed</title></head><body style="font:14px ui-monospace,monospace;margin:24px;color:#26251e"><h1 style="font:600 16px system-ui">The preview couldn't build this project</h1><pre style="white-space:pre-wrap">${escapeHtml(errors.join("\n\n"))}</pre></body></html>`;
}

/**
 * Bundles a package.json project for the preview.
 * @param {{ build: Function }} esbuild an initialized esbuild(-wasm) module
 * @param {Record<string, string>} files
 * @param {{ tailwindScript?: () => Promise<string> }} [options] loads the self-hosted Tailwind
 *   browser compiler, used only when a stylesheet is Tailwind source
 * @returns {Promise<{ ok: true, files: Record<string, string> } | { ok: false, errors: { text: string, where: string }[] }>}
 */
export async function bundleProject(esbuild, files, options = {}) {
  const fail = (text, where = "") => ({
    ok: /** @type {const} */ (false),
    errors: [{ text, where }],
  });
  let pkg;
  try {
    pkg = JSON.parse(files["package.json"] ?? "");
  } catch {
    return fail("package.json is not valid JSON.", "package.json");
  }
  const deps = { ...(pkg?.devDependencies ?? {}), ...(pkg?.dependencies ?? {}) };
  const html = files["index.html"];
  if (html === undefined) return fail("There is no index.html at the project root.");
  const entry = findModuleEntry(html);
  if (!entry)
    return fail('index.html has no <script type="module" src="..."> entry.', "index.html");
  const entryPath = resolveLocal(files, entry.path);
  if (!entryPath) return fail(`The entry ${entry.path} doesn't exist.`, "index.html");

  /** @type {string[]} */
  const cssLinks = [];
  /** Tailwind stylesheets, compiled in the page by @tailwindcss/browser. @type {string[]} */
  const tailwindCss = [];
  const plugin = {
    name: "ladestack-project",
    setup(build) {
      build.onResolve({ filter: /.*/ }, (args) => {
        if (args.kind === "entry-point") return { path: args.path, namespace: "project" };
        const spec = args.path;
        if (/^(https?:)?\/\//.test(spec)) return { path: spec, external: true };
        if (spec.startsWith(".") || spec.startsWith("/")) {
          const found = resolveLocal(files, joinPath(args.importer, spec));
          return found
            ? { path: found, namespace: "project" }
            : { errors: [{ text: `Cannot find "${spec}" from ${args.importer}.` }] };
        }
        const mapped = packageUrl(spec, deps);
        if ("error" in mapped) return { errors: [{ text: mapped.error }] };
        if (spec.endsWith(".css")) {
          cssLinks.push(mapped.url);
          return { path: spec, namespace: "empty" };
        }
        return { path: mapped.url, external: true };
      });
      build.onLoad({ filter: /.*/, namespace: "empty" }, () => ({ contents: "", loader: "js" }));
      build.onLoad({ filter: /.*/, namespace: "project" }, (args) => {
        const ext = args.path.split(".").pop()?.toLowerCase() ?? "";
        const contents = files[args.path] ?? "";
        if (ext === "css" && options.tailwindScript && isTailwindCss(contents)) {
          tailwindCss.push(toTailwindBrowserCss(contents));
          return { contents: "", loader: "js" };
        }
        const loader = args.path.endsWith(".module.css") ? "local-css" : (loaders[ext] ?? "text");
        return { contents, loader, resolveDir: "/" };
      });
    },
  };

  let result;
  try {
    result = await esbuild.build({
      entryPoints: [entryPath],
      bundle: true,
      write: false,
      format: "esm",
      target: "es2020",
      jsx: "automatic",
      outdir: "/out",
      entryNames: "bundle",
      logLevel: "silent",
      define: {
        "process.env.NODE_ENV": '"development"',
        "import.meta.env": JSON.stringify({
          DEV: true,
          PROD: false,
          MODE: "development",
          BASE_URL: "/",
          SSR: false,
        }),
      },
      plugins: [plugin],
    });
  } catch (e) {
    const errors =
      /** @type {{ errors?: { text: string, location?: { file: string, line: number, column: number } }[] }} */ (
        e
      ).errors;
    if (!errors?.length) return fail(String(e));
    return {
      ok: false,
      errors: errors.slice(0, 20).map((m) => ({
        text: m.text,
        where: m.location
          ? `${m.location.file.replace(/^project:/, "")}:${m.location.line}:${m.location.column + 1}`
          : "",
      })),
    };
  }

  /** @type {Record<string, string>} */
  const out = {};
  // Vite serves public/ at the site root.
  for (const [path, content] of Object.entries(files))
    out[path.startsWith("public/") ? path.slice("public/".length) : path] = content;
  let css = "";
  for (const f of result.outputFiles) {
    const name = f.path.split("/").pop();
    if (name === "bundle.js") out[`${bundleDir}/bundle.js`] = f.text;
    if (name === "bundle.css") {
      out[`${bundleDir}/bundle.css`] = f.text;
      css = `<link rel="stylesheet" href="/${bundleDir}/bundle.css">`;
    }
  }
  let links = cssLinks.map((u) => `<link rel="stylesheet" href="${escapeHtml(u)}">`).join("");
  if (tailwindCss.length && options.tailwindScript) {
    out[`${bundleDir}/tailwind.js`] = await options.tailwindScript();
    links += `<style type="text/tailwindcss">${tailwindCss.join("\n")}</style><script src="/${bundleDir}/tailwind.js"></script>`;
  }
  let page = html.replace(
    entry.tag,
    `<script type="module" src="/${bundleDir}/bundle.js"></script>`,
  );
  const head = /<\/head>/i.exec(page);
  page = head
    ? page.slice(0, head.index) + links + css + page.slice(head.index)
    : links + css + page;
  out["index.html"] = page;
  return { ok: true, files: out };
}
