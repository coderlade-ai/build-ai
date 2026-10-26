import type { PreviewLog } from "./console";

/** What the agent's check_preview tool reports (English; it goes to the model, not the UI). */
export function formatPreviewReport(logs: PreviewLog[]): string {
  if (!logs.length) return "The page loaded. The console is empty: no errors or warnings.";
  const count = (lv: PreviewLog["level"][]) => logs.filter((l) => lv.includes(l.level)).length;
  const errors = count(["error"]);
  const warnings = count(["warn"]);
  const other = logs.length - errors - warnings;
  let out = `The page loaded. Console: ${errors} error(s), ${warnings} warning(s), ${other} other message(s).\n`;
  // Errors and warnings first, then the rest, newest kept when trimming.
  const ordered = [
    ...logs.filter((l) => l.level === "error" || l.level === "warn"),
    ...logs.filter((l) => l.level === "info" || l.level === "log"),
  ].slice(0, 50);
  for (const l of ordered) {
    const line = `[${l.level}] ${l.text.split("\n").slice(0, 6).join("\n  ")}${l.where ? ` (${l.where})` : ""}\n`;
    if (out.length + line.length > 6000) {
      out += "(more messages omitted)\n";
      break;
    }
    out += line;
  }
  return out.trimEnd();
}

type Availability = { ok: true } | { ok: false; reason: string };

/**
 * Lets the agent load the live preview and read its console (tool check_preview). The Preview
 * component registers how to reload and reports loads and console messages here.
 */
export class PreviewController {
  private availability: Availability = { ok: false, reason: "The preview is not open." };
  private reloader: (() => void) | null = null;
  private logs: PreviewLog[] = [];
  private waiting: (() => void) | null = null;

  constructor(
    // package.json projects build first and fetch packages, so allow longer than a static page.
    private readonly timing = { loadTimeoutMs: 20_000, settleMs: 1_500 },
    private readonly sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms)),
  ) {}

  /** Called by Preview whenever what it can show changes. */
  attach(availability: Availability, reload: (() => void) | null) {
    this.availability = availability;
    this.reloader = reload;
  }

  detach() {
    this.availability = { ok: false, reason: "The preview is not open." };
    this.reloader = null;
  }

  /** Files were sent for a fresh load: the console starts over. */
  filesSent() {
    this.logs = [];
  }

  loaded() {
    this.waiting?.();
    this.waiting = null;
  }

  log(entry: PreviewLog) {
    this.logs.push(entry);
    if (this.logs.length > 200) this.logs.shift();
  }

  /** Reloads the preview with the saved files, waits for it to settle, and reports the console. */
  async check(): Promise<string> {
    if (!this.availability.ok) return this.availability.reason;
    if (!this.reloader) return "The preview is not open.";
    const loaded = new Promise<boolean>((resolve) => {
      this.waiting = () => resolve(true);
      void this.sleep(this.timing.loadTimeoutMs).then(() => resolve(false));
    });
    this.reloader();
    if (!(await loaded)) {
      this.waiting = null;
      return "The preview did not finish loading within 20 seconds.";
    }
    await this.sleep(this.timing.settleMs);
    return formatPreviewReport(this.logs);
  }
}
