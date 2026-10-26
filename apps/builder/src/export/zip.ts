import { strToU8, zipSync, type Zippable } from "fflate";
import { isSafeProjectPath } from "../templates/validate";

export interface ExportFile {
  path: string;
  content: string;
}

// A fixed timestamp makes the same project always produce the same archive bytes.
const fixedDate = new Date("2026-01-01T00:00:00Z");

/**
 * Packs project files into a ZIP (PRD export). Refuses unsafe or duplicate paths so a
 * corrupted store can never produce an archive that writes outside its folder when unpacked.
 */
export function buildProjectZip(files: ExportFile[]): Uint8Array {
  if (files.length === 0) throw new Error("Nothing to export");
  const tree: Zippable = {};
  const seen = new Set<string>();
  for (const { path, content } of files) {
    if (!isSafeProjectPath(path)) throw new Error(`Unsafe path: ${path}`);
    if (seen.has(path)) throw new Error(`Duplicate path: ${path}`);
    seen.add(path);
    tree[path] = [strToU8(content), { mtime: fixedDate }];
  }
  return zipSync(tree, { level: 6 });
}

/** A download name from the project name: readable, filesystem-safe, never empty. */
export function zipFileName(projectName: string): string {
  const slug = projectName
    .normalize("NFKD")
    .replace(/([A-Za-z])[\u0300-\u036f]+/g, "$1") // café -> cafe, but keep non-Latin letters intact
    .normalize("NFC")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/, "");
  return `${slug || "project"}.zip`;
}

/** Hands the archive to the browser as a download; nothing leaves the device. */
export function downloadZip(bytes: Uint8Array, fileName: string): void {
  const url = URL.createObjectURL(new Blob([bytes], { type: "application/zip" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
