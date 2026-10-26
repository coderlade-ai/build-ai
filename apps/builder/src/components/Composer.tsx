"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { alphaAgentModes } from "@ladestack/shared-types";
import {
  canSubmit,
  draftStorageKey,
  emptyDraft,
  isSubmitShortcut,
  maxPromptLength,
  parseDraft,
  serializeDraft,
  type AlphaMode,
  type Draft,
} from "../composer/draft";
import type { ShellStrings } from "../i18n/shell";
import styles from "./Welcome.module.css";
import type { Locale } from "@ladestack/i18n";
import { askStrings } from "../i18n/ask";
import { providerStrings, type ProviderStrings } from "../i18n/providers";
import { providers } from "../providers/registry";
import { getSession } from "../providers/session";
import {
  askSystemPrompt,
  ProviderStreamError,
  streamChat,
  type StreamError,
} from "../providers/stream";

/** Mode names are product terms and stay in English; their hints are localized. */
const modeNames: Record<AlphaMode, string> = {
  code: "Code",
  plan: "Plan",
  ask: "Ask",
  debug: "Debug",
};

const streamErrorKey: Record<
  Exclude<StreamError, "aborted" | "interrupted">,
  keyof ProviderStrings
> = {
  "invalid-key": "invalidKey",
  billing: "billing",
  "rate-limit": "rateLimit",
  unavailable: "unavailable",
  network: "network",
  timeout: "timeout",
  unexpected: "unexpected",
  "no-models": "noModels",
};

interface AskTurn {
  question: string;
  provider: string;
  answer: string;
  state: "waiting" | "streaming" | "done" | "stopped" | "interrupted" | "failed";
  error?: string;
}

export function Composer({ s, locale }: { s: ShellStrings; locale: Locale }) {
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [loaded, setLoaded] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [turn, setTurn] = useState<AskTurn | null>(null);
  const abort = useRef<AbortController | null>(null);
  const textarea = useRef<HTMLTextAreaElement>(null);
  const t = providerStrings[locale];
  const a = askStrings[locale];
  const busy = turn?.state === "waiting" || turn?.state === "streaming";
  const ids = { prompt: useId(), hint: useId(), status: useId() };
  const hints: Record<AlphaMode, string> = {
    code: s.hintCode,
    plan: s.hintPlan,
    ask: s.hintAsk,
    debug: s.hintDebug,
  };
  const tooLong = draft.prompt.length > maxPromptLength;

  // Restore the tab's draft after hydration so server and client render the same markup.
  useEffect(() => {
    try {
      setDraft(parseDraft(window.sessionStorage.getItem(draftStorageKey)));
    } catch {
      // Storage can be blocked; the composer still works without a saved draft.
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.sessionStorage.setItem(draftStorageKey, serializeDraft(draft));
    } catch {
      // Ignore quota or privacy-mode errors.
    }
  }, [draft, loaded]);

  useEffect(() => () => abort.current?.abort(), []);

  // Grow with the text, up to the CSS max-height.
  useEffect(() => {
    const el = textarea.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [draft.prompt]);

  function submit() {
    if (!canSubmit(draft.prompt)) return;
    const session = getSession();
    if (!session) {
      setNotice(s.needProvider);
      return;
    }
    const name = providers[session.provider].name;
    if (draft.mode !== "ask") {
      // The file-editing agent is a later unit: send nothing and keep the draft.
      setNotice(`${t.agentPending.replace("{provider}", name)} ${a.askWorks}`);
      return;
    }
    if (busy) return;
    void ask(session, name, draft.prompt.trim());
  }

  async function ask(
    session: NonNullable<ReturnType<typeof getSession>>,
    name: string,
    question: string,
  ) {
    setNotice(null);
    const controller = new AbortController();
    abort.current = controller;
    setTurn({ question, provider: name, answer: "", state: "waiting" });
    let answer = "";
    try {
      for await (const text of streamChat({
        provider: session.provider,
        key: session.key,
        model: session.model,
        system: askSystemPrompt,
        messages: [{ role: "user", content: question }],
        signal: controller.signal,
      })) {
        answer += text;
        setTurn((x) => x && { ...x, answer, state: "streaming" });
      }
      setTurn((x) => x && { ...x, state: "done" });
      setDraft((d) => ({ ...d, prompt: "" })); // answered: clear the box for the next question
    } catch (e) {
      const code = e instanceof ProviderStreamError ? e.code : "unexpected";
      if (code === "aborted") setTurn((x) => x && { ...x, state: "stopped" });
      else if (code === "interrupted") setTurn((x) => x && { ...x, state: "interrupted" });
      else setTurn((x) => x && { ...x, state: "failed", error: t[streamErrorKey[code]] });
    } finally {
      if (abort.current === controller) abort.current = null;
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    submit();
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (isSubmitShortcut({ ...e, isComposing: e.nativeEvent.isComposing })) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <form className={styles.composer} onSubmit={onSubmit} noValidate>
      <label htmlFor={ids.prompt} className={styles.srOnly}>
        {s.composerLabel}
      </label>
      <textarea
        id={ids.prompt}
        ref={textarea}
        className={styles.prompt}
        rows={3}
        placeholder={s.placeholder}
        value={draft.prompt}
        aria-describedby={`${ids.hint} ${ids.status}`}
        aria-invalid={tooLong || undefined}
        onChange={(e) => {
          setNotice(null);
          setDraft((d) => ({ ...d, prompt: e.target.value }));
        }}
        onKeyDown={onKeyDown}
      />
      <div className={styles.row}>
        <fieldset className={styles.modes}>
          <legend className={styles.srOnly}>{s.modeLabel}</legend>
          {alphaAgentModes.map((m) => (
            <label key={m} className={styles.mode} title={hints[m]}>
              <input
                type="radio"
                name="mode"
                value={m}
                checked={draft.mode === m}
                onChange={() => setDraft((d) => ({ ...d, mode: m }))}
              />
              <span>{modeNames[m]}</span>
            </label>
          ))}
        </fieldset>
        {busy ? (
          <button type="button" className={styles.submit} onClick={() => abort.current?.abort()}>
            {a.stop}
          </button>
        ) : (
          <button type="submit" className={styles.submit} disabled={!canSubmit(draft.prompt)}>
            {s.submit}
          </button>
        )}
      </div>
      <p id={ids.hint} className={styles.hint}>
        {hints[draft.mode]} · {s.shortcut}
      </p>
      <p id={ids.status} className={styles.status} role="status" aria-live="polite">
        {tooLong ? s.tooLong : notice}
      </p>
      {turn ? (
        <section
          className={styles.answer}
          aria-label={a.answer.replace("{provider}", turn.provider)}
        >
          <p className={styles.answerLabel}>{a.question}</p>
          <p className={styles.answerQuestion}>{turn.question}</p>
          <p className={styles.answerLabel}>{a.answer.replace("{provider}", turn.provider)}</p>
          <div className={styles.answerText} aria-live="polite" aria-busy={busy}>
            {turn.state === "waiting"
              ? a.waiting.replace("{provider}", turn.provider)
              : turn.answer}
          </div>
          {turn.state === "stopped" || turn.state === "interrupted" || turn.state === "failed" ? (
            <p className={styles.answerError} role="alert">
              {turn.state === "stopped"
                ? a.stopped
                : turn.state === "interrupted"
                  ? a.interrupted
                  : turn.error}
            </p>
          ) : null}
          <p className={styles.answerNote}>{a.notSaved}</p>
        </section>
      ) : null}
    </form>
  );
}
