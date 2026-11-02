import type { AgentStrings } from "../i18n/agent";
import type { ToolResult } from "./tools";

/**
 * The log line for one tool step. A failed step never reads as done (ERR-04): each tool has its
 * own failure wording, and a preview that could not be checked says it is a preview problem,
 * not the model's (ERR-03).
 */
export function toolLabel(a: AgentStrings, r: ToolResult): string {
  const p = r.path ?? "?";
  if (r.declined) return a.declined.replace("{path}", p);
  if (r.isError) {
    const failed: Record<string, string> = {
      list_files: a.listFailed,
      read_file: a.readFailed,
      check_preview: a.previewFailed,
    };
    return (failed[r.call.name] ?? a.toolFailed).replace("{path}", p);
  }
  const done: Record<string, string> = {
    list_files: a.listed,
    check_preview: a.checkedPreview,
    read_file: a.read,
    write_file: a.wrote,
    delete_file: a.deleted,
  };
  return (done[r.call.name] ?? a.toolFailed).replace("{path}", p);
}
