"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { localePrefix, type Locale } from "@ladestack/i18n";
import type { Project } from "@ladestack/shared-types";
import { fill, recent } from "../i18n/recent";
import { getProjectStore } from "../storage/client";
import { mayHaveProjects } from "../storage/hasProjects";
import styles from "./Welcome.module.css";

const shown = 12;

/** Projects saved in this browser, newest first. Renders nothing until there is one. */
export function RecentProjects({ locale }: { locale: Locale }) {
  const r = recent[locale];
  const [projects, setProjects] = useState<Project[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let live = true;
    void (async () => {
      try {
        if (!(await mayHaveProjects())) return;
        const list = await (await getProjectStore()).listProjects();
        if (live) setProjects(list.slice(0, shown));
      } catch {
        // Storage unavailable (private mode, blocked): the rest of the screen still works.
      }
    })();
    return () => {
      live = false;
    };
  }, []);

  if (projects.length === 0) return null;

  const date = new Intl.DateTimeFormat(locale === "pt" ? "pt-BR" : locale, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  async function remove(p: Project) {
    if (!window.confirm(fill(r.confirmRemove, p.name))) return;
    setBusy(p.id);
    setError(false);
    try {
      await (await getProjectStore()).deleteProject(p.id);
      setProjects((list) => list.filter((x) => x.id !== p.id));
    } catch {
      setError(true);
    } finally {
      setBusy(null);
    }
  }

  return (
    <section className={styles.templates} aria-labelledby="recent-title">
      <h2 id="recent-title" className={styles.sectionTitle}>
        {r.title}
      </h2>
      <p className={styles.templateDesc}>{r.localNote}</p>
      <ul className={styles.recentList}>
        {projects.map((p) => (
          <li key={p.id} className={styles.recentItem}>
            <Link
              className={styles.recentLink}
              href={`${localePrefix(locale)}/project?id=${encodeURIComponent(p.id)}`}
            >
              <span className={styles.templateName}>{p.name}</span>
              <span className={styles.recentMeta}>
                {p.profile === "react-vite" ? r.reactVite : r.static} · {r.edited}{" "}
                <time dateTime={p.updatedAt}>{date.format(new Date(p.updatedAt))}</time>
              </span>
            </Link>
            <button
              type="button"
              className={styles.recentRemove}
              aria-label={fill(r.removeLabel, p.name)}
              disabled={busy === p.id}
              onClick={() => void remove(p)}
            >
              {r.remove}
            </button>
          </li>
        ))}
      </ul>
      {error ? (
        <p className={styles.error} role="alert">
          {r.removeError}
        </p>
      ) : null}
    </section>
  );
}
