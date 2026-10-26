"use client";

import { openProjectDb, ProjectStore } from "./projectStore";

let store: Promise<ProjectStore> | undefined;

/** One store per tab, opened lazily on first use so pages that need no projects never touch storage. */
export function getProjectStore(): Promise<ProjectStore> {
  store ??= openProjectDb().then((db) => new ProjectStore(db));
  store.catch(() => (store = undefined));
  return store;
}
