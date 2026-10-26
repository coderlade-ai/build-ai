import { describe, expect, it } from "vitest";
import { builderPath, defaultLocale, isLocale, localeInfo, localePrefix, locales } from "./index";

describe("locale registry", () => {
  it("has exactly the eight supported locales", () => {
    expect([...locales]).toEqual(["en", "ru", "ja", "ko", "zh", "tr", "fr", "pt"]);
    expect(defaultLocale).toBe("en");
  });

  it("has metadata for every locale and nothing else", () => {
    expect(Object.keys(localeInfo).sort()).toEqual([...locales].sort());
  });

  it("uses pt-BR for Portuguese and Simplified Chinese for zh", () => {
    expect(localeInfo.pt.bcp47).toBe("pt-BR");
    expect(localeInfo.zh.bcp47).toBe("zh-Hans");
  });

  it("serves English without a prefix", () => {
    expect(localePrefix("en")).toBe("");
    expect(localePrefix("ja")).toBe("/ja");
    expect(builderPath("en")).toBe("/app");
    expect(builderPath("ru")).toBe("/app/ru");
  });

  it("rejects unsupported locale codes", () => {
    expect(isLocale("fr")).toBe(true);
    expect(isLocale("de")).toBe(false);
    expect(isLocale("pt-PT")).toBe(false);
  });
});
