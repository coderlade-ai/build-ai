// Real-browser smoke test under the production CSP (ADR 0015): run after `next build`.
// Fails on any CSP violation, page error, or if the app does not hydrate and mount Monaco.
// Needs Chromium: `pnpm exec playwright install --with-deps chromium`.
import { spawn } from "node:child_process";
import { chromium } from "playwright";

const port = 3109;
const base = `http://127.0.0.1:${port}/app`;
const server = spawn("pnpm", ["exec", "next", "start", "--port", String(port)], {
  stdio: "ignore",
});
const problems = [];

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

let browser;
try {
  await waitUp();
  browser = await chromium.launch();
  const page = await browser.newPage();
  page.on("pageerror", (e) => problems.push(`page error: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error" && /Content Security Policy|Refused to/i.test(m.text()))
      problems.push(`console: ${m.text()}`);
  });
  await page.addInitScript(() => {
    document.addEventListener("securitypolicyviolation", (e) =>
      console.error(`Refused to load (CSP ${e.violatedDirective}): ${e.blockedURI}`),
    );
  });

  // Welcome screen hydrates: the template button is interactive only after React runs.
  await page.goto(base, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Use this template" }).first().click();

  // Workspace opens and self-hosted Monaco (AMD loader + workers) mounts under the CSP.
  await page.waitForURL(/\/app\/project\?id=/, { timeout: 15000 });
  await page.locator(".monaco-editor").first().waitFor({ timeout: 20000 });
  await page.waitForTimeout(1500); // let workers start and report violations

  // Checkpoint history: open it, save a checkpoint, and see it listed.
  await page.getByRole("button", { name: "History" }).click();
  await page.getByRole("button", { name: "Save checkpoint" }).click();
  await page.getByText("Saved by you").first().waitFor({ timeout: 10000 });
  await page.goto(`${base}/ja`, { waitUntil: "networkidle" });
} catch (e) {
  problems.push(String(e));
} finally {
  await browser?.close();
  server.kill();
}
if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.warn("Browser check passed: hydrated, Monaco mounted, checkpoint saved, no CSP violations");
