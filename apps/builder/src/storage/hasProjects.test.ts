import { describe, expect, it } from "vitest";
import { mayHaveProjects } from "./hasProjects";
import { dbName } from "./projectStore";

const factory = (dbs: { name: string }[] | Error | null) =>
  ({
    databases:
      dbs === null
        ? undefined
        : () => (dbs instanceof Error ? Promise.reject(dbs) : Promise.resolve(dbs)),
  }) as unknown as IDBFactory;

describe("mayHaveProjects", () => {
  it("is false without IndexedDB or without our database", async () => {
    expect(await mayHaveProjects(undefined)).toBe(false);
    expect(await mayHaveProjects(factory([{ name: "other" }]))).toBe(false);
  });

  it("is true when our database exists or we cannot tell", async () => {
    expect(await mayHaveProjects(factory([{ name: dbName }]))).toBe(true);
    expect(await mayHaveProjects(factory(null))).toBe(true);
    expect(await mayHaveProjects(factory(new Error("blocked")))).toBe(true);
  });
});
