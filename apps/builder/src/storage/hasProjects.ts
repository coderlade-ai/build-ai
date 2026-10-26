import { dbName } from "./projectStore";

/**
 * True when this browser may already hold projects. Lets the welcome screen skip opening
 * (and so creating) the database for first-time visitors. Browsers without
 * `indexedDB.databases()` are assumed to possibly have projects.
 */
export async function mayHaveProjects(factory: IDBFactory | undefined = globalThis.indexedDB) {
  if (!factory) return false;
  if (typeof factory.databases !== "function") return true;
  try {
    return (await factory.databases()).some((d) => d.name === dbName);
  } catch {
    return true;
  }
}
