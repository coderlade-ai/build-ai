// esbuild-wasm files served by the preview origin under /vendor/esbuild/ (ADR 0018).
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const root = dirname(createRequire(import.meta.url).resolve("esbuild-wasm/package.json"));
export const esbuildFiles = {
  "esbuild.js": join(root, "esm/browser.min.js"),
  "esbuild.wasm": join(root, "esbuild.wasm"),
};
