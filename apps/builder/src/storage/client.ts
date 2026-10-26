"use client";

import { openProjectDb, ProjectStore } from "./projectStore";

let store: Promise<ProjectStore> | undefined;
let db: IDBDatabase | undefined;

/** One store per tab, opened lazily on first use so pages that need no projects never touch storage. */
export function getProjectStore(): Promise<ProjectStore> {
  store ??= openProjectDb().then((opened) => {
    db = opened;
    // Another tab erasing or upgrading the database: let go so it is not blocked.
    opened.onversionchange = () => closeProjectStore();
    return new ProjectStore(opened);
  });
  store.catch(() => (store = undefined));
  return store;
}

/** Closes this tab's connection; the next getProjectStore() opens a fresh one. */
export function closeProjectStore(): void {
  db?.close();
  db = undefined;
  store = undefined;
}
