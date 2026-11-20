import { describe, expect, it } from "vitest";
import { agentStrings } from "./agent";
import { history } from "./history";
import { importZip } from "./importZip";
import { countText } from "./plural";

describe("countText", () => {
  it("picks the singular for one in English, French and Portuguese", () => {
    expect(countText("en", history.en.files, 1)).toBe("1 file");
    expect(countText("en", history.en.files, 3)).toBe("3 files");
    expect(countText("fr", history.fr.files, 0)).toBe("0 fichier"); // French: 0 is singular
    expect(countText("pt", history.pt.files, 1)).toBe("1 arquivo");
    expect(countText("en", agentStrings.en.doneWithFailures, 1)).toContain("1 step failed");
    expect(countText("en", importZip.en.skipped, 1)).toContain("1 file was left out");
  });
  it("keeps count-neutral sentences and formats numbers by locale", () => {
    expect(countText("ru", history.ru.files, 21)).toBe("Файлов: 21");
    expect(countText("en", history.en.files, 1200)).toBe("1,200 files");
  });
  it("never leaves a placeholder or an (s) behind", () => {
    for (const t of [agentStrings, history, importZip] as const)
      for (const loc of Object.keys(t) as (keyof typeof t)[]) {
        const s = t[loc] as unknown as Record<string, unknown>;
        for (const v of Object.values(s))
          if (v && typeof v === "object")
            for (const n of [0, 1, 2, 5, 21])
              expect(countText(loc, v as { other: string }, n)).not.toMatch(/\{count\}|\(s\)/);
      }
  });
});
