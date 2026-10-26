"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { localePrefix, type Locale } from "@ladestack/i18n";
import { workspace } from "../i18n/workspace";
import { getProjectStore } from "../storage/client";
import { starterTemplates, type StarterTemplate } from "../templates";
import styles from "./Welcome.module.css";

/** Creates a local project from a starter template, with no AI call (INTAKE-06). */
export function UseTemplateButton({
  locale,
  templateId,
  name,
}: {
  locale: Locale;
  templateId: StarterTemplate["id"];
  name: string;
}) {
  const w = workspace[locale];
  const router = useRouter();
  const [state, setState] = useState<"idle" | "creating" | "error">("idle");

  async function create() {
    const template = starterTemplates.find((t) => t.id === templateId);
    if (!template) return;
    setState("creating");
    try {
      const store = await getProjectStore();
      const project = await store.createProject({
        name,
        profile: template.profile,
        files: template.files,
      });
      router.push(`${localePrefix(locale)}/project?id=${encodeURIComponent(project.id)}`);
    } catch {
      setState("error");
    }
  }

  return (
    <>
      <button
        type="button"
        className={styles.secondary}
        onClick={create}
        disabled={state === "creating"}
      >
        {state === "creating" ? w.creating : w.useTemplate}
      </button>
      {state === "error" ? (
        <p className={styles.error} role="alert">
          {w.createError}
        </p>
      ) : null}
    </>
  );
}
