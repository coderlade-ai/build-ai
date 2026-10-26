import { describe, expect, it } from "vitest";
import { locales } from "@ladestack/i18n";
import { validateBlog, type BlogEntryMeta } from "./validate";

const full = (id: string, draft = false): BlogEntryMeta[] =>
  locales.map((l) => ({ id: `${id}/${l}`, slug: `${id}-${l}`, draft }));

describe("validateBlog", () => {
  it("accepts an empty blog", () => {
    expect(validateBlog([]).problems).toEqual([]);
  });

  it("accepts a complete published set", () => {
    const r = validateBlog(full("hello"));
    expect(r.problems).toEqual([]);
    expect(r.editions).toHaveLength(8);
  });

  it("rejects a published article missing a language", () => {
    const r = validateBlog(full("hello").filter((e) => !e.id.endsWith("/ja")));
    expect(r.problems.join()).toContain("published without ja");
  });

  it("allows an incomplete set while every edition is a draft", () => {
    expect(validateBlog(full("wip", true).slice(0, 2)).problems).toEqual([]);
  });

  it("rejects a mix of drafts and published editions", () => {
    const set = full("mixed");
    set[0] = { ...set[0]!, draft: true };
    expect(validateBlog(set).problems.join()).toContain("some editions are drafts");
  });

  it("rejects unknown locales, bad slugs and duplicate slugs", () => {
    const r = validateBlog([
      { id: "a/de", slug: "a", draft: true },
      { id: "b/en", slug: "Bad Slug", draft: true },
      { id: "c/en", slug: "same", draft: true },
      { id: "d/en", slug: "same", draft: true },
    ]);
    expect(r.problems).toHaveLength(3);
  });
});
