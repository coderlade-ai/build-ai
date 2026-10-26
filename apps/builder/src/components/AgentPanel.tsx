"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { localePrefix, type Locale } from "@ladestack/i18n";
import { createConversation } from "../agent/adapters";
import { codeSystemPrompt, runAgent, type AgentOutcome } from "../agent/loop";
import { projectNameFromPrompt, takePendingTask } from "../agent/handoff";
import { agentTools } from "../agent/tools";
import { agentStrings } from "../i18n/agent";
import { providerStrings, type ProviderStrings } from "../i18n/providers";
import { isSubmitShortcut } from "../composer/draft";
import { providers } from "../providers/registry";
import { getSession } from "../providers/session";
import type { StreamError } from "../providers/stream";
import { useProviderSession } from "../providers/useProviderSession";
import { getProjectStore } from "../storage/client";
import styles from "./Workspace.module.css";

type LogEntry =
  | { kind: "you"; text: string }
  | { kind: "text"; text: string }
  | { kind: "tool"; label: string; error: boolean }
  | { kind: "end"; text: string; error: boolean; undo?: { checkpointId: string; label: string } };

const errorKey: Record<Exclude<StreamError, "aborted">, keyof ProviderStrings> = {
  "invalid-key": "invalidKey",
  billing: "billing",
  "rate-limit": "rateLimit",
  unavailable: "unavailable",
  network: "network",
  timeout: "timeout",
  unexpected: "unexpected",
  "no-models": "noModels",
  rejected: "rejected",
  interrupted: "unexpected",
};

const maxPrompt = 20_000;

/** Bottom activity capsule (PRD A.13): Code-mode agent over the open project. */
export function AgentPanel({
  locale,
  projectId,
  onWrite,
  onRestore,
}: {
  locale: Locale;
  projectId: string;
  onWrite: (path: string) => void;
  onRestore: () => void;
}) {
  const a = agentStrings[locale];
  const t = providerStrings[locale];
  const session = useProviderSession();
  const [prompt, setPrompt] = useState("");
  const [log, setLog] = useState<LogEntry[]>([]);
  const [running, setRunning] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const abort = useRef<AbortController | null>(null);
  const logEnd = useRef<HTMLLIElement>(null);
  const ids = { prompt: useId(), note: useId() };

  useEffect(() => () => abort.current?.abort(), []);

  // A Code-mode prompt handed over from the welcome composer runs once, on arrival.
  const started = useRef(false);
  useEffect(() => {
    if (started.current || !session) return;
    started.current = true;
    const task = takePendingTask(projectId);
    if (task) void run(task);
  }, [session, projectId]);
  useEffect(() => logEnd.current?.scrollIntoView({ block: "nearest" }), [log]);

  const add = (e: LogEntry) => setLog((l) => [...l, e]);

  function endText(o: AgentOutcome): LogEntry {
    switch (o.reason) {
      case "done":
        return { kind: "end", text: a.done, error: false };
      case "stopped":
        return { kind: "end", text: a.stopped, error: false };
      case "max-steps":
        return { kind: "end", text: a.maxSteps.replace("{steps}", String(o.steps)), error: true };
      case "error":
        return {
          kind: "end",
          text: t[errorKey[o.code === "aborted" ? "unexpected" : o.code]],
          error: true,
        };
    }
  }

  async function run(text = prompt) {
    const s = getSession();
    const task = text.trim();
    if (!s || !task || running || task.length > maxPrompt) return;
    const controller = new AbortController();
    abort.current = controller;
    setRunning(true);
    add({ kind: "you", text: task });
    setPrompt("");
    let wrote = false;
    try {
      const fs = await getProjectStore();
      // Checkpoint before any AI edit (PRD A.20): no checkpoint, no run.
      let checkpointId: string | undefined;
      try {
        checkpointId = (
          await fs.createCheckpoint(projectId, projectNameFromPrompt(task), "auto-before-ai-edit")
        )?.id;
      } catch {
        checkpointId = undefined;
      }
      if (!checkpointId) {
        add({ kind: "end", text: a.checkpointFailed, error: true });
        return;
      }
      const outcome = await runAgent({
        conversation: createConversation({
          provider: s.provider,
          key: s.key,
          model: s.model,
          system: codeSystemPrompt,
          prompt: task,
          tools: agentTools,
        }),
        fs,
        projectId,
        signal: controller.signal,
        onEvent: (e) => {
          if (e.type === "text") return add({ kind: "text", text: e.text });
          const { call, isError, path } = e.result;
          const p = path ?? "?";
          const label =
            call.name === "list_files"
              ? a.listed
              : isError
                ? a.toolFailed.replace("{path}", p)
                : (call.name === "write_file" ? a.wrote : a.read).replace("{path}", p);
          add({ kind: "tool", label, error: isError });
          if (call.name === "write_file" && !isError && path) {
            wrote = true;
            onWrite(path);
          }
        },
      });
      const end = endText(outcome);
      add(wrote && end.kind === "end" ? { ...end, undo: { checkpointId, label: a.undo } } : end);
    } catch {
      add({ kind: "end", text: t.unexpected, error: true });
    } finally {
      if (abort.current === controller) abort.current = null;
      setRunning(false);
    }
  }

  async function restore(checkpointId: string) {
    if (running || restoring || !window.confirm(a.undoConfirm)) return;
    setRestoring(true);
    try {
      const fs = await getProjectStore();
      const r = await fs.restoreCheckpoint(projectId, checkpointId);
      if (r.ok) {
        add({
          kind: "end",
          text: a.restored,
          error: false,
          undo: { checkpointId: r.safety.id, label: a.undoRestore },
        });
        onRestore();
      } else add({ kind: "end", text: a.restoreFailed, error: true });
    } catch {
      add({ kind: "end", text: a.restoreFailed, error: true });
    } finally {
      setRestoring(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void run();
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (isSubmitShortcut({ ...e, isComposing: e.nativeEvent.isComposing })) {
      e.preventDefault();
      void run();
    }
  }

  if (!session) {
    return (
      <section className={styles.agent} aria-label={a.label}>
        <p className={styles.agentNote}>
          {a.needProvider} <Link href={`${localePrefix(locale)}/`}>{a.startPage}</Link>
        </p>
      </section>
    );
  }

  return (
    <section className={styles.agent} aria-label={a.label}>
      {log.length ? (
        <ol className={styles.agentLog} aria-live="polite">
          {log.map((e, i) => (
            <li key={i} data-kind={e.kind} data-error={"error" in e ? e.error : undefined}>
              {e.kind === "tool" ? e.label : e.text}
              {e.kind === "end" && e.undo ? (
                <>
                  {" "}
                  <button
                    type="button"
                    className={styles.agentLink}
                    disabled={running || restoring}
                    onClick={() => void restore(e.undo!.checkpointId)}
                  >
                    {e.undo.label}
                  </button>
                </>
              ) : null}
            </li>
          ))}
          {running ? <li data-kind="working">{a.working}</li> : null}
          <li ref={logEnd} aria-hidden="true" />
        </ol>
      ) : null}
      <form className={styles.agentForm} onSubmit={onSubmit}>
        <label htmlFor={ids.prompt} className={styles.srOnly}>
          {a.label}
        </label>
        <textarea
          id={ids.prompt}
          className={styles.agentInput}
          rows={2}
          value={prompt}
          placeholder={a.placeholder}
          maxLength={maxPrompt}
          aria-describedby={ids.note}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={running}
        />
        {running ? (
          <button
            type="button"
            className={styles.agentButton}
            onClick={() => abort.current?.abort()}
          >
            {a.stop}
          </button>
        ) : (
          <button type="submit" className={styles.agentButton} disabled={!prompt.trim()}>
            {a.run}
          </button>
        )}
      </form>
      <p id={ids.note} className={styles.agentNote}>
        {a.note.replace("{provider}", `${providers[session.provider].name} · ${session.model}`)}
      </p>
    </section>
  );
}
