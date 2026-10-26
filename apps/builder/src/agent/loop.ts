import { ProviderStreamError, type StreamError } from "../providers/stream";
import type { Conversation } from "./adapters";
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
}): Promise<AgentOutcome> {
  const maxSteps = o.maxSteps ?? defaultMaxSteps;
  for (let step = 0; step < maxSteps; step++) {
    if (o.signal?.aborted) return { reason: "stopped" };
    let result;
    try {
      result = await o.conversation.step(o.signal);
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
        r = await runTool(o.fs, o.projectId, call, { approve: o.approve });
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
  "You work on the user's current project through tools: list_files, read_file, write_file and delete_file.",
  "Only delete files when the task needs it; the user approves each deletion and may decline.",
  "If the project is empty, create a React + TypeScript + Vite app (package.json, index.html, src/main.tsx, src/App.tsx) unless the user asks for plain HTML.",
  "Start by listing files, read what you need before changing it, and write complete files (never fragments).",
  "Keep the project runnable: for React/Vite keep package.json, index.html and src consistent; for static sites keep index.html, CSS and JS linked.",
  "You cannot run commands, install packages or preview yet: never claim you did. Never write .env files or API keys.",
  "Do only what the user asked. When finished, reply with a short summary of the files you changed, in the user's language.",
].join(" ");
