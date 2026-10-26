// Integration check for the builder CSP (ADR 0015): run after `next build`.
// Starts the production server and checks every page sends a nonce CSP that all its scripts carry.
import { spawn } from "node:child_process";

const port = 3107;
const base = `http://127.0.0.1:${port}/app`;
const pages = ["", "/project?id=x", "/ru", "/pt/project?id=x"];
const server = spawn("pnpm", ["exec", "next", "start", "--port", String(port)], {
  stdio: "ignore",
});

async function waitUp() {
  for (let i = 0; i < 60; i++) {
    try {
      await fetch(base);
      return;
    } catch {
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  throw new Error("server did not start");
}

const failures = [];
try {
  await waitUp();
  const nonces = new Set();
  for (const page of pages) {
    const res = await fetch(base + page);
    const csp = res.headers.get("content-security-policy") ?? "";
    const nonce = csp.match(/'nonce-([^']+)'/)?.[1];
    if (res.status !== 200) failures.push(`${page}: status ${res.status}`);
    if (!nonce || !csp.includes("'strict-dynamic'")) failures.push(`${page}: missing nonce CSP`);
    if (/unsafe-eval|script-src[^;]*unsafe-inline/.test(csp))
      failures.push(`${page}: unsafe script source`);
    if (res.headers.get("x-content-type-options") !== "nosniff")
      failures.push(`${page}: no nosniff`);
    nonces.add(nonce);
    const html = await res.text();
    const scripts = html.match(/<script\b[^>]*>/g) ?? [];
    if (scripts.length === 0) failures.push(`${page}: no scripts found`);
    for (const tag of scripts)
      if (!tag.includes(`nonce="${nonce}"`))
        failures.push(`${page}: script without nonce: ${tag.slice(0, 80)}`);
  }
  if (nonces.size !== pages.length) failures.push("nonce reused across responses");
  const unknown = await fetch(`${base}/xx`);
  if (unknown.status !== 404) failures.push(`/xx: expected 404, got ${unknown.status}`);
} finally {
  server.kill();
}
if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.warn(`CSP check passed for ${pages.length} pages`);
