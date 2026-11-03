"use client";

import { useRef, useState, type DragEvent } from "react";
import type { AttachmentCheck } from "../providers/capability";
import type { Locale } from "@ladestack/i18n";
import {
  admit,
  readAttachment,
  type Attachment,
  type AttachmentReason,
} from "../attachments/attach";
import { attachStrings, type AttachStrings } from "../i18n/attach";
import styles from "./Welcome.module.css";

const reasonKey: Record<AttachmentReason, keyof AttachStrings> = {
  blocked: "blocked",
  unsupported: "unsupported",
  "too-large": "tooLarge",
  "too-many": "tooMany",
  "read-failed": "readFailed",
};

/** Attachment state shared by the welcome composer and the workspace agent box. Memory only. */
export function useAttachments(locale: Locale) {
  const t = attachStrings[locale];
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  /** Reads dropped or picked files one by one, checking each against the set so far. */
  async function add(files: FileList | null) {
    if (!files?.length) return;
    const found: string[] = [];
    let next = attachments;
    for (const file of Array.from(files)) {
      const read = await readAttachment(file);
      const ok = read.ok ? admit(next, read.attachment) : read;
      if (read.ok && ok.ok) next = [...next, read.attachment];
      else if (!ok.ok) found.push(t[reasonKey[ok.reason]].replace("{name}", file.name));
    }
    setAttachments(next);
    setErrors(found);
  }

  const dropProps = {
    onDragOver: (e: DragEvent) => {
      if (e.dataTransfer.types.includes("Files")) e.preventDefault();
    },
    onDrop: (e: DragEvent) => {
      if (!e.dataTransfer.files.length) return;
      e.preventDefault();
      void add(e.dataTransfer.files);
    },
  };

  return {
    t,
    attachments,
    errors,
    add,
    dropProps,
    remove: (i: number) => setAttachments((list) => list.filter((_, j) => j !== i)),
    clear: () => {
      setAttachments([]);
      setErrors([]);
    },
  };
}

type Attach = ReturnType<typeof useAttachments>;

/** Chips for the attached files, the privacy note, and any per-file errors. */
export function AttachmentList({
  at,
  check,
  model,
}: {
  at: Attach;
  check?: AttachmentCheck;
  model?: string;
}) {
  const { t, attachments, errors } = at;
  const say = (s: string) => s.replace("{model}", model ?? "");
  return (
    <>
      {attachments.length ? (
        <ul className={styles.attachments} aria-label={t.attach}>
          {attachments.map((x, i) => (
            <li key={`${x.name}-${i}`} className={styles.attachment}>
              <span>{x.name}</span>
              <button
                type="button"
                className={styles.attachmentRemove}
                aria-label={t.remove.replace("{name}", x.name)}
                onClick={() => at.remove(i)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      {attachments.length ? <p className={styles.hint}>{t.note}</p> : null}
      {check?.blocked.length ? (
        <ul className={styles.attachErrors} role="alert">
          {check.blocked.map((k) => (
            <li key={k}>{say(k === "image" ? t.cantImages : t.cantPdf)}</li>
          ))}
        </ul>
      ) : null}
      {check?.unsure.length ? (
        <ul className={styles.hint} role="status">
          {check.unsure.map((k) => (
            <li key={k}>{say(k === "image" ? t.unsureImages : t.unsurePdf)}</li>
          ))}
        </ul>
      ) : null}
      {errors.length ? (
        <ul className={styles.attachErrors} role="alert">
          {errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      ) : null}
    </>
  );
}

export function AttachButton({ at, disabled }: { at: Attach; disabled?: boolean }) {
  const input = useRef<HTMLInputElement>(null);
  return (
    <>
      <input
        ref={input}
        type="file"
        multiple
        hidden
        onChange={(e) => {
          void at.add(e.target.files);
          e.target.value = "";
        }}
      />
      <button
        type="button"
        className={styles.attach}
        title={at.t.note}
        onClick={() => input.current?.click()}
        disabled={disabled}
      >
        {at.t.attach}
      </button>
    </>
  );
}
