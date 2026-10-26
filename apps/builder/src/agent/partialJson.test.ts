import { describe, expect, it } from "vitest";
import { partialStringField } from "./partialJson";

describe("partialStringField", () => {
  it("reads complete and incomplete values", () => {
    expect(partialStringField('{"path":"a.ts","content":"x"}', "path")).toBe("a.ts");
    expect(partialStringField('{"path":"a.ts","content":"line1\\nli', "content")).toBe("line1\nli");
    expect(partialStringField('{"path":"a.ts","con', "content")).toBeUndefined();
    expect(partialStringField('{"path":', "path")).toBeUndefined();
  });

  it("decodes escapes and drops an escape cut in half", () => {
    expect(partialStringField('{"content":"say \\"hi\\" \\u00e9\\t"}', "content")).toBe(
      'say "hi" é\t',
    );
    expect(partialStringField('{"content":"ab\\', "content")).toBe("ab");
    expect(partialStringField('{"content":"ab\\u00', "content")).toBe("ab");
  });

  it("tolerates whitespace and matches whole keys", () => {
    expect(partialStringField('{ "content" : "z', "content")).toBe("z");
    expect(partialStringField('{"xcontent":"no","content":"yes"', "content")).toBe("yes");
  });
});
