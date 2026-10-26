import { localePrefix, type Locale } from "@ladestack/i18n";
import { alphaAgentModes } from "@ladestack/shared-types";
import { shell } from "../i18n/shell";

const modeLabels: Record<string, string> = {
  code: "Code",
  plan: "Plan",
  ask: "Ask",
  debug: "Debug",
};

export function ShellPage({ locale }: { locale: Locale }) {
  const s = shell[locale];
  return (
    <main
      style={{
        maxWidth: "var(--content-max-width)",
        margin: "0 auto",
        padding: "var(--section-rhythm) 24px",
      }}
    >
      <p style={{ color: "var(--color-muted)", fontSize: 12, textTransform: "uppercase" }}>
        {s.kicker}
      </p>
      <h1 style={{ fontWeight: 400, letterSpacing: "-0.02em" }}>{s.title}</h1>
      <p style={{ color: "var(--color-body)", maxWidth: 640, lineHeight: 1.5 }}>{s.body}</p>
      <p style={{ color: "var(--color-muted)" }}>
        {s.modes}: {alphaAgentModes.map((m) => modeLabels[m] ?? m).join(", ")}
      </p>
      {/* Plain anchor: the homepage is served by the Astro app, outside this basePath. */}
      <a href={`${localePrefix(locale)}/`} style={{ color: "var(--color-primary)" }}>
        {s.back}
      </a>
    </main>
  );
}
