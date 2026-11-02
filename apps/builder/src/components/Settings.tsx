import Link from "next/link";
import { localeInfo, localePrefix, locales, type Locale } from "@ladestack/i18n";
import { settingsStrings } from "../i18n/settings";
import { shell } from "../i18n/shell";
import { EraseData } from "./EraseData";
import { ProviderSetup } from "./ProviderSetup";
import styles from "./Welcome.module.css";

/** Minimum settings (SET-01..04): provider, language, local data, about. No account, no billing. */
export function Settings({ locale }: { locale: Locale }) {
  const t = settingsStrings[locale];
  const prefix = localePrefix(locale);
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        {/* Plain anchor: the homepage is served by the Astro app, outside this basePath. */}
        <a className={styles.wordmark} href={`${prefix}/`}>
          LadeStack <span>Build</span>
        </a>
        <Link className={styles.headerLink} href={`${prefix}/`}>
          {t.back}
        </Link>
      </header>
      <main className={styles.main}>
        <h1 className={styles.title}>{t.title}</h1>

        <section className={styles.templates} aria-labelledby="settings-provider">
          <h2 id="settings-provider" className={styles.sectionTitle}>
            {t.provider}
          </h2>
          <p className={styles.templateDesc}>{t.providerBody}</p>
          <ProviderSetup locale={locale} idleLabel={shell[locale].providerStatus} />
        </section>

        <section className={styles.templates} aria-labelledby="settings-language">
          <h2 id="settings-language" className={styles.sectionTitle}>
            {t.language}
          </h2>
          <p className={styles.templateDesc}>{t.languageBody}</p>
          <ul className={styles.languages}>
            {locales.map((l) => (
              <li key={l}>
                <Link
                  className={styles.language}
                  href={`${localePrefix(l)}/settings`}
                  hrefLang={localeInfo[l].bcp47}
                  lang={localeInfo[l].bcp47}
                  aria-current={l === locale ? "page" : undefined}
                >
                  {localeInfo[l].nativeName}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <EraseData locale={locale} title={t.data} />

        <section className={styles.templates} aria-labelledby="settings-about">
          <h2 id="settings-about" className={styles.sectionTitle}>
            {t.about}
          </h2>
          <p className={styles.templateDesc}>{t.aboutBody}</p>
          <a className={styles.back} href={`${prefix}/open-source`}>
            {t.openSource}
          </a>
        </section>
      </main>
    </div>
  );
}
