/** Monaco language id for a project path. Unknown types open as plain text. */
const byExtension: Record<string, string> = {
  html: "html",
  htm: "html",
  css: "css",
  scss: "scss",
  less: "less",
  js: "javascript",
  mjs: "javascript",
  cjs: "javascript",
  jsx: "javascript",
  ts: "typescript",
  mts: "typescript",
  cts: "typescript",
  tsx: "typescript",
  json: "json",
  md: "markdown",
  mdx: "markdown",
  yml: "yaml",
  yaml: "yaml",
  xml: "xml",
  svg: "xml",
  py: "python",
};

export function languageForPath(path: string): string {
  const name = path.slice(path.lastIndexOf("/") + 1).toLowerCase();
  const dot = name.lastIndexOf(".");
  if (dot <= 0) return "plaintext";
  return byExtension[name.slice(dot + 1)] ?? "plaintext";
}

/** Where the self-hosted Monaco AMD bundle is served (copied by scripts/copy-monaco.mjs). */
export const monacoBasePath = "/app/monaco/vs";
