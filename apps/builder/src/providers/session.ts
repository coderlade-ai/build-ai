import { isProviderId, type ProviderId } from "./registry";

/**
 * The active provider connection, kept for this tab's lifetime only (PRD D-10 default).
 * sessionStorage survives a reload of the same tab and is cleared when the tab closes.
 * It is never written to IndexedDB, projects, exports, checkpoints or logs.
 */
export interface ProviderSession {
  provider: ProviderId;
  key: string;
  model: string;
}

const storageKey = "ladestack.build.provider";
const listeners = new Set<() => void>();
let cache: ProviderSession | null | undefined;

function storage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.sessionStorage;
  } catch {
    return null; // storage blocked
  }
}

export function parseSession(raw: string | null): ProviderSession | null {
  if (!raw) return null;
  try {
    const v = JSON.parse(raw) as Partial<ProviderSession>;
    if (
      isProviderId(v.provider) &&
      typeof v.key === "string" &&
      v.key &&
      typeof v.model === "string" &&
      v.model
    )
      return { provider: v.provider, key: v.key, model: v.model };
  } catch {
    // fall through
  }
  return null;
}

export function getSession(): ProviderSession | null {
  if (cache === undefined) cache = parseSession(storage()?.getItem(storageKey) ?? null);
  return cache;
}

export function setSession(session: ProviderSession | null): void {
  cache = session;
  const s = storage();
  try {
    if (session) s?.setItem(storageKey, JSON.stringify(session));
    else s?.removeItem(storageKey);
  } catch {
    // Quota or blocked storage: the connection still works in memory for this page.
  }
  listeners.forEach((l) => l());
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** For React's useSyncExternalStore: the server never has a session. */
export const getServerSession = (): ProviderSession | null => null;

/** Test hook: forget the in-memory copy so the next read goes back to storage. */
export function resetSessionCache(): void {
  cache = undefined;
}
