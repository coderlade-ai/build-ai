import { describe, expect, it } from "vitest";
import { locales } from "@ladestack/i18n";
import { formatCheckpointTime } from "./time";

const now = new Date("2026-10-26T12:00:00Z");
const ago = (s: number) => new Date(now.getTime() - s * 1000).toISOString();

describe("formatCheckpointTime", () => {
  it("uses relative time for recent checkpoints", () => {
    expect(formatCheckpointTime(ago(5), "en", now)).toBe("now");
    expect(formatCheckpointTime(ago(300), "en", now)).toBe("5 minutes ago");
    expect(formatCheckpointTime(ago(7200), "en", now)).toBe("2 hours ago");
    expect(formatCheckpointTime(ago(86_400), "en", now)).toBe("yesterday");
  });
  it("uses a date for checkpoints older than a week", () => {
    expect(formatCheckpointTime(ago(10 * 86_400), "en", now)).toMatch(/Oct 16, 2026/);
  });
  it("formats in every locale and tolerates bad input", () => {
    for (const l of locales) expect(formatCheckpointTime(ago(300), l, now)).not.toBe("");
    expect(formatCheckpointTime("not a date", "en", now)).toBe("");
  });
});
