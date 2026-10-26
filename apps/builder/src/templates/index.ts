import type { ProjectProfile } from "@ladestack/shared-types";

/**
 * Starter templates: runnable projects that open without any AI call (INTAKE-06).
 * Their contents are project source, so they stay in English whatever the UI locale.
 */
export interface StarterTemplate {
  id: "static-site" | "react-vite";
  profile: Exclude<ProjectProfile, "unsupported">;
  files: Record<string, string>;
}

const staticSite: StarterTemplate = {
  id: "static-site",
  profile: "static",
  files: {
    "index.html": `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>My site</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <main>
      <h1>Hello</h1>
      <p>Edit index.html to get started.</p>
      <button type="button" id="greet">Say hello</button>
      <p id="output" role="status"></p>
    </main>
    <script src="script.js"></script>
  </body>
</html>
`,
    "styles.css": `body {
  margin: 0;
  font-family: system-ui, sans-serif;
  line-height: 1.5;
}

main {
  max-width: 40rem;
  margin: 4rem auto;
  padding: 0 1.5rem;
}
`,
    "script.js": `document.getElementById("greet").addEventListener("click", () => {
  document.getElementById("output").textContent = "Hello from script.js";
});
`,
  },
};

const reactVite: StarterTemplate = {
  id: "react-vite",
  profile: "react-vite",
  files: {
    "package.json": `${JSON.stringify(
      {
        name: "my-app",
        private: true,
        version: "0.0.0",
        type: "module",
        scripts: { dev: "vite", build: "tsc -b && vite build", preview: "vite preview" },
        dependencies: { react: "^19.1.1", "react-dom": "^19.1.1" },
        devDependencies: {
          "@types/react": "^19.1.13",
          "@types/react-dom": "^19.1.9",
          "@vitejs/plugin-react": "^5.0.0",
          typescript: "^5.6.3",
          vite: "^7.1.0",
        },
      },
      null,
      2,
    )}
`,
    "index.html": `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>My app</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`,
    "vite.config.ts": `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
`,
    "tsconfig.json": `${JSON.stringify(
      {
        compilerOptions: {
          target: "ES2022",
          lib: ["ES2022", "DOM", "DOM.Iterable"],
          module: "ESNext",
          moduleResolution: "bundler",
          jsx: "react-jsx",
          strict: true,
          noEmit: true,
          skipLibCheck: true,
        },
        include: ["src"],
      },
      null,
      2,
    )}
`,
    "src/main.tsx": `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./App.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
`,
    "src/App.tsx": `import { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <main>
      <h1>Hello</h1>
      <p>Edit src/App.tsx to get started.</p>
      <button type="button" onClick={() => setCount((c) => c + 1)}>
        Clicked {count} times
      </button>
    </main>
  );
}
`,
    "src/App.css": `body {
  margin: 0;
  font-family: system-ui, sans-serif;
  line-height: 1.5;
}

main {
  max-width: 40rem;
  margin: 4rem auto;
  padding: 0 1.5rem;
}
`,
  },
};

export const starterTemplates: readonly StarterTemplate[] = [staticSite, reactVite];
