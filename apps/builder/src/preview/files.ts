/** What the preview can show for a project, from its file paths. */
export type PreviewKind = "static" | "bundle" | "no-entry";

/** package.json projects are bundled on the preview origin (experimental, ADR 0018). */
export function previewKind(paths: string[]): PreviewKind {
  if (!paths.includes("index.html")) return "no-entry";
  return paths.includes("package.json") ? "bundle" : "static";
}

/** An unguessable id for this tab's preview cache on the preview origin. */
export function newPreviewSession(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(18));
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export const previewMessages = {
  ready: "ladestack:preview-ready",
  files: "ladestack:preview-files",
  loaded: "ladestack:preview-loaded",
  log: "ladestack:preview-log",
} as const;

/**
 * Address of the project page itself on the preview origin, for "Open in new tab". The service
 * worker serves it from the files this session stored, so reloading that tab shows the latest
 * saved files; it stops working once another project is previewed.
 */
export function previewPageUrl(origin: string, session: string): string {
  return `${origin.replace(/\/+$/, "")}/p/${encodeURIComponent(session)}/index.html`;
}
