import { localePrefix, type Locale } from "@ladestack/i18n";
import { shell } from "../i18n/shell";
import { Composer } from "./Composer";
import { RecentProjects } from "./RecentProjects";
import { Templates } from "./Templates";
import styles from "./Welcome.module.css";

/** Screen A (PRD A.12): the first screen of the builder. Loads no editor or runtime. */
export function Welcome({ locale }: { locale: Locale }) {
  const s = shell[locale];
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        {/* Plain anchor: the homepage is served by the Astro app, outside this basePath. */}
        <a className={styles.wordmark} href={`${localePrefix(locale)}/`}>
          LadeStack <span>Build</span>
        </a>
        <span className={styles.provider}>
          <span className={styles.dot} aria-hidden="true" />
          {s.providerStatus}
        </span>
      </header>
      <main className={styles.main}>
        <p className={styles.kicker}>{s.kicker}</p>
        <h1 className={styles.title}>{s.title}</h1>
        <Composer s={s} />
        <p className={styles.note}>{s.freeNote}</p>
        <p className={styles.note}>{s.body}</p>
        <RecentProjects locale={locale} />
        <Templates s={s} locale={locale} />
        <a className={styles.back} href={`${localePrefix(locale)}/`}>
          {s.back}
        </a>
      </main>
    </div>
  );
}
