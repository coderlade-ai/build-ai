/**
 * Canonical contracts for LadeStack Build (ADR 0006).
 * These are type definitions only; no behaviour is implemented here.
 */

export type ProjectId = string;
export type FileId = string;
export type RevisionId = string;
export type CheckpointId = string;

export type ProjectProfile = "static" | "react-vite" | "unsupported";

export interface Project {
  id: ProjectId;
  name: string;
  profile: ProjectProfile;
  /** Language the user asked the generated project to be written in. */
  outputLanguage: string;
  createdAt: string;
  updatedAt: string;
  headRevision: RevisionId;
}

export interface ProjectFile {
  id: FileId;
  projectId: ProjectId;
  path: string;
  /** SHA-256 of the content, used for de-duplicated storage. */
  contentHash: string;
  size: number;
  revision: RevisionId;
}

/** Lifecycle of a file the agent is writing. "saved" means saved, not built. */
export type FileWriteStatus = "queued" | "generating" | "saving" | "saved" | "failed";

export interface Checkpoint {
  id: CheckpointId;
  projectId: ProjectId;
  label: string;
  createdAt: string;
  reason: "auto-before-ai-edit" | "task-boundary" | "manual" | "before-restore";
  /** path -> contentHash */
  manifest: Record<string, string>;
}

export const agentModes = [
  "code",
  "plan",
  "ask",
  "debug",
  "review",
  "orchestrate",
  "custom",
] as const;
export type AgentMode = (typeof agentModes)[number];

/** Modes included in the public alpha (ADR 0009). */
export const alphaAgentModes: readonly AgentMode[] = ["code", "plan", "ask", "debug"];

export const toolNames = [
  "list_files",
  "read_file",
  "search_code",
  "write_file",
  "apply_patch",
  "rename_file",
  "delete_file",
  "read_diagnostics",
  "install_dependencies",
  "run_command",
  "read_terminal",
  "get_preview_status",
  "capture_preview",
  "create_checkpoint",
  "restore_checkpoint",
  "delegate_task",
  "search_web",
  "export_source_zip",
] as const;
export type ToolName = (typeof toolNames)[number];

export type PermissionDecision = "allow" | "ask" | "deny";
export type PermissionPreset = "manual" | "balanced" | "auto";

/** Approval persistence never exceeds the current session (ADR 0003). */
export interface PersistedApproval {
  tool: ToolName;
  pattern: string;
  scope: "once" | "session";
  grantedAt: string;
}

export interface ToolCall {
  id: string;
  correlationId: string;
  tool: ToolName;
  args: Record<string, unknown>;
  decision: PermissionDecision;
  status: "requested" | "approved" | "denied" | "running" | "completed" | "failed" | "cancelled";
}

export type AgentEventType =
  | "agent.task.started"
  | "agent.task.completed"
  | "agent.task.failed"
  | "agent.task.cancelled"
  | "agent.tool.requested"
  | "agent.tool.approved"
  | "agent.tool.denied"
  | "agent.tool.completed"
  | "project.file.started"
  | "project.file.delta"
  | "project.file.saved"
  | "project.file.failed"
  | "runtime.boot.started"
  | "runtime.boot.ready"
  | "runtime.boot.failed"
  | "runtime.install.started"
  | "runtime.install.progress"
  | "runtime.install.completed"
  | "runtime.install.failed"
  | "runtime.server.ready"
  | "runtime.preview.updated"
  | "runtime.diagnostic"
  | "checkpoint.created"
  | "checkpoint.restore.requested"
  | "checkpoint.restored";

export interface AgentEvent<T = unknown> {
  type: AgentEventType;
  projectId: ProjectId;
  correlationId: string;
  at: string;
  payload: T;
}
