import { dbName } from "./projectStore";

/** Key prefixes LadeStack Build uses in Web Storage (drafts, provider session, handoffs, view). */
export const storagePrefixes = ["ladestack.", "ladestack:"] as const;

export type EraseResult = { ok: true } | { ok: false; reason: "failed" };

export interface EraseDeps {
  factory: IDBFactory | undefined;
  storages: (Storage | null)[];
  /** Closes this tab's open database connection first, so the delete is not blocked by us. */
  closeOwnConnection: () => void;
  /** Another tab holds the database open; the erase finishes once it closes. */
  onBlocked?: () => void;
}

function clearPrefixed(storage: Storage | null) {
  if (!storage) return;
  const keys: string[] = [];
  for (let i = 0; i < storage.length; i++) {
    const k = storage.key(i);
    if (k && storagePrefixes.some((p) => k.startsWith(p))) keys.push(k);
  }
  keys.forEach((k) => storage.removeItem(k));
}

/**
 * SET-03 / DATA: erases every project, file, checkpoint and setting this builder keeps in this
 * browser, plus the provider key held for this tab. Nothing is stored anywhere else.
 * Web Storage is cleared only after the database is gone. While another tab keeps it open the
 * browser holds the delete pending; the promise settles when that tab closes.
 */
export async function eraseLocalData(deps: EraseDeps): Promise<EraseResult> {
  deps.closeOwnConnection();
  if (deps.factory) {
    const result = await new Promise<EraseResult>((resolve) => {
      let req: IDBOpenDBRequest;
      try {
        req = deps.factory!.deleteDatabase(dbName);
      } catch {
        resolve({ ok: false, reason: "failed" });
        return;
      }
      req.onsuccess = () => resolve({ ok: true });
      req.onerror = () => resolve({ ok: false, reason: "failed" });
      req.onblocked = () => deps.onBlocked?.();
    });
    if (!result.ok) return result;
  }
  try {
    deps.storages.forEach(clearPrefixed);
  } catch {
    return { ok: false, reason: "failed" };
  }
  return { ok: true };
}
