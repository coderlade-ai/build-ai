"use client";

import { useState } from "react";
import type { Locale } from "@ladestack/i18n";
import { erase } from "../i18n/erase";
import { setSession } from "../providers/session";
import { closeProjectStore } from "../storage/client";
import { eraseLocalData } from "../storage/erase";
import styles from "./Welcome.module.css";

type State = "idle" | "busy" | "blocked" | "done" | "failed";

function storages(): (Storage | null)[] {
  const get = (name: "sessionStorage" | "localStorage") => {
    try {
      return window[name];
    } catch {
      return null; // storage blocked
    }
  };
  return [get("sessionStorage"), get("localStorage")];
}

/** SET-03: erase everything this builder keeps in the browser, after an explicit confirmation. */
export function EraseData({ locale }: { locale: Locale }) {
  const t = erase[locale];
  const [state, setState] = useState<State>("idle");

  async function run() {
    if (!window.confirm(t.confirm)) return;
    setState("busy");
    const r = await eraseLocalData({
      factory: globalThis.indexedDB,
      storages: storages(),
      closeOwnConnection: closeProjectStore,
      onBlocked: () => setState("blocked"),
    });
    if (r.ok) {
      setSession(null); // drop the in-memory copy too and update the provider status
      setState("done");
      // Lists on this page (recent projects) read storage on mount; reload to show the empty state.
      window.location.reload();
    } else setState("failed");
  }

  const working = state === "busy" || state === "blocked";
  return (
    <section className={styles.templates} aria-labelledby="erase-title">
      <h2 id="erase-title" className={styles.sectionTitle}>
        {t.title}
      </h2>
      <p className={styles.templateDesc}>{t.body}</p>
      <button
        type="button"
        className={styles.secondary}
        onClick={() => void run()}
        disabled={working}
        aria-busy={working}
      >
        {working ? t.busy : t.button}
      </button>
      <p role="status" className={state === "failed" ? styles.error : styles.templateDesc}>
        {state === "blocked"
          ? t.blocked
          : state === "done"
            ? t.done
            : state === "failed"
              ? t.failed
              : ""}
      </p>
    </section>
  );
}
