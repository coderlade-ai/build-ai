import { describe, expect, it } from "vitest";
import { agentModes, alphaAgentModes, toolNames } from "./index";

describe("canonical contracts", () => {
  it("limits the alpha to Code, Plan, Ask and Debug", () => {
    expect([...alphaAgentModes]).toEqual(["code", "plan", "ask", "debug"]);
    for (const mode of alphaAgentModes) expect(agentModes).toContain(mode);
  });

  it("has unique tool names", () => {
    expect(new Set(toolNames).size).toBe(toolNames.length);
  });
});
