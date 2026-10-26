import { unzipSync } from "fflate";
import type { ProjectProfile } from "@ladestack/shared-types";
import { installHooks, isSafeProjectPath } from "../templates/validate";

/** Hard limits that bound memory use and defeat decompression bombs (PRD archives guard). */
export const importLimits = {
  archiveBytes: 25 * 1024 * 1024,
  fileBytes: 2 * 1024 * 1024,
  totalBytes: 50 * 1024 * 1024,
  files: 2000,
};

export type SkipReason = "ignored" | "secret" | "binary" | "too-large";
export type RejectReason =
  | "archive-too-large"
  | "not-a-zip"
  | "unsafe-path"
  | "too-many-files"
  | "too-large-total"
  | "empty";

export type ImportResult =
  | {
      status: "accepted" | "partial";
      files: Record<string, string>;
      profile: ProjectProfile;
      skipped: { path: string; reason: SkipReason }[];
      installHooks: string[];
    }
  | { status: "rejected"; reason: RejectReason; path?: string };

// Folders and files that are never project source; skipped rather than rejected.
const ignoredSegments = new Set([".git", "node_modules", "__MACOSX", ".next", ".DS_Store"]);
const isSecret = (base: string) => /^\.env(\..*)?$/.test(base) && base !== ".env.example";

/** Raw entry names before any normalisation: catches traversal the decoder might hide. */
function isUnsafeRaw(name: string): boolean {
  return (
    name.startsWith("/") ||
    name.includes("\\") ||
    name.includes("\0") ||
    /^[A-Za-z]:/.test(name) ||
    name.split("/").some((s) => s === ".." || s === ".")
  );
}

/** GitHub-style archives wrap everything in one folder (`repo-main/`); drop it. */
function commonRoot(names: string[]): string {
  const first = names[0]!.split("/");
  if (first.length < 2) return "";
  const root = `${first[0]}/`;
  return names.every((n) => n.startsWith(root)) ? root : "";
}

export function detectProfile(files: Record<string, string>): ProjectProfile {
  const manifest = files["package.json"];
  if (manifest !== undefined) {
    try {
      const pkg = JSON.parse(manifest) as {
        dependencies?: Record<string, string>;
        devDependencies?: Record<string, string>;
      };
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      if (deps.react && deps.vite) return "react-vite";
    } catch {
      return "unsupported";
    }
    return "unsupported";
  }
  return files["index.html"] !== undefined ? "static" : "unsupported";
}

function hooksIn(manifest: string | undefined): string[] {
  if (manifest === undefined) return [];
  try {
    const scripts = (JSON.parse(manifest) as { scripts?: Record<string, unknown> }).scripts ?? {};
    return installHooks.filter((h) => scripts[h] !== undefined);
  } catch {
    return [];
  }
}

/**
 * Reads a ZIP into project files without running or trusting anything in it. Rejects
 * zip-slip paths and oversize archives outright; skips binaries, secrets and dependency
 * folders with a reason for each, so the UI can say exactly what was left out.
 */
export function parseProjectZip(bytes: Uint8Array): ImportResult {
  if (bytes.byteLength > importLimits.archiveBytes)
    return { status: "rejected", reason: "archive-too-large" };

  const skipped: { path: string; reason: SkipReason }[] = [];
  let entries: Record<string, Uint8Array>;
  let unsafe: string | undefined;
  let declaredTotal = 0;
  let count = 0;
  try {
    entries = unzipSync(bytes, {
      filter(file) {
        if (file.name.endsWith("/")) return false; // directory entry
        if (isUnsafeRaw(file.name)) {
          unsafe ??= file.name;
          return false;
        }
        count += 1;
        if (file.name.split("/").some((s) => ignoredSegments.has(s))) return false;
        if (file.originalSize > importLimits.fileBytes) {
          skipped.push({ path: file.name, reason: "too-large" });
          return false;
        }
        declaredTotal += file.originalSize;
        return count <= importLimits.files && declaredTotal <= importLimits.totalBytes;
      },
    });
  } catch {
    return { status: "rejected", reason: "not-a-zip" };
  }
  if (unsafe !== undefined) return { status: "rejected", reason: "unsafe-path", path: unsafe };
  if (count > importLimits.files) return { status: "rejected", reason: "too-many-files" };
  if (declaredTotal > importLimits.totalBytes)
    return { status: "rejected", reason: "too-large-total" };

  const names = Object.keys(entries);
  if (names.length === 0) return { status: "rejected", reason: "empty" };
  const root = commonRoot(names);
  const decoder = new TextDecoder("utf-8", { fatal: true });
  const files: Record<string, string> = {};
  let actualTotal = 0;

  for (const name of names.sort()) {
    const data = entries[name]!;
    const path = name.slice(root.length);
    // Declared sizes can lie; trust only the bytes actually produced.
    actualTotal += data.byteLength;
    if (actualTotal > importLimits.totalBytes)
      return { status: "rejected", reason: "too-large-total" };
    if (data.byteLength > importLimits.fileBytes) {
      skipped.push({ path, reason: "too-large" });
      continue;
    }
    const base = path.slice(path.lastIndexOf("/") + 1);
    if (isSecret(base)) {
      skipped.push({ path, reason: "secret" });
      continue;
    }
    if (!isSafeProjectPath(path)) return { status: "rejected", reason: "unsafe-path", path };
    let text: string;
    try {
      text = decoder.decode(data);
    } catch {
      skipped.push({ path, reason: "binary" });
      continue;
    }
    if (text.includes("\0")) {
      skipped.push({ path, reason: "binary" });
      continue;
    }
    files[path] = text;
  }

  if (Object.keys(files).length === 0) return { status: "rejected", reason: "empty" };
  return {
    status: skipped.length > 0 ? "partial" : "accepted",
    files,
    profile: detectProfile(files),
    skipped: skipped.map((s) => ({
      ...s,
      path: s.path.startsWith(root) ? s.path.slice(root.length) : s.path,
    })),
    installHooks: hooksIn(files["package.json"]),
  };
}

/** Project name from the uploaded file name (`my-site-main.zip` → `my-site-main`). */
export function nameFromArchive(fileName: string, fallback: string): string {
  const base = fileName.replace(/\.zip$/i, "").trim();
  return base.slice(0, 80) || fallback;
}
