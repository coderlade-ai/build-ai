import type { ChatImage } from "../providers/stream";

/**
 * Hands a Code- or Plan-mode prompt from the welcome composer to the new project's workspace.
 * Kept in this tab's sessionStorage only, and removed as soon as the workspace takes it,
 * so a reload never re-runs the agent.
 */
const prefix = "ladestack.agentTask.";

type Storage = Pick<globalThis.Storage, "getItem" | "setItem" | "removeItem">;

export interface PendingTask {
  mode: "code" | "plan";
  prompt: string;
  /** Attached images. Too large for sessionStorage, so they stay in this tab's memory only. */
  images?: ChatImage[];
}

const pendingImages = new Map<string, ChatImage[]>();

export function setPendingTask(
  projectId: string,
  task: PendingTask,
  storage: Storage = sessionStorage,
) {
  const { images, ...rest } = task;
  if (images?.length) pendingImages.set(projectId, images);
  else pendingImages.delete(projectId);
  storage.setItem(prefix + projectId, JSON.stringify(rest));
}

/** Taken once. A plain string (older tabs) is read as a Code-mode prompt. */
export function takePendingTask(
  projectId: string,
  storage: Storage = sessionStorage,
): PendingTask | null {
  const images = pendingImages.get(projectId);
  pendingImages.delete(projectId);
  try {
    const raw = storage.getItem(prefix + projectId);
    storage.removeItem(prefix + projectId);
    if (!raw?.trim()) return null;
    let task: PendingTask = { mode: "code", prompt: raw };
    try {
      const parsed: unknown = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        const p = parsed as Partial<PendingTask>;
        if (typeof p.prompt !== "string") return null;
        task = { mode: p.mode === "plan" ? "plan" : "code", prompt: p.prompt };
      }
    } catch {
      // Not JSON: a plain prompt.
    }
    if (!task.prompt.trim()) return null;
    return images?.length ? { ...task, images } : task;
  } catch {
    return null;
  }
}

/** A readable project name from the first line of the prompt. */
export function projectNameFromPrompt(prompt: string, max = 48): string {
  const line = prompt.trim().split(/\r?\n/, 1)[0]!.replace(/\s+/g, " ");
  const chars = Array.from(line);
  return chars.length > max
    ? `${chars
        .slice(0, max - 1)
        .join("")
        .trimEnd()}…`
    : line;
}
