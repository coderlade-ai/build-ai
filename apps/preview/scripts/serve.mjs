// Local preview origin for development and the browser check. Not for production.
// node scripts/serve.mjs --port 4322 --parents http://127.0.0.1:3109
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { contentTypeFor } from "../src/lib.js";
import { hostHeaders, parseParents } from "./headers.mjs";
import { esbuildFiles, tailwindFile } from "./vendor.mjs";

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : fallback;
};
const port = Number(arg("port", "4322"));
const parents = parseParents(arg("parents", "http://localhost:3001"));
const files = new Set(["index.html", "host.js", "lib.js", "sw.js", "bundle.js"]);

createServer(async (req, res) => {
  const path = new URL(req.url ?? "/", "http://x").pathname.slice(1) || "index.html";
  const headers = hostHeaders(parents);
  if (path === "config.js") {
    res.writeHead(200, { ...headers, "Content-Type": contentTypeFor(path) });
    res.end(`export const allowedParents = ${JSON.stringify(parents)};\n`);
  } else if (path === "vendor/tailwind/browser.js") {
    res.writeHead(200, { ...headers, "Content-Type": contentTypeFor(path) });
    res.end(await readFile(tailwindFile));
  } else if (path.startsWith("vendor/esbuild/") && path.slice(15) in esbuildFiles) {
    res.writeHead(200, { ...headers, "Content-Type": contentTypeFor(path) });
    res.end(await readFile(esbuildFiles[path.slice(15)]));
  } else if (files.has(path)) {
    res.writeHead(200, { ...headers, "Content-Type": contentTypeFor(path) });
    res.end(await readFile(new URL(`../src/${path}`, import.meta.url)));
  } else {
    res.writeHead(404, { ...headers, "Content-Type": "text/plain" });
    res.end("Not found");
  }
}).listen(port, "127.0.0.1", () => console.warn(`Preview origin on http://127.0.0.1:${port}`));
