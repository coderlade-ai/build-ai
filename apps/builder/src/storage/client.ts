"use client";

import { openProjectDb, ProjectStore } from "./projectStore";

let store: Promise<ProjectStore> | undefined;

/** One store per tab, opened lazily on first use so the welcome screen never touches storage. */
export function getProjectStore(): Promise<ProjectStore> {
  store ??= openProjectDb().then((db) => new ProjectStore(db));
  store.catch(() => (store = undefined));
  return store;
}
