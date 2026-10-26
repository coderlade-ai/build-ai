"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { localePrefix, type Locale } from "@ladestack/i18n";
import { format, importZip, type ImportStrings } from "../i18n/importZip";
import type { RejectReason } from "../import/zip";
import { getProjectStore } from "../storage/client";
import styles from "./Welcome.module.css";

type State =
  | { kind: "idle" | "busy" }
  | { kind: "error"; message: string }
  | { kind: "done"; href: string; notes: string[] };

const rejectKey: Record<RejectReason, keyof ImportStrings> = {
  "archive-too-large": "archiveTooLarge",
  "not-a-zip": "notAZip",
  "unsafe-path": "unsafePath",
  "too-many-files": "tooManyFiles",
  "too-large-total": "tooLargeTotal",
  empty: "empty",
};

/** Opens a local ZIP as a new project (J-02, INTAKE-07). Nothing is uploaded or executed. */
export function ImportZip({ locale }: { locale: Locale }) {
  const t = importZip[locale];
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<State>({ kind: "idle" });

  async function onFile(file: File | undefined) {
    if (!file) return;
    setState({ kind: "busy" });
    try {
      // The unzip code loads only when someone actually imports, keeping the welcome screen light.
      const { importLimits, nameFromArchive, parseProjectZip } = await import("../import/zip");
      if (file.size > importLimits.archiveBytes) {
        setState({ kind: "error", message: t.archiveTooLarge });
        return;
      }
      const result = parseProjectZip(new Uint8Array(await file.arrayBuffer()));
      if (result.status === "rejected") {
        const path = (result.path ?? "").slice(0, 120);
        setState({ kind: "error", message: format(t[rejectKey[result.reason]], { path }) });
        return;
      }
      const project = await (
        await getProjectStore()
      ).createProject({
        name: nameFromArchive(file.name, t.fallbackName),
        profile: result.profile,
        files: result.files,
      });
      const href = `${localePrefix(locale)}/project?id=${encodeURIComponent(project.id)}`;
      const notes: string[] = [];
      if (result.skipped.length > 0)
        notes.push(format(t.skipped, { count: result.skipped.length }));
      if (result.installHooks.length > 0)
        notes.push(format(t.hooks, { hooks: result.installHooks.join(", ") }));
      if (notes.length === 0) router.push(href);
      else setState({ kind: "done", href, notes });
    } catch {
      setState({ kind: "error", message: t.createError });
    } finally {
      if (input.current) input.current.value = "";
    }
  }

  return (
    <section className={styles.templates} aria-labelledby="import-title">
      <h2 id="import-title" className={styles.sectionTitle}>
        {t.title}
      </h2>
      <p className={styles.templateDesc}>{t.desc}</p>
      <input
        ref={input}
        id="import-zip"
        type="file"
        accept=".zip,application/zip"
        className={styles.srOnly}
        onChange={(e) => void onFile(e.currentTarget.files?.[0])}
        disabled={state.kind === "busy"}
      />
      <button
        type="button"
        className={styles.secondary}
        onClick={() => input.current?.click()}
        disabled={state.kind === "busy"}
      >
        {state.kind === "busy" ? t.importing : t.choose}
      </button>
      {state.kind === "error" ? (
        <p className={styles.error} role="alert">
          {state.message}
        </p>
      ) : null}
      {state.kind === "done" ? (
        <div role="status">
          {state.notes.map((n) => (
            <p key={n} className={styles.templateDesc}>
              {n}
            </p>
          ))}
          <Link className={styles.secondary} href={state.href}>
            {t.open}
          </Link>
        </div>
      ) : null}
    </section>
  );
}
