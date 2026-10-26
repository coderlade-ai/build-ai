// Real-browser smoke test under the production CSP (ADR 0015): run after `next build`.
// Fails on any CSP violation, page error, or if the app does not hydrate and mount Monaco.
// Needs Chromium: `pnpm exec playwright install --with-deps chromium`.
// Preview: build with NEXT_PUBLIC_PREVIEW_ORIGIN=http://127.0.0.1:4322; this script serves that origin.
import { spawn } from "node:child_process";
import { appendFileSync } from "node:fs";
import { chromium } from "playwright";

const port = 3109;
const base = `http://127.0.0.1:${port}/app`;
const server = spawn("pnpm", ["exec", "next", "start", "--port", String(port)], {
  stdio: "ignore",
});
const previewPort = 4322;
const previewServer = spawn(
  "node",
  [
    "../preview/scripts/serve.mjs",
    "--port",
    String(previewPort),
    "--parents",
    `http://127.0.0.1:${port}`,
  ],
  { stdio: "ignore" },
);
const checkPreview = process.env.NEXT_PUBLIC_PREVIEW_ORIGIN === `http://127.0.0.1:${previewPort}`;
const problems = [];
let stage = "starting";
const step = (name) => {
  stage = name;
  console.warn(`- ${name}`);
};

/** Ends the check, writing the outcome to the CI job summary so it is readable without logs. */
function finish(ok) {
  const text = ok
    ? "Browser check passed"
    : `Browser check failed at: ${stage}\n\n${problems.map((p) => `- ${p}`).join("\n")}`;
  // A GitHub annotation is visible on the public run page, unlike the logs.
  if (!ok && process.env.GITHUB_ACTIONS)
    process.stdout.write(
      `::error title=Browser check::${text.replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A")}\n`,
    );
  if (process.env.GITHUB_STEP_SUMMARY)
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, `### Builder browser check\n\n${text}\n`);
  server.kill("SIGKILL");
  previewServer.kill("SIGKILL");
  process.exit(ok ? 0 : 1);
}
// Never hang CI: a stuck step fails the check with the stage it was in.
setTimeout(() => {
  problems.push("timed out");
  finish(false);
}, 240_000).unref();

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
  step("builder server");
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

  step("welcome hydrates");
  // Welcome screen hydrates: the template button is interactive only after React runs.
  await page.goto(base, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Use this template" }).first().click();

  step("workspace + Monaco");
  // Workspace opens and self-hosted Monaco (AMD loader + workers) mounts under the CSP.
  await page.waitForURL(/\/app\/project\?id=/, { timeout: 15000 });
  await page.locator(".monaco-editor").first().waitFor({ timeout: 20000 });
  await page.waitForTimeout(1500); // let workers start and report violations

  step("checkpoint history");
  // Checkpoint history: open it, save a checkpoint, and see it listed.
  await page.getByRole("button", { name: "History" }).click();
  await page.getByRole("button", { name: "Save checkpoint" }).click();
  await page.getByText("Saved by you").first().waitFor({ timeout: 10000 });
  await page.getByRole("button", { name: "History" }).click();

  // Preview: the static template runs on the isolated preview origin, scripts included.
  if (checkPreview) {
    step("preview");
    await page.getByRole("button", { name: "Preview", exact: true }).click();
    const project = page
      .frameLocator('iframe[title="Preview of your project"]')
      .frameLocator("#frame");
    await project.getByRole("heading", { name: "Hello" }).waitFor({ timeout: 20000 });
    await project.getByRole("button", { name: "Say hello" }).click();
    await project.getByText("Hello from script.js").waitFor({ timeout: 5000 });
    // Console bridge: an error in the project page reaches the builder's console panel.
    const projectFrame = page.frames().find((f) => f.url().includes("/p/"));
    if (!projectFrame) throw new Error("project frame not found");
    await projectFrame.evaluate(() => console.error("bridge check"));
    await page.getByText("Console (1)").waitFor({ timeout: 5000 });

    // Open in new tab: the project page runs on its own, served by the preview's service worker.
    step("preview in new tab");
    const [tab] = await Promise.all([
      page.context().waitForEvent("page", { timeout: 10000 }),
      page.getByRole("button", { name: "Open in new tab" }).click(),
    ]);
    await tab.getByRole("heading", { name: "Hello" }).waitFor({ timeout: 20000 });
    if (!new URL(tab.url()).pathname.startsWith("/p/")) throw new Error(`new tab at ${tab.url()}`);
    await tab.close();

    // React + Vite template: bundled with esbuild-wasm on the preview origin, React from esm.sh.
    step("react preview (esbuild-wasm)");
    await page.goto(base, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Use this template" }).nth(1).click();
    await page.waitForURL(/\/app\/project\?id=/, { timeout: 15000 });
    await page.getByRole("button", { name: "Preview", exact: true }).click();
    const react = page
      .frameLocator('iframe[title="Preview of your project"]')
      .frameLocator("#frame");
    await react.getByRole("button", { name: "Clicked 0 times" }).click({ timeout: 45000 });
    await react.getByRole("button", { name: "Clicked 1 times" }).waitFor({ timeout: 5000 });

    // Tailwind: make App.css Tailwind source in Monaco; the preview compiles it in the page
    // (preflight resets the h1 to the body's font size, and a utility class takes effect).
    step("tailwind in preview");
    await page.locator("header").getByRole("button", { name: "Code", exact: true }).click();
    await page.getByRole("button", { name: "App.css", exact: true }).click();
    await page.locator(".monaco-editor").first().click();
    await page.keyboard.press("ControlOrMeta+A");
    await page.keyboard.insertText('@import "tailwindcss";\nbody { @apply bg-orange-500; }\n');
    await page.waitForTimeout(2000); // autosave
    await page.getByRole("button", { name: "Preview", exact: true }).click();
    // The frame reloads after the save; poll (surviving navigations) until Tailwind applied.
    let sizes = null;
    for (let t = Date.now(); Date.now() - t < 45000 && !sizes; ) {
      try {
        sizes = await react.locator("body").evaluate(
          (body) => {
            if (getComputedStyle(body).backgroundColor === "rgba(0, 0, 0, 0)") return null;
            const h1 = body.querySelector("h1");
            return h1 ? [getComputedStyle(h1).fontSize, getComputedStyle(body).fontSize] : null;
          },
          undefined,
          { timeout: 2000 },
        );
      } catch {
        // navigating or not rendered yet
      }
      if (!sizes) await page.waitForTimeout(500);
    }
    if (!sizes) throw new Error("Tailwind was not applied in the preview");
    if (sizes[0] !== sizes[1]) throw new Error(`Tailwind preflight not applied: h1 ${sizes[0]}`);

    // Device sizes: Mobile narrows the frame to 390px, Desktop fills the pane again.
    step("preview viewports");
    const frameWidth = () =>
      page
        .locator("iframe[sandbox]")
        .first()
        .evaluate((f) => f.getBoundingClientRect().width);
    const fullWidth = await frameWidth();
    await page.getByRole("button", { name: "Mobile", exact: true }).click();
    if (Math.round(await frameWidth()) !== 390) throw new Error("Mobile viewport is not 390px");
    await page.getByRole("button", { name: "Desktop", exact: true }).click();
    if (Math.round(await frameWidth()) !== Math.round(fullWidth))
      throw new Error("Desktop viewport does not fill the pane");
  }
  // Erase local data: after confirming, the saved projects are gone from the welcome screen.
  step("erase local data");
  await page.goto(base, { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "Your projects" }).waitFor({ timeout: 10000 });
  page.once("dialog", (d) => void d.accept());
  await Promise.all([
    page.waitForEvent("load", { timeout: 20000 }),
    page.getByRole("button", { name: "Erase all local data" }).click(),
  ]);
  await page.waitForLoadState("networkidle");
  if (await page.getByRole("heading", { name: "Your projects" }).count())
    throw new Error("Projects are still listed after erasing local data");
  step("locale page");
  await page.goto(`${base}/ja`, { waitUntil: "networkidle" });
} catch (e) {
  problems.push(String(e));
} finally {
  await browser?.close();
}
if (problems.length) {
  console.error(problems.join("\n"));
  finish(false);
}
console.warn(
  `Browser check passed: hydrated, Monaco mounted, checkpoint saved, local data erased${checkPreview ? ", static + React + Tailwind previews ran, viewports switched, new tab opened, console bridged" : ""}, no CSP violations`,
);
finish(true);
