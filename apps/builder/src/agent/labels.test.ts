import { describe, expect, it } from "vitest";
import { agentStrings } from "../i18n/agent";
import { toolLabel } from "./labels";
import type { ToolResult } from "./tools";

const a = agentStrings.en;
const r = (name: string, isError: boolean, path?: string, declined?: boolean): ToolResult => ({
  call: { id: "1", name, args: {} },
  output: "",
  isError,
  path,
  declined,
});

describe("toolLabel", () => {
  it("never shows a failed step as done", () => {
    expect(toolLabel(a, r("list_files", true))).toBe("Couldn't list files");
    expect(toolLabel(a, r("read_file", true, "a.ts"))).toBe("Couldn't read a.ts");
    expect(toolLabel(a, r("write_file", true, "a.ts"))).toBe("Couldn't change a.ts");
    expect(toolLabel(a, r("check_preview", true))).toMatch(/Couldn't check the preview/);
    expect(toolLabel(a, r("mystery", false))).toBe("Couldn't change ?");
  });

  it("labels successes and declines", () => {
    expect(toolLabel(a, r("list_files", false))).toBe("Listed files");
    expect(toolLabel(a, r("check_preview", false))).toBe("Checked the preview");
    expect(toolLabel(a, r("write_file", false, "a.ts"))).toBe("Wrote a.ts");
    expect(toolLabel(a, r("delete_file", true, "a.ts", true))).toBe("You declined deleting a.ts");
  });
});
