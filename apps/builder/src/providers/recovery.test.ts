import { describe, expect, it } from "vitest";
import { recoveryFor } from "./recovery";

describe("recoveryFor", () => {
  it("offers a retry for passing problems", () => {
    for (const c of [
      "rate-limit",
      "unavailable",
      "network",
      "timeout",
      "interrupted",
      "unexpected",
    ] as const)
      expect(recoveryFor(c)).toEqual({ retry: true, setup: false });
  });
  it("sends key and model problems to the provider settings", () => {
    for (const c of ["invalid-key", "no-models", "rejected"] as const)
      expect(recoveryFor(c)).toEqual({ retry: false, setup: true });
    expect(recoveryFor("billing")).toEqual({ retry: true, setup: true });
  });
  it("offers nothing after the user stopped the run", () => {
    expect(recoveryFor("aborted")).toEqual({ retry: false, setup: false });
  });
});
