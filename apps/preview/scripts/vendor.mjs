// esbuild-wasm files served by the preview origin under /vendor/esbuild/ (ADR 0018).
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const root = dirname(createRequire(import.meta.url).resolve("esbuild-wasm/package.json"));
const require = createRequire(import.meta.url);
/** @tailwindcss/browser (MIT): compiles Tailwind in bundled previews, served at /vendor/tailwind/. */
export const tailwindFile = join(
  dirname(require.resolve("@tailwindcss/browser/package.json")),
  "dist/index.global.js",
);
export const esbuildFiles = {
  "esbuild.js": join(root, "esm/browser.min.js"),
  "esbuild.wasm": join(root, "esbuild.wasm"),
};
