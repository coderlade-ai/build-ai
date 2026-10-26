/** What the preview can show for a project, from its file paths. */
export type PreviewKind = "static" | "needs-runtime" | "no-entry";

export function previewKind(paths: string[]): PreviewKind {
  if (paths.includes("package.json")) return "needs-runtime";
  return paths.includes("index.html") ? "static" : "no-entry";
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
