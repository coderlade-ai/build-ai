"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { localePrefix, type Locale } from "@ladestack/i18n";
import { createConversation } from "../agent/adapters";
import {
  buildFromPlanPrompt,
  codeSystemPrompt,
  planSystemPrompt,
  runAgent,
  type AgentOutcome,
} from "../agent/loop";
import { projectNameFromPrompt, takePendingTask } from "../agent/handoff";
import { toolsForMode, type AgentMode } from "../agent/tools";
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
  | {
      kind: "end";
      text: string;
      error: boolean;
      undo?: { checkpointId: string; label: string };
      build?: { request: string; plan: string };
    };

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
  onFilesChanged,
  onRunningChange,
}: {
  locale: Locale;
  projectId: string;
  onWrite: (path: string) => void;
  onFilesChanged: () => void;
  onRunningChange?: (running: boolean) => void;
}) {
  const a = agentStrings[locale];
  const t = providerStrings[locale];
  const session = useProviderSession();
  const [prompt, setPrompt] = useState("");
  const [log, setLog] = useState<LogEntry[]>([]);
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState<AgentMode>("code");
  const [restoring, setRestoring] = useState(false);
  // Latest callback in a ref so an inline prop doesn't re-fire the effect on every render.
  const runningChange = useRef(onRunningChange);
  runningChange.current = onRunningChange;
  const busy = running || restoring;
  useEffect(() => runningChange.current?.(busy), [busy]);
  const [approval, setApproval] = useState<{ path: string; decide: (ok: boolean) => void } | null>(
    null,
  );
  const abort = useRef<AbortController | null>(null);
  const logEnd = useRef<HTMLLIElement>(null);
  const ids = { prompt: useId(), note: useId(), approval: useId() };

  useEffect(() => () => abort.current?.abort(), []);

  // A Code-mode prompt handed over from the welcome composer runs once, on arrival.
  const started = useRef(false);
  useEffect(() => {
    if (started.current || !session) return;
    started.current = true;
    const task = takePendingTask(projectId);
    if (task) {
      setMode(task.mode);
      void run(task.prompt, task.mode);
    }
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

  async function run(text = prompt, runMode: AgentMode = mode) {
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
      // Checkpoint before any AI edit (PRD A.20): no checkpoint, no run. Plan mode never edits.
      let checkpointId: string | undefined;
      if (runMode === "code") {
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
      }
      let plan = "";
      const outcome = await runAgent({
        conversation: createConversation({
          provider: s.provider,
          key: s.key,
          model: s.model,
          system: runMode === "plan" ? planSystemPrompt : codeSystemPrompt,
          prompt: task,
          tools: toolsForMode(runMode),
        }),
        fs,
        projectId,
        mode: runMode,
        signal: controller.signal,
        onEvent: (e) => {
          if (e.type === "text") {
            plan = e.text;
            return add({ kind: "text", text: e.text });
          }
          const { call, isError, path } = e.result;
          const p = path ?? "?";
          const done: Record<string, string> = {
            read_file: a.read,
            write_file: a.wrote,
            delete_file: a.deleted,
          };
          const label =
            call.name === "list_files"
              ? a.listed
              : e.result.declined
                ? a.declined.replace("{path}", p)
                : isError
                  ? a.toolFailed.replace("{path}", p)
                  : (done[call.name] ?? a.toolFailed).replace("{path}", p);
          add({ kind: "tool", label, error: isError && !e.result.declined });
          if (isError || !path) return;
          if (call.name === "write_file") {
            wrote = true;
            onWrite(path);
          } else if (call.name === "delete_file") {
            wrote = true;
            onFilesChanged();
          }
        },
        // Allow once / Deny (ADR 0003). Stop or leaving the page counts as Deny.
        approve: (req) =>
          new Promise<boolean>((resolve) => {
            if (controller.signal.aborted) return resolve(false);
            const decide = (ok: boolean) => {
              controller.signal.removeEventListener("abort", onAbort);
              setApproval(null);
              resolve(ok);
            };
            const onAbort = () => decide(false);
            controller.signal.addEventListener("abort", onAbort);
            setApproval({ path: req.path, decide });
          }),
      });
      const end = endText(outcome);
      if (end.kind !== "end") add(end);
      else if (runMode === "plan" && outcome.reason === "done" && plan)
        add({ ...end, build: { request: task, plan } });
      else if (wrote && checkpointId) add({ ...end, undo: { checkpointId, label: a.undo } });
      else add(end);
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
        onFilesChanged();
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
              {e.kind === "end" && e.build ? (
                <>
                  {" "}
                  <button
                    type="button"
                    className={styles.agentLink}
                    disabled={running || restoring}
                    onClick={() => {
                      setMode("code");
                      void run(buildFromPlanPrompt(e.build!.request, e.build!.plan), "code");
                    }}
                  >
                    {a.buildPlan}
                  </button>
                </>
              ) : null}
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
      {approval ? (
        <div className={styles.agentApproval} role="group" aria-labelledby={ids.approval}>
          <p id={ids.approval}>{a.approveDelete.replace("{path}", approval.path)}</p>
          <button
            type="button"
            className={styles.agentButton}
            onClick={() => approval.decide(true)}
          >
            {a.allowOnce}
          </button>
          <button
            type="button"
            className={styles.agentSecondary}
            autoFocus
            onClick={() => approval.decide(false)}
          >
            {a.deny}
          </button>
        </div>
      ) : null}
      <div className={styles.agentModes} role="group" aria-label={a.modeLabel}>
        {(["code", "plan"] as const).map((m) => (
          <button
            key={m}
            type="button"
            aria-pressed={mode === m}
            className={styles.agentMode}
            disabled={running}
            onClick={() => setMode(m)}
          >
            {m === "code" ? a.modeCode : a.modePlan}
          </button>
        ))}
      </div>
      <form className={styles.agentForm} onSubmit={onSubmit}>
        <label htmlFor={ids.prompt} className={styles.srOnly}>
          {a.label}
        </label>
        <textarea
          id={ids.prompt}
          className={styles.agentInput}
          rows={2}
          value={prompt}
          placeholder={mode === "plan" ? a.planPlaceholder : a.placeholder}
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
        {mode === "plan" ? `${a.planNote} ` : null}
        {a.note.replace("{provider}", `${providers[session.provider].name} · ${session.model}`)}
      </p>
    </section>
  );
}
