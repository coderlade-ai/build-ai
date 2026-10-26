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

/** Mode names are product terms and stay in English; their hints are localized. */
const modeNames: Record<AlphaMode, string> = {
  code: "Code",
  plan: "Plan",
  ask: "Ask",
  debug: "Debug",
};

export function Composer({ s }: { s: ShellStrings }) {
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [loaded, setLoaded] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const textarea = useRef<HTMLTextAreaElement>(null);
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

  // Grow with the text, up to the CSS max-height.
  useEffect(() => {
    const el = textarea.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [draft.prompt]);

  function submit() {
    if (!canSubmit(draft.prompt)) return;
    // No provider adapter exists yet (BYOK lands in a later phase): send nothing, keep the draft.
    setNotice(s.needProvider);
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
        <button type="submit" className={styles.submit} disabled={!canSubmit(draft.prompt)}>
          {s.submit}
        </button>
      </div>
      <p id={ids.hint} className={styles.hint}>
        {hints[draft.mode]} · {s.shortcut}
      </p>
      <p id={ids.status} className={styles.status} role="status" aria-live="polite">
        {tooLong ? s.tooLong : notice}
      </p>
    </form>
  );
}
