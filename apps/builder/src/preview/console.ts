import { previewMessages } from "./files";

/** One line of the project's console, as the preview origin forwards it. */
export interface PreviewLog {
  level: "error" | "warn" | "info" | "log";
  text: string;
  where: string;
}

const levels = new Set(["error", "warn", "info", "log"]);
export const maxLogs = 200;

/** Validates a forwarded console message (the preview origin is not trusted with shape). */
export function parsePreviewLog(data: unknown): PreviewLog | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (d.type !== previewMessages.log || typeof d.level !== "string" || !levels.has(d.level))
    return null;
  if (typeof d.text !== "string" || typeof d.where !== "string") return null;
  return {
    level: d.level as PreviewLog["level"],
    text: d.text.slice(0, 2000),
    where: d.where.slice(0, 300),
  };
}

/** Appends a log, keeping the newest maxLogs. */
export function appendLog(logs: PreviewLog[], log: PreviewLog): PreviewLog[] {
  const next = [...logs, log];
  return next.length > maxLogs ? next.slice(next.length - maxLogs) : next;
}

/** A Debug-mode task from the preview's errors and warnings (newest 20, about 4,000 characters). */
export function debugPromptFromLogs(lead: string, logs: PreviewLog[]): string | null {
  const problems = logs.filter((l) => l.level === "error" || l.level === "warn").slice(-20);
  if (!problems.length) return null;
  let body = "";
  for (const l of problems) {
    const line = `- [${l.level}] ${l.text.split("\n").slice(0, 6).join("\n  ")}${l.where ? ` (${l.where})` : ""}\n`;
    if (body.length + line.length > 4000) break;
    body += line;
  }
  return `${lead}\n\n${body.trimEnd()}`;
}
