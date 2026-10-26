"use client";

import { useSyncExternalStore } from "react";
import { getServerSession, getSession, subscribe, type ProviderSession } from "./session";

export function useProviderSession(): ProviderSession | null {
  return useSyncExternalStore(subscribe, getSession, getServerSession);
}
