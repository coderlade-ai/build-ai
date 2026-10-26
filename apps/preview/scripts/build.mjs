// Copies the preview host to dist/ with the allowed builder origins baked in, plus a _headers file.
// PREVIEW_PARENT_ORIGINS="https://build.ladestack.in" pnpm --filter @ladestack/preview build
import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { hostHeaders, parseParents } from "./headers.mjs";

const parents = parseParents(process.env.PREVIEW_PARENT_ORIGINS ?? "http://localhost:3001");
const dist = new URL("../dist/", import.meta.url);
await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp(new URL("../src/", import.meta.url), dist, {
  recursive: true,
  filter: (src) => !src.endsWith(".test.ts"),
});
await writeFile(
  new URL("config.js", dist),
  `export const allowedParents = ${JSON.stringify(parents)};\n`,
);
const headers = Object.entries(hostHeaders(parents))
  .map(([k, v]) => `  ${k}: ${v}`)
  .join("\n");
await writeFile(new URL("_headers", dist), `/*\n${headers}\n`);
console.warn(`Preview built for ${parents.join(", ")}`);
