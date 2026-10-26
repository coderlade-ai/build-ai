"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import type { Locale } from "@ladestack/i18n";
import { providerStrings, type ProviderStrings } from "../i18n/providers";
import { testConnection, type ConnectError, type ModelInfo } from "../providers/connect";
import { looksLikeKey, providerIds, providers, type ProviderId } from "../providers/registry";
import { setSession } from "../providers/session";
import { useProviderSession } from "../providers/useProviderSession";
import styles from "./ProviderSetup.module.css";

const errorKey: Record<ConnectError | "bad-key", keyof ProviderStrings> = {
  "bad-key": "badKey",
  "invalid-key": "invalidKey",
  billing: "billing",
  "rate-limit": "rateLimit",
  unavailable: "unavailable",
  network: "network",
  timeout: "timeout",
  "no-models": "noModels",
  unexpected: "unexpected",
};

const fill = (s: string, v: Record<string, string>) =>
  s.replace(/\{(\w+)\}/g, (m, k: string) => v[k] ?? m);

/** Header chip + dialog for BYOK setup (PRD A.17, BYOK-01..07). Calls go browser → provider. */
export function ProviderSetup({ locale, idleLabel }: { locale: Locale; idleLabel: string }) {
  const t = providerStrings[locale];
  const session = useProviderSession();
  const dialog = useRef<HTMLDialogElement>(null);
  const abort = useRef<AbortController | null>(null);
  const ids = useId();

  const [provider, setProvider] = useState<ProviderId>(session?.provider ?? "openrouter");
  const [key, setKey] = useState("");
  const [reveal, setReveal] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<ConnectError | "bad-key" | null>(null);
  const [models, setModels] = useState<ModelInfo[] | null>(null);
  const [model, setModel] = useState("");

  function open() {
    setProvider(session?.provider ?? "openrouter");
    setKey("");
    setReveal(false);
    setError(null);
    setModels(null);
    setModel(session?.model ?? "");
    dialog.current?.showModal();
  }

  function close() {
    abort.current?.abort();
    setKey(""); // don't keep an unsaved key around in component state
    dialog.current?.close();
  }

  function chooseProvider(id: ProviderId) {
    setProvider(id);
    setModels(null);
    setError(null);
  }

  async function test(e: FormEvent) {
    e.preventDefault();
    const trimmed = key.trim();
    if (!looksLikeKey(trimmed)) {
      setError("bad-key");
      return;
    }
    abort.current?.abort();
    abort.current = new AbortController();
    setBusy(true);
    setError(null);
    setModels(null);
    const result = await testConnection(provider, trimmed, { signal: abort.current.signal });
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    // Tool-capable models first: the builder agent needs tool calling.
    const sorted = [...result.models].sort(
      (a, b) => Number(b.tools === true) - Number(a.tools === true),
    );
    setModels(sorted);
    setModel(sorted.some((m) => m.id === model) ? model : sorted[0]!.id);
  }

  function save() {
    if (!models || !model) return;
    setSession({ provider, key: key.trim(), model });
    close();
  }

  function forget() {
    setSession(null);
    close();
  }

  const name = providers[provider].name;
  return (
    <>
      <button type="button" className={styles.chip} onClick={open} data-connected={!!session}>
        <span className={styles.dot} aria-hidden="true" />
        {session
          ? fill(t.connected, { provider: providers[session.provider].name, model: session.model })
          : idleLabel}
      </button>
      <dialog
        ref={dialog}
        className={styles.dialog}
        aria-labelledby={`${ids}-title`}
        onClose={() => abort.current?.abort()}
      >
        <form className={styles.form} onSubmit={test}>
          <h2 id={`${ids}-title`} className={styles.title}>
            {t.title}
          </h2>
          <p className={styles.text}>{t.intro}</p>

          <fieldset className={styles.providers}>
            <legend className={styles.label}>{t.provider}</legend>
            {providerIds.map((id) => (
              <label key={id} className={styles.option}>
                <input
                  type="radio"
                  name={`${ids}-provider`}
                  checked={provider === id}
                  onChange={() => chooseProvider(id)}
                />
                {providers[id].name}
              </label>
            ))}
          </fieldset>

          <label className={styles.label} htmlFor={`${ids}-key`}>
            {t.key}
          </label>
          <div className={styles.keyRow}>
            <input
              id={`${ids}-key`}
              className={styles.input}
              type={reveal ? "text" : "password"}
              value={key}
              onChange={(e) => {
                setKey(e.target.value);
                setModels(null);
                setError(null);
              }}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              aria-describedby={`${ids}-keynote`}
              aria-invalid={error === "bad-key" || error === "invalid-key"}
            />
            <button type="button" className={styles.ghost} onClick={() => setReveal((r) => !r)}>
              {reveal ? t.hide : t.show}
            </button>
          </div>
          <p id={`${ids}-keynote`} className={styles.small}>
            {t.keyNote}{" "}
            <a href={providers[provider].keyUrl} target="_blank" rel="noopener noreferrer">
              {fill(t.getKey, { provider: name })}
            </a>
          </p>

          <button type="submit" className={styles.secondary} disabled={busy || key.trim() === ""}>
            {busy ? t.testing : t.test}
          </button>
          {error ? (
            <p className={styles.error} role="alert">
              {t[errorKey[error]]}
            </p>
          ) : null}

          {models ? (
            <>
              <label className={styles.label} htmlFor={`${ids}-model`}>
                {t.model}
              </label>
              <select
                id={`${ids}-model`}
                className={styles.input}
                value={model}
                onChange={(e) => setModel(e.target.value)}
                aria-describedby={`${ids}-modelhint`}
              >
                {models.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.tools ? `${m.label} · ${t.tools}` : m.label}
                  </option>
                ))}
              </select>
              <p id={`${ids}-modelhint`} className={styles.small}>
                {t.modelHint}
              </p>
            </>
          ) : null}

          <div className={styles.actions}>
            {session ? (
              <button type="button" className={styles.ghost} onClick={forget}>
                {t.remove}
              </button>
            ) : null}
            <span className={styles.spacer} />
            <button type="button" className={styles.ghost} onClick={close}>
              {t.close}
            </button>
            <button
              type="button"
              className={styles.primary}
              onClick={save}
              disabled={!models || !model}
            >
              {t.save}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
