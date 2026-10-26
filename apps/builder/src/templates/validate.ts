/** Checks that apply to any starter template before it can be offered (PRD A.12, R-09, R-17). */

const forbiddenSegments = new Set(["", ".", "..", ".git", "node_modules"]);

/** A logical project path: relative, forward slashes, no traversal, no hidden secrets files. */
export function isSafeProjectPath(path: string): boolean {
  if (path.length === 0 || path.length > 240) return false;
  if (path.startsWith("/") || path.includes("\\") || path.includes("\0")) return false;
  const segments = path.split("/");
  if (segments.some((s) => forbiddenSegments.has(s))) return false;
  const base = segments[segments.length - 1]!;
  return !/^\.env(\..*)?$/.test(base) || base === ".env.example";
}

/** npm lifecycle scripts that run during install; templates must never ship them. */
export const installHooks = ["preinstall", "install", "postinstall", "prepare", "prepublish"];

export interface TemplateIssue {
  path: string;
  problem: string;
}

export function validateTemplateFiles(files: Record<string, string>): TemplateIssue[] {
  const issues: TemplateIssue[] = [];
  for (const path of Object.keys(files)) {
    if (!isSafeProjectPath(path)) issues.push({ path, problem: "unsafe path" });
  }
  const manifest = files["package.json"];
  if (manifest !== undefined) {
    try {
      const pkg = JSON.parse(manifest) as { scripts?: Record<string, string> };
      for (const hook of installHooks) {
        if (pkg.scripts?.[hook] !== undefined)
          issues.push({ path: "package.json", problem: `install hook "${hook}"` });
      }
    } catch {
      issues.push({ path: "package.json", problem: "invalid JSON" });
    }
  }
  return issues;
}
