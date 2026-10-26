import { describe, expect, it } from "vitest";
import {
  canSubmit,
  emptyDraft,
  isSubmitShortcut,
  maxPromptLength,
  parseDraft,
  serializeDraft,
} from "./draft";

const key = (k: Partial<Parameters<typeof isSubmitShortcut>[0]>) => ({
  key: "Enter",
  ctrlKey: false,
  metaKey: false,
  ...k,
});

describe("welcome composer", () => {
  it("only submits visible text within the limit", () => {
    expect(canSubmit("")).toBe(false);
    expect(canSubmit("   \n ")).toBe(false);
    expect(canSubmit("Build a portfolio")).toBe(true);
    expect(canSubmit("x".repeat(maxPromptLength + 1))).toBe(false);
  });

  it("submits on Ctrl or Cmd + Enter, never on plain Enter or during IME input", () => {
    expect(isSubmitShortcut(key({}))).toBe(false);
    expect(isSubmitShortcut(key({ ctrlKey: true }))).toBe(true);
    expect(isSubmitShortcut(key({ metaKey: true }))).toBe(true);
    expect(isSubmitShortcut(key({ ctrlKey: true, isComposing: true }))).toBe(false);
    expect(isSubmitShortcut(key({ key: "a", ctrlKey: true }))).toBe(false);
  });

  it("round-trips a draft", () => {
    const d = { prompt: "A café menu site", mode: "plan" as const };
    expect(parseDraft(serializeDraft(d))).toEqual(d);
  });

  it("treats missing or malformed drafts as empty", () => {
    expect(parseDraft(null)).toEqual(emptyDraft);
    expect(parseDraft("{not json")).toEqual(emptyDraft);
    expect(parseDraft("42")).toEqual(emptyDraft);
    expect(parseDraft(JSON.stringify({ prompt: 5, mode: "orchestrate" }))).toEqual(emptyDraft);
  });

  it("clips oversized drafts", () => {
    const d = parseDraft(JSON.stringify({ prompt: "y".repeat(maxPromptLength + 50), mode: "ask" }));
    expect(d.prompt).toHaveLength(maxPromptLength);
    expect(d.mode).toBe("ask");
  });
});
