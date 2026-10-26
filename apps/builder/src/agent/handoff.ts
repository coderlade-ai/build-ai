/**
 * Hands a Code-mode prompt from the welcome composer to the new project's workspace.
 * Kept in this tab's sessionStorage only, and removed as soon as the workspace takes it,
 * so a reload never re-runs the agent.
 */
const prefix = "ladestack.agentTask.";

type Storage = Pick<globalThis.Storage, "getItem" | "setItem" | "removeItem">;

export function setPendingTask(
  projectId: string,
  prompt: string,
  storage: Storage = sessionStorage,
) {
  storage.setItem(prefix + projectId, prompt);
}

export function takePendingTask(
  projectId: string,
  storage: Storage = sessionStorage,
): string | null {
  try {
    const task = storage.getItem(prefix + projectId);
    storage.removeItem(prefix + projectId);
    return task?.trim() ? task : null;
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
