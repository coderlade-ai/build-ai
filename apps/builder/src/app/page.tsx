import { alphaAgentModes } from "@ladestack/shared-types";

const modeLabels: Record<string, string> = {
  code: "Code",
  plan: "Plan",
  ask: "Ask",
  debug: "Debug",
};

export default function BuilderHome() {
  return (
    <main
      style={{
        maxWidth: "var(--content-max-width)",
        margin: "0 auto",
        padding: "var(--section-rhythm) 24px",
      }}
    >
      <p style={{ color: "var(--color-muted)", fontSize: 12, textTransform: "uppercase" }}>
        Builder · in development
      </p>
      <h1 style={{ fontWeight: 400, letterSpacing: "-0.02em" }}>LadeStack Build workspace</h1>
      <p style={{ color: "var(--color-body)", maxWidth: 640, lineHeight: 1.5 }}>
        The editor, agent, preview and checkpoints are not built yet. This shell only proves the
        /app route, shared tokens and shared types work.
      </p>
      <p style={{ color: "var(--color-muted)" }}>
        Alpha modes planned: {alphaAgentModes.map((m) => modeLabels[m] ?? m).join(", ")}
      </p>
    </main>
  );
}
