import { isSafeProjectPath } from "../templates/validate";

/** Tools the Code-mode agent may call (PRD A.15). Read and write only: no delete, run or install yet. */
export interface ToolSpec {
  name: ToolName;
  description: string;
  /** JSON Schema for the arguments; `null` when the tool takes none. */
  parameters: { type: "object"; properties: Record<string, unknown>; required: string[] } | null;
}

export const toolNames = ["list_files", "read_file", "write_file"] as const;
export type ToolName = (typeof toolNames)[number];

export const agentTools: ToolSpec[] = [
  {
    name: "list_files",
    description: "List every file in the project with its size in bytes.",
    parameters: null,
  },
  {
    name: "read_file",
    description: "Read a project file as UTF-8 text.",
    parameters: {
      type: "object",
      properties: {
        path: { type: "string", description: "Project-relative path, e.g. src/App.tsx" },
      },
      required: ["path"],
    },
  },
  {
    name: "write_file",
    description:
      "Create a file or replace its whole content. Always send the complete file, never a fragment or diff.",
    parameters: {
      type: "object",
      properties: {
        path: { type: "string", description: "Project-relative path, e.g. src/App.tsx" },
        content: { type: "string", description: "The complete new file content." },
      },
      required: ["path", "content"],
    },
  },
];

export interface ToolCall {
  id: string;
  name: string;
  args: unknown;
}

export interface ToolResult {
  call: ToolCall;
  output: string;
  isError: boolean;
  /** For the activity log: which file a read/write touched. */
  path?: string;
}

/** The storage the agent works through; satisfied by ProjectStore. */
export interface AgentFs {
  listFiles(projectId: string): Promise<{ path: string; size: number; revision: string }[]>;
  readFile(
    projectId: string,
    path: string,
  ): Promise<{ file: { revision: string }; content: string } | undefined>;
  writeFile(
    projectId: string,
    path: string,
    content: string,
    baseRevision: string | null,
  ): Promise<{ ok: true } | { ok: false; reason: string }>;
}

export const maxWriteBytes = 2 * 1024 * 1024; // same per-file cap as ZIP import
export const maxProjectFiles = 2000;
const maxReadChars = 200_000;

const byteLength = (s: string) => new TextEncoder().encode(s).length;
const fail = (call: ToolCall, output: string, path?: string): ToolResult => ({
  call,
  output,
  isError: true,
  path,
});

function stringArg(args: unknown, key: string): string | undefined {
  const v = (args as Record<string, unknown> | null)?.[key];
  return typeof v === "string" ? v : undefined;
}

/**
 * Runs one validated tool call against the project. Every argument is checked here, in app
 * code, never trusted from the model (PRD: permissions enforced by code, not prompts).
 */
export async function runTool(fs: AgentFs, projectId: string, call: ToolCall): Promise<ToolResult> {
  switch (call.name) {
    case "list_files": {
      const files = await fs.listFiles(projectId);
      const output = files.length
        ? files.map((f) => `${f.path} (${f.size} bytes)`).join("\n")
        : "(no files)";
      return { call, output, isError: false };
    }
    case "read_file": {
      const path = stringArg(call.args, "path");
      if (!path || !isSafeProjectPath(path)) return fail(call, "Invalid path.", path);
      const read = await fs.readFile(projectId, path);
      if (!read) return fail(call, `File not found: ${path}`, path);
      const output =
        read.content.length > maxReadChars
          ? `${read.content.slice(0, maxReadChars)}\n[truncated: file is ${read.content.length} characters]`
          : read.content;
      return { call, output, isError: false, path };
    }
    case "write_file": {
      const path = stringArg(call.args, "path");
      const content = stringArg(call.args, "content");
      if (!path || !isSafeProjectPath(path))
        return fail(
          call,
          "Invalid path. Use a relative path; secrets files, .git and node_modules are not allowed.",
          path,
        );
      if (content === undefined) return fail(call, "Missing content.", path);
      if (content.includes("\0")) return fail(call, "Binary content is not allowed.", path);
      if (byteLength(content) > maxWriteBytes) return fail(call, "File is larger than 2 MB.", path);
      const existing = await fs.readFile(projectId, path);
      if (!existing && (await fs.listFiles(projectId)).length >= maxProjectFiles)
        return fail(call, `Project already has ${maxProjectFiles} files.`, path);
      if (existing?.content === content)
        return { call, output: `Unchanged: ${path}`, isError: false, path };
      const result = await fs.writeFile(projectId, path, content, existing?.file.revision ?? null);
      if (!result.ok)
        return fail(
          call,
          result.reason === "conflict"
            ? "The file changed while writing. Read it again, then retry."
            : "Write failed.",
          path,
        );
      return { call, output: `${existing ? "Updated" : "Created"} ${path}`, isError: false, path };
    }
    default:
      return fail(call, `Unknown tool: ${call.name}`);
  }
}
