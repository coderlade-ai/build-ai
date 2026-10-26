import { starterTemplates, type StarterTemplate } from "../templates";
import type { ShellStrings } from "../i18n/shell";
import styles from "./Welcome.module.css";

/** Templates are explorable before any AI provider is connected (PRD A.12). */
export function Templates({ s }: { s: ShellStrings }) {
  const copy: Record<StarterTemplate["id"], { name: string; desc: string }> = {
    "static-site": { name: s.staticName, desc: s.staticDesc },
    "react-vite": { name: s.reactName, desc: s.reactDesc },
  };
  return (
    <section className={styles.templates} aria-labelledby="templates-title">
      <h2 id="templates-title" className={styles.sectionTitle}>
        {s.templatesTitle}
      </h2>
      <p className={styles.note}>{s.templatesNote}</p>
      <ul className={styles.templateList}>
        {starterTemplates.map((t) => (
          <li key={t.id} className={styles.template}>
            <h3 className={styles.templateName}>{copy[t.id].name}</h3>
            <p className={styles.templateDesc}>{copy[t.id].desc}</p>
            <details>
              <summary className={styles.summary}>
                {s.showFiles} ({Object.keys(t.files).length})
              </summary>
              <ul className={styles.fileList}>
                {Object.keys(t.files)
                  .sort()
                  .map((p) => (
                    <li key={p}>
                      <code>{p}</code>
                    </li>
                  ))}
              </ul>
            </details>
          </li>
        ))}
      </ul>
    </section>
  );
}
