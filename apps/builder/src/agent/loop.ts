import { ProviderStreamError, type StreamError } from "../providers/stream";
import type { Conversation, StepDelta } from "./adapters";
import { runTool, type AgentFs, type ToolContext, type ToolResult } from "./tools";

export type AgentEvent = { type: "text"; text: string } | { type: "tool"; result: ToolResult };

export type AgentOutcome =
  | { reason: "done" }
  | { reason: "stopped" }
  | { reason: "max-steps"; steps: number }
  | { reason: "error"; code: StreamError };

export const defaultMaxSteps = 25;

/**
 * The agent loop (PRD A.15/A.16): ask the model, run the tools it calls, feed results back,
 * until it answers without tools, the user stops it, or the step budget runs out.
 * Every write is saved as it happens, so stopping never loses finished work.
 */
export async function runAgent(o: {
  conversation: Conversation;
  fs: AgentFs;
  projectId: string;
  signal?: AbortSignal;
  maxSteps?: number;
  onEvent: (e: AgentEvent) => void;
  approve?: ToolContext["approve"];
  mode?: ToolContext["mode"];
  checkPreview?: ToolContext["checkPreview"];
  /** Streams each turn and reports progress (live text, files being written). */
  onDelta?: (d: StepDelta) => void;
}): Promise<AgentOutcome> {
  const maxSteps = o.maxSteps ?? defaultMaxSteps;
  for (let step = 0; step < maxSteps; step++) {
    if (o.signal?.aborted) return { reason: "stopped" };
    let result;
    try {
      result = await o.conversation.step(o.signal, o.onDelta);
    } catch (e) {
      const code = e instanceof ProviderStreamError ? e.code : "unexpected";
      return code === "aborted" ? { reason: "stopped" } : { reason: "error", code };
    }
    if (result.text.trim()) o.onEvent({ type: "text", text: result.text.trim() });
    if (result.calls.length === 0) return { reason: "done" };
    const results: ToolResult[] = [];
    for (const call of result.calls) {
      if (o.signal?.aborted) return { reason: "stopped" };
      let r: ToolResult;
      try {
        r = await runTool(o.fs, o.projectId, call, {
          approve: o.approve,
          mode: o.mode,
          checkPreview: o.checkPreview,
        });
      } catch {
        r = { call, output: "Tool failed unexpectedly.", isError: true };
      }
      o.onEvent({ type: "tool", result: r });
      results.push(r);
    }
    o.conversation.addResults(results);
  }
  return { reason: "max-steps", steps: maxSteps };
}

export const codeSystemPrompt = [
  "You are the Code mode agent of LadeStack Build, a browser-based builder for websites and web apps.",
  "You work on the user's current project through tools: list_files, read_file, write_file, delete_file and check_preview.",
  "Only delete files when the task needs it; the user approves each deletion and may decline.",
  "If the project is empty, create a React + TypeScript + Vite app (package.json, index.html, src/main.tsx, src/App.tsx) unless the user asks for plain HTML.",
  "Start by listing files, read what you need before changing it, and write complete files (never fragments).",
  "Keep the project runnable: for React/Vite keep package.json, index.html and src consistent; for static sites keep index.html, CSS and JS linked.",
  'Call check_preview after writing files and fix the errors it reports. React/Vite projects are previewed by an experimental in-browser bundler: npm packages listed in package.json load from esm.sh, there is no npm install, dev server or Vite plugins, and the entry must be a <script type="module"> in index.html. For Tailwind CSS, put @import "tailwindcss"; (v4 syntax, @theme to customise) in a CSS file the app imports; tailwind.config.js and PostCSS plugins are not applied. You cannot run commands: never claim you ran or tested something you did not. Never write .env files or API keys.',
  "Do only what the user asked. When finished, reply with a short summary of the files you changed, in the user's language.",
].join(" ");

export const planSystemPrompt = [
  "You are the Plan mode agent of LadeStack Build, a browser-based builder for websites and web apps.",
  "Plan mode is read-only: you can only use list_files and read_file. Never try to write or delete files.",
  "Start by listing files and read what matters. If the project is empty, plan a React + TypeScript + Vite app unless the user asks for plain HTML.",
  "Reply with a concise implementation plan in the user's language: the goal, the files to create or change (with paths) and what each will contain, and any open questions.",
  "Do not write the full code. You cannot run commands or preview: never claim you did.",
].join(" ");

/** The Code-mode task that builds an approved plan. */
export function buildFromPlanPrompt(request: string, plan: string): string {
  return `Implement this plan for my request.\n\nRequest:\n${request}\n\nPlan:\n${plan}`;
}

export const debugSystemPrompt = [
  "You are the Debug mode agent of LadeStack Build, a browser-based builder for websites and web apps.",
  "Debug mode is read-only: you can only use list_files, read_file and check_preview. Never try to write or delete files.",
  "check_preview loads the page and returns its console output, including build errors; use it to see real errors. React/Vite projects are bundled in the browser with packages from esm.sh, not run by Vite, so tooling-only problems may not show. You cannot run a terminal: otherwise work from the error, symptom or behaviour the user describes and from the source files. Console messages the user includes are real observations of the running page.",
  "List files, read the ones involved, and find the most likely cause. Reply in the user's language with: the cause (with file paths and what is wrong), the smallest fix, and how the user can check it. If you are not sure, say what is uncertain.",
  "Do not write the full code and never claim you ran or tested anything.",
].join(" ");

/** The Code-mode task that applies a diagnosed fix. */
export function applyFixPrompt(problem: string, diagnosis: string): string {
  return `Apply the smallest fix for this problem, based on the diagnosis.\n\nProblem:\n${problem}\n\nDiagnosis:\n${diagnosis}`;
}
