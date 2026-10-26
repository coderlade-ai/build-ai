"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Locale } from "@ladestack/i18n";
import { workspace } from "../i18n/workspace";
import {
  appendLog,
  debugPromptFromLogs,
  parsePreviewLog,
  type PreviewLog,
} from "../preview/console";
import { newPreviewSession, previewKind, previewMessages } from "../preview/files";
import { previewOrigin } from "../preview/origin";
import { getProjectStore } from "../storage/client";
import styles from "./Workspace.module.css";

/**
 * Project preview (ADR 0016). Plain HTML/CSS/JS projects run on the isolated preview origin in a
 * sandboxed frame; files are sent with postMessage to that origin only. Projects with a
 * package.json need the runtime, which is a later unit.
 */
export function Preview({
  locale,
  projectId,
  paths,
  refreshKey,
  onDebug,
}: {
  locale: Locale;
  projectId: string;
  paths: string[];
  /** Changes whenever saved files change, so the preview reloads. */
  refreshKey: number;
  /** Starts a Debug-mode run with this task (built from the console's errors). */
  onDebug?: (prompt: string) => void;
}) {
  const w = workspace[locale];
  const kind = previewKind(paths);
  const frame = useRef<HTMLIFrameElement>(null);
  const session = useMemo(() => newPreviewSession(), []);
  const [ready, setReady] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [frameKey, setFrameKey] = useState(0);
  const [logs, setLogs] = useState<PreviewLog[]>([]);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (!previewOrigin || e.origin !== previewOrigin) return;
      if (e.source !== frame.current?.contentWindow) return;
      if (e.data?.type === previewMessages.ready) setReady(true);
      if (e.data?.type === previewMessages.loaded) setLoaded(true);
      const log = parsePreviewLog(e.data);
      if (log) setLogs((l) => appendLog(l, log));
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  useEffect(() => {
    if (!ready || !previewOrigin || kind !== "static") return;
    let cancelled = false;
    void (async () => {
      const store = await getProjectStore();
      const all = await store.readAllFiles(projectId);
      if (cancelled) return;
      const files = Object.fromEntries(all.map((f) => [f.path, f.content]));
      setLogs([]); // each load starts a fresh console
      frame.current?.contentWindow?.postMessage(
        { type: previewMessages.files, session, files },
        previewOrigin!,
      );
    })();
    return () => {
      cancelled = true;
    };
  }, [ready, refreshKey, kind, projectId, session]);

  const errors = logs.filter((l) => l.level === "error" || l.level === "warn").length;
  const debugPrompt = debugPromptFromLogs(w.consoleDebugPrompt, logs);

  if (!previewOrigin) return <Notice text={w.previewOff} />;
  if (kind === "needs-runtime") return <Notice text={w.previewUnavailable} />;
  if (kind === "no-entry") return <Notice text={w.previewNoEntry} />;

  return (
    <div className={styles.previewPane}>
      <div className={styles.previewBar}>
        {loaded ? null : <span role="status">{w.previewLoading}</span>}
        <button
          type="button"
          className={styles.exportButton}
          onClick={() => {
            setReady(false);
            setLoaded(false);
            setFrameKey((k) => k + 1);
          }}
        >
          {w.reloadPreview}
        </button>
      </div>
      <iframe
        key={frameKey}
        ref={frame}
        className={styles.previewFrame}
        title={w.previewFrame}
        src={`${previewOrigin}/`}
        // Cross-origin, so allow-same-origin only gives the preview its own origin's storage.
        sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups"
        referrerPolicy="no-referrer"
      />
      <details className={styles.console}>
        <summary>
          {w.console} ({logs.length})
          {errors > 0 ? <span className={styles.consoleErrors}> · {errors}</span> : null}
        </summary>
        {logs.length === 0 ? (
          <p className={styles.consoleEmpty}>{w.consoleEmpty}</p>
        ) : (
          <ol className={styles.consoleList}>
            {logs.map((l, i) => (
              <li key={i} className={styles[`log_${l.level}`]}>
                <span className={styles.logLevel}>{l.level}</span>
                <pre>{l.text}</pre>
                {l.where ? <span className={styles.logWhere}>{l.where}</span> : null}
              </li>
            ))}
          </ol>
        )}
        <div className={styles.consoleActions}>
          {debugPrompt && onDebug ? (
            <button
              type="button"
              className={styles.exportButton}
              onClick={() => onDebug(debugPrompt)}
            >
              {w.debugErrors}
            </button>
          ) : null}
          <button type="button" className={styles.exportButton} onClick={() => setLogs([])}>
            {w.consoleClear}
          </button>
        </div>
      </details>
    </div>
  );
}

function Notice({ text }: { text: string }) {
  return (
    <div className={styles.preview}>
      <p>{text}</p>
    </div>
  );
}
