# LadeStack Build — Complete Developer, AI Agent & Operations Guide

**Product:** LadeStack Build  
**Primary domain:** `https://build.ladestack.in`  
**Public website:** Astro.js, mounted at `/`  
**AI Builder:** Next.js App Router, mounted at `/app`  
**Product model:** Lifetime free platform · no mandatory user authentication · Bring Your Own Key (BYOK) · local-first projects  
**Document:** `GUIDE.md`  
**Updated:** 21 October 2026  
**Intended readers:** Human developers, AI coding agents, maintainers, content editors, accessibility reviewers, QA engineers, and release operators  
**Document status:** Detailed **implementation and operations guide**, not evidence that the described features or deployments have been implemented or verified.

> [!IMPORTANT]
> **MANDATORY GITHUB DELIVERY RULE — EVERY COMPLETED CHANGE MUST BE PUSHED.** After **every completed atomic source-code write/edit or other intentional change** to the **LadeStack Build product repository**, inspect the diff, run the relevant checks, stage only authorized files, create a scoped commit, **push that commit to the approved GitHub remote/branch**, and **verify the remote contains it**. This applies to source code, content, translations, configuration, dependencies, tests, documentation, UI assets, and this guide. **Do not wait until the end of a long feature session to push independently completed changes.** Never commit secrets, bypass failed checks, push unrelated work, force-push, or bypass branch protection. If delivery is blocked by authentication, unavailable Git access, failing validation, conflicts, review requirements, or policy, **stop, preserve work, and clearly report the unpushed change**. Do not report a push as successful unless verified. This rule **does not** authorize uploading users' browser-local projects to GitHub.

> [!NOTE]
> This guide is designed to be useful in a new or existing repository. **Example commands, package paths, routes, scripts, and adapter interfaces are proposed conventions**. Inspect the actual repository before executing them; never invent or silently assume an existing project script or completed feature.

---

## Table of Contents

1. [Purpose and how to use this guide](#1-purpose-and-how-to-use-this-guide)
2. [Product contract and non-negotiable decisions](#2-product-contract-and-non-negotiable-decisions)
3. [Instruction hierarchy and repository references](#3-instruction-hierarchy-and-repository-references)
4. [Mandatory GitHub push: operational procedure](#4-mandatory-github-push-operational-procedure)
5. [Developer workstation and prerequisites](#5-developer-workstation-and-prerequisites)
6. [First-day repository inspection](#6-first-day-repository-inspection)
7. [Recommended monorepo layout](#7-recommended-monorepo-layout)
8. [Architecture and request flow](#8-architecture-and-request-flow)
9. [Domains, routing, cross-app boundaries and proxying](#9-domains-routing-cross-app-boundaries-and-proxying)
10. [Design specification and component selection](#10-design-specification-and-component-selection)
11. [Build the Astro marketing application](#11-build-the-astro-marketing-application)
12. [Landing page sections: implementation walkthrough](#12-landing-page-sections-implementation-walkthrough)
13. [Separate pages, footer, legal pages and errors](#13-separate-pages-footer-legal-pages-and-errors)
14. [Eight-language internationalization](#14-eight-language-internationalization)
15. [Markdown blog publishing workflow](#15-markdown-blog-publishing-workflow)
16. [SEO, structured data and content quality](#16-seo-structured-data-and-content-quality)
17. [Build the Next.js application shell](#17-build-the-nextjs-application-shell)
18. [Welcome screen, templates and attachment intake](#18-welcome-screen-templates-and-attachment-intake)
19. [Project workspace: editor, preview and AI capsule](#19-project-workspace-editor-preview-and-ai-capsule)
20. [Adapting Kilo Code safely](#20-adapting-kilo-code-safely)
21. [Agent modes, prompts and context construction](#21-agent-modes-prompts-and-context-construction)
22. [Tool calling, approval policy and execution loop](#22-tool-calling-approval-policy-and-execution-loop)
23. [BYOK provider configuration and credential handling](#23-byok-provider-configuration-and-credential-handling)
24. [Runtime candidate research and benchmark plan](#24-runtime-candidate-research-and-benchmark-plan)
25. [Browser runtime lifecycle and npm automation](#25-browser-runtime-lifecycle-and-npm-automation)
26. [Structured code streaming and reconciliation](#26-structured-code-streaming-and-reconciliation)
27. [Local-first IndexedDB and OPFS storage](#27-local-first-indexeddb-and-opfs-storage)
28. [Checkpoints, diffs, rollback and migration](#28-checkpoints-diffs-rollback-and-migration)
29. [Project import, export and ZIP safety](#29-project-import-export-and-zip-safety)
30. [Settings and permissions user journeys](#30-settings-and-permissions-user-journeys)
31. [Security, privacy and threat modeling](#31-security-privacy-and-threat-modeling)
32. [Accessibility, responsive layouts and performance](#32-accessibility-responsive-layouts-and-performance)
33. [Testing strategy and quality gates](#33-testing-strategy-and-quality-gates)
34. [Local development and integration workflows](#34-local-development-and-integration-workflows)
35. [Deployment on Vercel or Cloudflare](#35-deployment-on-vercel-or-cloudflare)
36. [Observability and error handling](#36-observability-and-error-handling)
37. [Troubleshooting playbooks](#37-troubleshooting-playbooks)
38. [Translation, blog and design review checklists](#38-translation-blog-and-design-review-checklists)
39. [Feature-by-feature delivery playbooks](#39-feature-by-feature-delivery-playbooks)
40. [Release process and rollback](#40-release-process-and-rollback)
41. [Development roadmap and milestone gates](#41-development-roadmap-and-milestone-gates)
42. [Definition of done and final reporting](#42-definition-of-done-and-final-reporting)
43. [Quick reference and common commands](#43-quick-reference-and-common-commands)
44. [Non-goals, assumptions and open decisions](#44-non-goals-assumptions-and-open-decisions)
45. [Operational checklists](#45-operational-checklists)
46. [Appendix: implementation contracts and examples](#46-appendix-implementation-contracts-and-examples)

---

## 1. Purpose and how to use this guide

`GUIDE.md` is the step-by-step field manual for implementing, validating, shipping, and maintaining LadeStack Build. It is not a substitute for reading source code, verifying runtime support, running tests, or checking third-party terms. Its goal is to make routine decisions repeatable while protecting source integrity and visitor projects.

### 1.1 Recommended reading path

| Role | Start here | Then read |
| --- | --- | --- |
| New developer | §§ 1–9 | § 10, § 17, §§ 33–35 |
| AI coding agent | §§ 2–4 | Relevant technical chapter, §§ 33, 42 |
| Astro/content contributor | §§ 10–16 | §§ 32, 38 |
| Next.js UI contributor | §§ 17–19 | §§ 30, 32 |
| Agent/tool developer | §§ 20–26 | §§ 28, 31, 33 |
| Storage engineer | §§ 27–29 | §§ 31, 37 |
| Release/operations owner | §§ 4, 33–37 | §§ 40, 42, 45 |

### 1.2 Work one coherent unit at a time

1. Locate the relevant product specification and current implementation.
2. Identify the smallest demonstrably correct deliverable.
3. Note security, compatibility, migration, localization, and deployment effects.
4. Implement only authorized scope, including tests and required translations.
5. Validate with real repository commands and observable results.
6. Complete the **mandatory GitHub commit/push/remote-verification cycle**.
7. Report completed work, tests, caveats, commit, and remote status.
8. Start the next independent unit only after the previous completed unit is delivered or a blocker is declared.

Never treat an architecture diagram, README statement, example snippet, or prior AI answer as evidence that a feature is already live.

## 2. Product contract and non-negotiable decisions

### 2.1 What the product is

LadeStack Build is a no-code/low-code, agentic AI website and application builder. Visitors describe a project, optionally supply references, and use their own AI provider keys to generate, inspect, modify, preview, and download their source code. The product targets an accessible, polished developer experience without forcing the user to register.

### 2.2 Fixed decisions

- **Brand/domain:** LadeStack Build at `build.ladestack.in`; use original LadeStack marks and copy.
- **Public entry:** An Astro.js marketing website appears first, not the editing application.
- **Main CTA:** `Start Building` navigates to the Next.js app under `/app`.
- **Homepage sections:** Features, Use Cases, How It Works, and Technology live **on the landing page**, accessible via section anchors. **Do not create separate marketing routes** for them.
- **Separate pages:** About, Contact (email/social links; no required contact form), multilingual Markdown Blog, legal disclosures, and error handling.
- **Languages:** Exactly eight currently requested locales: English (`en`), Russian (`ru`), Japanese (`ja`), Korean (`ko`), Simplified Chinese (`zh`), Turkish (`tr`), French (`fr`), and Portuguese (`pt`). Clarify a regional Chinese/Portuguese variant before translating region-specific material; keep chosen variants consistent.
- **Free forever:** No product subscriptions, credit checkout, pricing tables, or mandatory sign-in/signup.
- **BYOK:** AI usage is funded by the visitor's provider account. Explain that provider charges may apply.
- **Local-first:** Projects and settings in IndexedDB; OPFS may hold larger binary assets/caches. No required application database for account profiles or cloud project sync.
- **App framework:** Next.js App Router, mounted under `/app` at the canonical domain.
- **Agent reference:** Kilo Code source and concepts for modes, tool calling, system prompts, permissions, workflow, context, sessions, and checkpoints; browser-compatible adaptation is required.
- **Code workspace:** Monaco Editor, VS Code-like file/folder explorer, manually editable source files, Code/Preview modes, live AI code streaming, and a small bottom-centered agent capsule.
- **Runtime:** Benchmark WebContainers, Lifo, Wasmer, and lightweight frontend alternatives before locking a commercial-grade choice.
- **Dependency flow:** Generate project-appropriate `package.json`; install/reconcile dependencies automatically when a valid manifest is committed. No manual terminal commands required for normal users.
- **Recovery:** Automatic checkpoints, version diffs, rollback, local restoration, and source ZIP download.
- **Hosting:** Optimize for Vercel or Cloudflare; do not assume they support the same Next.js adapters, server APIs, or limits.
- **Design:** Apply the supplied cream/orange editorial specification to the marketing website; keep the actual IDE practical and visually related, not blindly light-themed.

### 2.3 Prohibited product drift

Do not introduce a pricing page because a template contains pricing components. Do not silently add mandatory auth, cloud upload of user code, fake usage metrics, unsupported universal-framework claims, or auto-approval of dangerous tools. Do not copy Cursor/Lovable branding, proprietary fonts, or other products' protected assets.

### 2.4 Honest capability claims

Use `planned`, `experimental`, `benchmark-qualified`, `implemented`, and `production-verified` precisely. A browser preview is not the same as a continuously hosted production backend. A UI that accepts a `.py` file does not imply Python execution. A runtime that accepts a `package.json` does not guarantee every native npm dependency works.

## 3. Instruction hierarchy and repository references

Read and reconcile, when present:

1. The latest explicit user instructions and authorized repository policies.
2. `README.md`: product vision and scope.
3. `INSTRUCTIONS.md`: execution contract.
4. `AGENT.md`: agent operating manual. **Note:** many agent tools auto-detect `AGENTS.md` (plural); do not assume `AGENT.md` auto-loads. Set an explicit reference if required.
5. `SKILL.md`: skill-level engineering guardrails.
6. `do-&-not-do.md`: affirmative and prohibited practices.
7. User-provided `design.md` (or its attached equivalent): visual reference; pricing sections excluded.
8. Actual repository code, lockfiles, package configurations, deployment manifests, CI, tests, and current upstream documentation.

In conflicting instructions, never silently guess: prefer the user's latest explicit decision subject to higher-priority security/authorization rules; report unresolved structural conflicts. Requirements documents do not override the actual capabilities of third-party runtimes.

### 3.1 Before any task, record

- Task objective and expected user-visible behavior.
- Exact repository/worktree and current branch.
- Files/modules likely to change.
- Any uncommitted work owned by other contributors.
- Data migration risks and previous project storage formats.
- Languages and public URLs affected.
- Runtime/provider/licensing dependencies.
- Test evidence needed for completion.
- Whether push access and branch permission actually exist.

## 4. Mandatory GitHub push: operational procedure

**MANDATORY USER INSTRUCTION: PUSH TO GITHUB AFTER EVERY COMPLETED CHANGE AND EVERY COMPLETED CODE WRITE/EDIT.**

The unit of delivery is a **small, coherent, verified atomic change**. It may include several inseparable files (implementation, tests, translations, docs), but **not** an accumulation of unrelated finished changes. Partial model tokens, halfway file writes, and broken intermediate edits are not individual push units. Finish an atomic unit, validate it, then push it before beginning the next independently complete unit.

### 4.1 Before touching files

```bash
# Examples only; run in the confirmed product repository.
pwd
git rev-parse --show-toplevel
git status --short --branch
git branch --show-current
git remote -v
git branch -vv
```

Identify the approved `origin`/upstream and branch policy. A GitHub URL given in a conversation may be contextual, not permission to push there. Verify the configured repository; never infer it merely from the LadeStack brand.

### 4.2 Finish one atomic change

1. Inspect changed files (`git status`, `git diff`, and staged diff).
2. Run **actual available** relevant tests, type checks, lint, build, link checks, i18n checks, or security checks. Discover script names in `package.json`/CI first.
3. Scan for secrets and personal data. Exclude `.env*` credentials, tokens, private attachments, local projects, browser exports, `node_modules`, and generated caches.
4. Stage **only** intended files; do not use indiscriminate staging in a dirty worktree.
5. Commit with a precise message, e.g. `feat(web): add localized feature section` or `fix(builder): guard dependency installs`.
6. Push to the existing **authorized** upstream. Do not create a public repo or choose a new remote without authorization.
7. Verify the remote branch includes the new commit and report the outcome.

```bash
# Illustrative ONLY. Replace paths with actually changed approved files.
git diff --check
git diff -- path/to/changed-file
# Run repository-specific validation scripts here.
git add -- path/to/changed-file
git diff --cached --check
git diff --cached --stat
git diff --cached
git commit -m "docs: improve contributor guide"
git push
# Confirm branch/upstream alignment after a successful push:
git status --short --branch
git log -1 --format='%h %s'
# Optional independent confirmation of upstream tip:
git rev-parse HEAD
git rev-parse '@{upstream}'
```

The final two hashes must match when `@{upstream}` is defined and refreshed by a successful push. If branch protection mandates pull requests, push to an approved topic branch and follow the repository's review process. **Pushing code is not the same as merging or deploying it.**

### 4.3 Explicit blockers and forbidden shortcuts

- Never force-push, discard someone else's work, rewrite branch history, or bypass required checks.
- Never push a known failing or insecure change merely to satisfy timing.
- Never claim pushed/delivered on a local commit, attempted command, or assumed CI pass.
- If access is missing, state: **"Local change complete; GitHub push blocked: [specific reason]."** Include local commit ID, branch, and next action if available.
- If no repository exists, do not invent a remote or upload user project data. State what is local and request the repository context/authorized access.
- Respect the environment's explicit approval and credential requirements. An autonomous agent must not manufacture credentials or expose secrets to make a push work.

### 4.4 Absolute privacy boundary

This policy applies **only to the LadeStack Build product source repository**. It **never** authorizes silently uploading a visitor's AI-generated project, IndexedDB files, prompts, BYOK key, or reference attachments. End-user GitHub publishing, if added in the future, must be separate, explicit, opt-in, scoped, and confirmation-driven.

### 4.5 Done means delivered

A coding agent's final report for a changed atomic unit must name: files changed; purpose; tests run/results; Git commit; remote/branch; successful push verification or exact blocker; known limitations. This guide itself is not considered pushed just because it was generated as a downloadable artifact.

## 5. Developer workstation and prerequisites

### 5.1 Required tools

- Git with working identity and **authorized** GitHub access if repository delivery is expected.
- Node.js version selected by the verified package manifests/CI (prefer a supported LTS; never assume a numeric version without checking).
- The exact package manager and version specified by `packageManager`/lockfile (`pnpm`, `npm`, `yarn`, or `bun`).
- A modern Chromium browser for first-pass browser-runtime research; Safari and Firefox for cross-browser testing.
- A code editor or AI coding environment capable of working with the actual repository.
- Browser DevTools for network, storage, console, service workers, permissions, and performance profiling.
- Deployment access to **authorized** Vercel/Cloudflare accounts if deployment is in scope.

Optional: a local HTTP proxy for composite Astro/Next development, Lighthouse, Playwright, network throttling profiles, and accessibility inspection tools.

### 5.2 Environment safety

- Use `.env.example` for variable names and safe placeholders, never usable secrets.
- Keep provider API keys outside tracked code and tests.
- Use dummy BYOK keys for mocks; test live provider usage only with authorized keys and known budgets.
- Never infer that a CLI login establishes hosting domain permissions.
- Avoid installing random packages, browser extensions, or remote shell scripts without dependency scrutiny.

### 5.3 First-run command discipline

Do **not** paste a made-up universal command sequence into a fresh repo. First inspect `package.json`, workspace manifests, lockfile, README, and existing scripts. Then run the correct `install`, `dev`, `lint`, `test`, `typecheck`, and `build` commands for that repository. Record tool versions used for a reproducible result.

## 6. First-day repository inspection

Before implementation:

1. Inspect `git status` and avoid overwriting unrelated work.
2. Map existing Astro and Next applications, package manifests, builds, lockfiles, and deployment files.
3. Find the current homepage and route ownership; verify `/app` routing strategy.
4. Inspect existing `IndexedDB` database names, stores, schema versions, active-project keys, and migrations; never initialize a replacement DB blindly.
5. Inspect current AI provider adapters, system prompts, tool registries, and any Kilo source code already imported.
6. Identify runtime initialization and current WebContainer/alternative integration, if any.
7. Examine service workers, COOP/COEP headers, preview iframe policies, and browser support fallbacks.
8. Inspect design tokens/components and any imported proprietary assets.
9. Inspect i18n locale sets, Markdown blog content, sitemap and `hreflang` behavior.
10. Run only applicable baseline checks and note current failures **before** modifying anything.
11. Confirm repository remote and delivery permissions for mandatory pushes.

Produce a short evidence-based assessment: **Present / Missing / Partial / Unknown** for each major capability. Do not equate a mocked screen, dependency name, or README promise with a working feature.

## 7. Recommended monorepo layout

A maintainable **proposed** layout (adapt if the checked-out repository already uses a legitimate alternative):

```text
ladestack-build/
├── apps/
│   ├── web/                     # Astro marketing pages + Markdown/blog
│   │   ├── src/
│   │   │   ├── pages/
│   │   │   ├── layouts/
│   │   │   ├── components/
│   │   │   ├── content/
│   │   │   ├── i18n/
│   │   │   └── styles/
│   │   └── public/
│   └── builder/                 # Next.js App Router under /app
│       ├── app/                 # Or src/app according to actual repo
│       ├── components/
│       ├── features/
│       ├── lib/
│       └── public/
├── packages/
│   ├── design-system/           # Shared tokens + carefully reusable UI
│   ├── i18n/                    # Locale registry, keys and conventions
│   ├── agent-core/              # Browser-adapted agent orchestration
│   ├── provider-adapters/       # BYOK providers + model capabilities
│   ├── runtime-adapters/        # WebContainers/Lifo/Wasmer interfaces
│   ├── project-storage/         # IndexedDB/OPFS migrations/transactions
│   ├── tool-contracts/          # Schemas + permission definitions
│   └── shared-types/
├── docs/
│   ├── architecture/
│   ├── audits/
│   ├── benchmarks/
│   ├── security/
│   └── releases/
├── scripts/                     # Verified tooling, if needed
├── tests/                       # Contract and cross-app E2E tests
├── README.md
├── SKILL.md
├── AGENT.md
├── do-&-not-do.md
├── INSTRUCTIONS.md
└── GUIDE.md
```

### 7.1 Package boundaries

- The Astro site must not load the heavy Monaco editor or browser runtime just to render marketing copy.
- The Next.js app should not import Astro internals.
- A shared design package may distribute tokens and light primitives; review bundle effects of cross-framework components.
- Agent core must not assume a native Node filesystem or unrestricted shell.
- Runtime adapters implement capability contracts, not framework-specific assumptions hidden in React components.
- Project storage must not be coupled to a single runtime filesystem.
- Do not maintain different, inconsistent locale registries in the two applications.

### 7.2 Dependency governance

Pin or constrain production dependencies intentionally; preserve lockfiles; review licenses, transitive packages, known vulnerabilities, release health, and bundle size. Avoid copying an entire upstream monorepo when only some Kilo modules or concepts are suitable.

## 8. Architecture and request flow

```text
Visitor
   │
   ▼
Astro Marketing Site  ──[Start Building + locale]──►  Next.js Builder Shell
                                                       │
                                    ┌──────────────────┼──────────────────┐
                                    ▼                  ▼                  ▼
                              AI Agent Core        Project Store      Monaco/UI
                                    │            IndexedDB + OPFS         │
                           BYOK Provider Layer         │             File tabs
                                    │                  │                  │
                           Streaming decisions ──► Tool Registry        │
                                                       │                  │
                                                  Permissions ───────► Capsule
                                                       │
                                               Runtime Adapter
                                                       │
                                         npm / filesystem / processes
                                                       │
                                              Isolated Preview
```

**Trust boundary:** The product UI is trusted only to the extent its origin, dependencies, and credential handling are secured. Agent output, uploaded files, npm packages, runtime processes, and generated previews are **untrusted**. The marketing website cannot assume it can directly read the Builder origin's IndexedDB when origins or paths differ.

### 8.1 Major independent services

1. **Marketing:** Static localized content, article rendering, SEO.
2. **Builder UI:** Welcome, workspace, settings, templates, accessibility.
3. **Agent orchestrator:** Model requests, structured tool calls, budgeting, prompts, context, subagents.
4. **Tool executor:** Permission checks, validation, safe file operations, runtime interactions.
5. **Runtime manager:** Boot, install, process lifecycle, diagnostics, preview readiness.
6. **Storage manager:** Persistent project model, revisions, attachments, exports.
7. **Provider boundary:** BYOK capabilities, streaming, CORS/relay behavior.

## 9. Domains, routing, cross-app boundaries and proxying

### 9.1 Canonical routing contract

| URL | Application | Purpose |
| --- | --- | --- |
| `/` | Astro | English homepage |
| `/#features`, `/#use-cases`, `/#how-it-works`, `/#technology` | Astro | **Homepage anchors**, not separate pages |
| `/about`, `/contact`, `/blog`, `/blog/[slug]` | Astro | Separate editorial pages |
| `/privacy`, `/terms`, `/disclaimer`, `/open-source` | Astro | Legal, disclosures and attribution |
| `/ru/`, `/ja/`, `/ko/`, `/zh/`, `/tr/`, `/fr/`, `/pt/` | Astro | Localized routes |
| `/app` | Next.js | English welcome and project dashboard |
| `/app/ja` | Next.js | Example localized builder welcome route |
| `/app/project/[id]` | Next.js | English project workspace |
| `/app/settings` | Next.js | Builder settings |

**Important:** Above Next.js route examples depend on how the application implements locale segments behind a `basePath` of `/app`. Verify the final route table against the actual proxy and Next build. Never accidentally generate `/app/app/...` or allow Astro fallback to swallow Next assets.

### 9.2 Two independently built applications

- The recommended design is **one public host** with a path-aware proxy/edge routing layer.
- Astro owns public pages; Next owns `/app`, `/app/*`, its static asset paths, and its server endpoints.
- Test Next `basePath` and any asset prefix; do not rely on a redirect alone if same-host routes are promised.
- Route priority must prevent Next rewrites from capturing Astro content or vice versa.
- Service Worker scope and caching must not allow generated preview code to control trusted site paths.
- `Cache-Control`, locale cookies (if any), COOP/COEP, CSP, and asset hosting policies must be tested together.
- Maintain shared branding and locale handoff via navigation URL; do not require cross-app hidden storage access.

### 9.3 Fallback architecture

If a single-host composite application creates unacceptable runtime isolation, adapter, routing, or support burdens, document the trade-off and request explicit approval before moving the Builder to a subdomain. **Do not silently change the promised canonical URL.**

---
## 10. Design specification and component selection

The user's supplied design specification describes a quiet, editorial, Cursor-inspired **visual language**. Adapt it to LadeStack with **original branding and assets**, not a duplicate website or licensed font bundle. Ignore **all pricing-specific components and layouts**, including pricing tiers, featured plans, sign-up/paywall visuals, and "Enterprise Sales" navigation.

### 10.1 Marketing design tokens

| Token | Suggested value | Meaning |
| --- | --- | --- |
| `canvas` | `#F7F7F4` | Warm cream page background |
| `canvas-soft` | `#FAFAF7` | IDE illustration panes |
| `surface-card` | `#FFFFFF` | Cards against cream |
| `surface-strong` | `#E6E5E0` | Subtle tags and surfaces |
| `ink` | `#26251E` | Display and strong text |
| `body` | `#5A5852` | Running text |
| `muted` | `#807D72` | Supporting labels |
| `hairline` | `#E6E5E0` | Hairline dividers |
| `hairline-strong` | `#CFCDC4` | Control outlines |
| `primary` | `#F54E00` | Rare LadeStack orange CTA accent |
| `primary-active` | `#D04200` | Pressed action state |
| `success` | `#1F8A65` | Semantic confirmations |
| `error` | `#CF2D56` | Semantic errors |

**Accessibility:** Never blindly use white text over orange because it appears in a design reference. Measure foreground/background contrast and adjust the text color or accessible action variant for WCAG-level contrast. Test hover, active, disabled, focus-visible, high-contrast, and reduced-motion states missing from the reference.

### 10.2 Agent activity palette

Use only within illustrations and actual agent activity/timeline components:

| Event | Pastel | Token |
| --- | --- | --- |
| Thinking | Peach `#DFA88F` | `timeline-thinking` |
| Search / Grep | Mint `#9FC9A2` | `timeline-grep` |
| Read | Blue `#9FBBE0` | `timeline-read` |
| Edit | Lavender `#C0A8DD` | `timeline-edit` |
| Done | Gold `#C08532` | `timeline-done` |

Pastels communicate activity classes, **not** critical success, error, access, or warning semantics. Real semantic states need distinguishable labels and icons, not color alone.

### 10.3 Typography and spacing

- Source specification display sizing: desktop mega heading approximately 72px, section heading 36px, subhead 26px; adapt fluidly and verify text wrapping across eight languages.
- Use accessible/open or properly licensed substitutes such as Inter or Geist. **Do not distribute CursorGothic** without an explicit license.
- Use JetBrains Mono for code, terminal surfaces, file paths, and IDE mockups.
- Display weight ≈400 and tight tracking; headings should be editorial, not large fake-tech bold.
- 4px-based scale; desktop section rhythm ≈80px; content width ≈1200px; 12-column editorial grid.
- Card radius ≈12px; input/CTA radius ≈8px; restrained pills for AI states.
- Depth through white-on-cream, fine strokes, and spacing; **avoid decorative drop-shadow stacks**.
- On mobile, headings and layouts must shrink intentionally; cards go 3→2→1 columns, navigation collapses, and IDE illustrations simplify.

### 10.4 Component library assignment

| Source | Appropriate use | Avoid |
| --- | --- | --- |
| shadcn/ui | Primary buttons, dialogs, sheets, navigation, menu, form composition | Installing redundant variants of the same primitive |
| Adobe React Aria | Accessible tree views, focus behavior, collection patterns, keyboard interactions | Replacing a stable working editor/IDE model just to use primitives |
| Kibo UI | Audited dropzone, code block, utility pickers, functional additions | Assuming every component matches chosen React Aria/shadcn base |
| Aceternity UI | Selective landing-card motion, subtle interactive enhancements | Animating Monaco editor or importing huge visual dependencies |
| Vibrant.design | Editorial layout inspiration, typography research | Copying copyrighted screenshots, layouts, or other creators' assets |
| Monaco Editor | Actual interactive VS Code-style source editor, diagnostics, diff | Replacing it with a read-only code block |
| Lucide | Consistent icon set | Excessive icon density or ambiguous icon-only controls |

Audit licensing **per imported package/component**. Marketing components and source-code templates exported to customers have different redistribution implications. Do not automatically include licensed UI vendor snippets in a user's ZIP.

### 10.5 Design review checklist

- [ ] Cream/orange look aligns with supplied reference and original LadeStack identity.
- [ ] Every button/field has keyboard/focus/disabled/error states.
- [ ] Primary CTAs use orange sparingly; no pricing or auth CTA.
- [ ] French/Russian longer copy does not overflow; Japanese/Korean/Chinese typography is legible.
- [ ] Marketing screenshot is genuine or labeled as conceptual, not misrepresented as live.
- [ ] Actual IDE is legible and high-performance even when marketing is light-themed.
- [ ] Third-party licenses and font rights are documented.

## 11. Build the Astro marketing application

The public website should be **static-first** and SSR only where justified. Its primary responsibilities are education, discovery, trust, SEO, and a clear entry into the Builder.

### 11.1 Implementation steps

1. Confirm the actual Astro version, project root, routing conventions, content configuration, and configured deployment adapter.
2. Implement a reusable marketing layout: semantic page shell, header, footer, main landmark, language selector, global styles, SEO head.
3. Establish shared tokens rather than hardcoded colors in every component.
4. Wire default English pages and localized routes using the locale registry.
5. Make internal navigation locale-aware; section anchors on home must remain valid from subpages.
6. Add minimal client-side islands only to truly interactive portions such as menu, tabs, or filtered cards.
7. Verify page rendering with JavaScript disabled for core headings, copy, navigation, and blog content.
8. Add static page builds, accessibility checks, local previews, sitemap validation, and internal-link tests.
9. Complete one atomic change, validate, commit, **push to GitHub**, and verify before beginning the next completed independent unit.

### 11.2 Header behavior

- Left: original LadeStack Build wordmark.
- Primary links: `Features`, `Use Cases`, `How It Works`, `Technology` → anchor links on homepage.
- Editorial links: `About`, `Blog`, `Contact` → dedicated localized pages.
- Right: language switcher and a single prominent `Start Building` CTA.
- Never show `Pricing`, `Sign In`, `Sign Up`, trial countdowns, or forced account invitations.
- On subpages, anchor links go to localized home (`/ja/#features`), not to non-existent `/ja/features`.
- Mobile menu is focus-managed and dismissible by Escape; it does not trap or jump focus unexpectedly.

### 11.3 Footer behavior

Provide intentional groups: Product (homepage anchors), Company (About/Contact), Resources (Blog/FAQ if present), Legal (Privacy/Terms/Disclaimer/Cookies if relevant), Open Source, language selector, and genuine brand/social links. Footer links must work in all eight locales or be clearly gated until localized. Avoid placeholders, fake social URLs, and legal pages with generic unverifiable claims.

### 11.4 Image and media workflow

- Use optimized images with known dimensions, descriptive alt text, responsive sources, and appropriately lazy-loaded below-fold media.
- Avoid loading external trackers, huge motion assets, or screenshots unrelated to current product behavior.
- Store only properly licensed assets; supply attribution wherever required.
- Prefer lightweight accurate UI illustrations over unrealistic fake application demos.

## 12. Landing page sections: implementation walkthrough

**Contract:** Features, Use Cases, How It Works, and Technology are **sections on the Astro homepage**. They are not separately routed marketing pages. Recommended IDs are `features`, `use-cases`, `how-it-works`, and `technology` and must match all localized header links.

### 12.1 Hero

**Purpose:** In one screen, explain what LadeStack Build does and invite exploration.

Suggested structure:

1. A short eyebrow such as "AI development, on your terms".
2. Editorial headline with a concrete outcome (e.g. "From an idea to working code").
3. Human-readable subtext: describe websites/apps, inspect actual source, preview supported frameworks, use your own AI key.
4. Primary `Start Building` CTA → locale-preserving `/app`.
5. Secondary CTA → `#how-it-works` or `#features`.
6. A product mockup showing Monaco + agent capsule or preview, accurately labeled if not interactive.

Avoid universal claims such as "every app instantly" or "unlimited AI for free"; AI providers bill separately and not all backend frameworks run in a browser.

### 12.2 Product demonstration

Use an editorial IDE mockup card with a file tree, code preview, agent status pills, and a clear Code/Preview transition. For the actual marketing demo, prefer a pre-recorded lightweight sequence or deterministic, accessible component state—not a costly live AI call on each visitor's page load. Provide captions/alternative text and avoid autoplay motion without reduced-motion handling.

### 12.3 Features (`#features`)

Minimum content topics:

- Multi-step agentic generation and tool calling.
- Mode selection: Code, Plan, Debug, Ask, Review, and custom modes; Orchestrate/Delegation when actually qualified.
- BYOK providers and compatibility-aware model selection.
- Live code streaming and editable file explorer.
- Automatic compatible npm dependency management.
- Code/Preview modes, checkpoints and diff/revert.
- Local-first persistence, no mandatory sign-in, source ZIP export.

Use two-column or three-column editorial grids, with honest descriptions and concise supporting visuals. Feature badges must distinguish `available` from `planned` before public launch.

### 12.4 Use Cases (`#use-cases`)

Illustrate grounded workflows: SaaS dashboard UI, business websites, portfolios, agencies, e-commerce storefronts, documentation sites, productivity tools, landing pages, and supported Node-powered prototypes. For each: example input, relevant AI steps, final deliverable, and limits (e.g. production payment processing or persistent databases require outside services).

### 12.5 How It Works (`#how-it-works`)

Use **Describe → Generate → Run → Refine → Export**.

1. User enters a prompt and attaches references.
2. Agent plans and writes source files incrementally.
3. Browser runtime attempts supported dependency installation and preview.
4. User iterates, reviews diffs, and restores checkpoints if needed.
5. User downloads editable ZIP source, without mandatory login.

The visual sequence must match the actual agent lifecycle and failure states; do not claim automatic repair always succeeds.

### 12.6 Technology (`#technology`)

Explain technologies in plain language: Astro for public content, Next.js for Builder shell, Monaco for editor, agent core adapted from inspected Kilo concepts, BYOK, IndexedDB/OPFS, benchmark-qualified runtime, npm manifest synchronization. Differentiate **builder internals** from **frameworks it can generate**.

### 12.7 BYOK and privacy explanation

Explain what local-first means and what it does **not** mean: browser project storage is not a durable cloud backup; user prompts/files sent for inference reach the selected AI provider and any configured relay; external npm package downloads involve third-party networks. Do not claim "everything stays on your device" without qualifying this.

### 12.8 Templates, FAQ, closing CTA

- Templates: real usable templates, not dead cards; categories should map to actual available starters.
- FAQ: account requirement, API key cost, browser support, supported frameworks, data storage, backups, ZIP usage, local model possibilities.
- Final CTA: a single focusable `Start Building` link in original brand treatment.
- Footer: complete route/legal inventory.

### 12.9 Acceptance checks

- [ ] All four mandatory sections exist on `/` and work as anchors.
- [ ] Localized header links return to the selected-language homepage anchor from any subpage.
- [ ] No separate `/features`, `/use-cases`, `/how-it-works`, or `/technology` routes are accidentally generated.
- [ ] CTA enters the correct localized Builder route.
- [ ] No pricing UI, auth CTA, unverified claims, or missing blog/legal links.
- [ ] Responsive visual layout, keyboard navigation, image alt text, and performance verified.

## 13. Separate pages, footer, legal pages and errors

### 13.1 About

Tell an honest, human story of LadeStack Build's purpose: lower friction between ideas and inspectable code, support local ownership and model choice, avoid unnecessary logins. Do not invent a founding date, employee count, investors, awards, customer counts, or corporate compliance certifications.

### 13.2 Contact

Display genuine owner-approved email and verified social profiles. Provide clear categories such as support, bug reports, licensing questions, and security disclosures **only when appropriate channels really exist**. No contact form is required. Avoid publicly exposing private personal contact data accidentally.

### 13.3 Blog and article pages

These are separate routes, statically rendered where possible, with author/date when factual, table of contents where useful, localized summaries, code syntax highlighting, related articles and accessible navigation. Publishing rules live in §15.

### 13.4 Legal pages

- **Privacy:** project storage, AI provider transmission, relay usage, key storage choices, diagnostics/analytics (if any), browser deletion/backup behavior.
- **Terms:** free platform terms, provider fees, user-owned inputs/projects, acceptable use, third-party runtime limits and rights.
- **Disclaimer:** generated source may be inaccurate, insecure or incompatible; review before deployment.
- **Cookies/storage:** describe actually used cookies, local storage, IndexedDB, service workers, and analytics; do not add a fake consent popup when no consent-requiring technology exists.
- **Open source:** accurate third-party attribution, modified-source obligations where applicable, component/asset licensing.

**Important:** Technical developers may prepare drafts, but final legal wording needs informed review for relevant jurisdictions and actual deployed data flows. Publish translated versions only after appropriate quality checks.

### 13.5 Error experience

| Status/failure | Desired handling |
| --- | --- |
| `404` | Localized custom not-found page with working homepage and builder links |
| `500` | Friendly failure page for application/server failures where the hosting architecture allows |
| `501` | Use for genuine unsupported server capability; not generic route misses |
| `502`/`504` | Acknowledge upstream/proxy failures; host provider may control actual response |
| `503` | Explain temporary unavailability; retry/recovery path |
| Missing blog translation | Enforce publishing completeness; no silent wrong-language content |
| Builder offline | Preserve locally saved projects; show diagnostics and retry |

Astro's static mode and hosting edge layers may not expose all status pages directly; test emitted HTTP status codes, not just visible markup. Do not claim control over an edge error response that is served by the hosting provider.

## 14. Eight-language internationalization

### 14.1 Supported locale registry

| Locale | Language | Marketing home | Builder home (proposed) |
| --- | --- | --- | --- |
| `en` | English, default | `/` | `/app` |
| `ru` | Russian | `/ru/` | `/app/ru` |
| `ja` | Japanese | `/ja/` | `/app/ja` |
| `ko` | Korean | `/ko/` | `/app/ko` |
| `zh` | Simplified Chinese (selected convention) | `/zh/` | `/app/zh` |
| `tr` | Turkish | `/tr/` | `/app/tr` |
| `fr` | French | `/fr/` | `/app/fr` |
| `pt` | Portuguese (selected convention) | `/pt/` | `/app/pt` |

Do not reintroduce older nine-language locale lists, Dutch/Spanish, or omit Turkish because of prior plans. Any language-set change requires new explicit product approval and route/content migration planning.

### 14.2 Locale ownership

- Share supported locale constants and translation key conventions.
- Astro owns full static-page and blog localization.
- Next.js owns Builder UI localization (agent status labels, dialogs, error messages, settings).
- Preserve the locale when following CTA links between apps.
- The **UI language** must be independent of the **language of the website generated for the visitor**.
- Save preferred locale locally where useful; never let stale storage force a non-existent route.

### 14.3 Translation requirements

Every translatable surface includes: navigation, footer, headings, explanatory paragraphs, blog body, metadata, categories, CTA labels, alt text, form labels, errors, settings, permissions, and accessible names. Technical code identifiers should not be blindly translated; user-facing explanations should be localized.

**Humanized tone:** Translate meaning naturally, not word-for-word. Use locally idiomatic phrasing, consistent terminology and appropriate technical loanwords. Maintain factual claims, examples, and support boundaries consistently across all languages. Avoid robotic generic slogans repeated on every page.

### 14.4 Per-locale QA workflow

1. Create/update source-of-truth English copy.
2. Assign stable translation keys/content IDs.
3. Translate all seven additional locales using reviewed glossary and native-feeling phrasing.
4. Validate key parity and placeholder matching.
5. Render each page with real language text and check overflow, punctuation, date formatting, keyboard behavior and script fonts.
6. Verify equivalent route mapping and selected locale persistence.
7. Validate localized title/description/canonical/hreflang.
8. Run all relevant tests and **push the completed atomic change**.

### 14.5 Language switch behavior

- On `/ja/about`, changing to French should land on `/fr/about`.
- On a Japanese article, switching to Russian should open the **same article's Russian translation** via a stable translation ID and locale-specific slug.
- On Builder `/app/ja/project/id`, changing UI locale should preserve the active local project, not reset or copy source files.
- If a translation is genuinely missing, do not produce a 200 page with falsely localized SEO metadata. For articles, prefer a publication gate requiring complete locale coverage.

### 14.6 Avoid automatic location assumptions

Do not assign users a language using unrequested precise location. Optional browser preference detection must remain reversible, transparent and non-disruptive; explicit user selection wins.

## 15. Markdown blog publishing workflow

### 15.1 Content strategy

Use Astro Content Collections to store validated Markdown/MDX only when required by actual features. A full CMS and account database are unnecessary for initial authoring. Each article should serve a genuine developer search intent: agent workflows, BYOK setup, code editing, local storage, browser runtimes, debugging, tutorials, privacy, supported frameworks and real release notes.

### 15.2 Proposed file convention

```text
apps/web/src/content/blog/
├── en/
│   └── getting-started.md
├── ru/
│   └── getting-started.md
├── ja/
│   └── getting-started.md
├── ko/
│   └── getting-started.md
├── zh/
│   └── getting-started.md
├── tr/
│   └── getting-started.md
├── fr/
│   └── getting-started.md
└── pt/
    └── getting-started.md
```

Actual Astro Content Collection conventions may change with installed version; inspect project configuration before moving content.

### 15.3 Suggested frontmatter contract (illustrative)

```yaml
---
translationId: getting-started
locale: en
slug: getting-started
title: Getting started with LadeStack Build
description: A practical walkthrough for creating and editing your first web project.
publishedAt: 2026-10-21
updatedAt: 2026-10-21
author: LadeStack
category: Tutorials
tags:
  - ai-builder
  - getting-started
draft: true
---
```

`draft: true` is appropriate until all translations are complete and checked. Dates, author attribution, and article claims must match reality.

### 15.4 Eight-language atomic publication

1. Outline the article and verify technical claims.
2. Create the English Markdown file.
3. Create all seven translated Markdown versions with the same `translationId`.
4. Use natural language; adapt examples but keep technical meaning.
5. Check code snippets for valid syntax, formatting and accessibility.
6. Verify complete metadata, alt text, cross-links and locale-specific slugs.
7. Run content schema validation, all-locale coverage checks, and all generated-page builds.
8. Mark publishable only when **eight-language parity** is satisfied.
9. Commit and **push** the complete atomic content release; verify remote.

If a long article requires several development commits, keep it in a draft state. Push each validated, independently coherent draft unit when project policy permits, but do not publicly publish an incomplete translated release.

### 15.5 Blog browse/search features

- Localized listing with tags/categories, featured content, and pagination when needed.
- Search that is not a heavyweight always-online dependency by default; a static index/client search can be evaluated.
- Readable article typography; accessible heading order; copyable code; table of contents for long posts.
- Back-to-blog links, related articles based on real category metadata, and genuine author/update dates.
- RSS or feeds can be added if meaningful; verify per-locale output and canonical relationships.

## 16. SEO, structured data and content quality

### 16.1 Technical SEO baseline

- Static HTML renders essential copy without JavaScript.
- One main H1 and consistent semantic heading hierarchy per page.
- Descriptive localized titles and summaries; avoid duplicate titles across different content.
- Correct canonical URL for each indexed page.
- Correct `hreflang` and optionally `x-default` relationships for equivalent pages in all eight locales.
- Sitemap contains only indexable, canonical, publicly available URLs.
- Robots policies do not accidentally block translated assets, CSS, article pages, or the default-language root.
- Actual valid structured data only (e.g. `Organization`, `SoftwareApplication`, `Article`, `BreadcrumbList` where applicable).
- Do not add fake `AggregateRating`, made-up testimonials, review counts, or other unverifiable schema.
- Internal links remain locale-aware, including footer, navigation, and body links.

### 16.2 Content quality checklist

For every page/article, answer:

- What question does this page answer that the homepage does not?
- Are feature claims connected to actually verified functionality?
- Is the content specific, human-sounding, and free of repetitive keyword stuffing?
- Does the language read naturally to its target audience?
- Are screenshots current and original/licensed?
- Are published dates, authors, technical terms, and external references accurate?
- Does the page provide a concrete next step without presenting fake urgency?

### 16.3 Marketing performance checklist

- Minimize client-side JavaScript and hydration.
- Preload only assets critical to initial visible content.
- Avoid layout shifts by reserving image dimensions.
- Monitor LCP, INP, and CLS in field/lab settings; do not report unmeasured metrics as achievements.
- Self-host fonts if permissions allow, subset carefully for Cyrillic/CJK coverage, and test fallbacks.
- Defer visual demo engines and animation code when below fold.
- Build static pages and verify production output, not just development server rendering.

---

## 17. Build the Next.js application shell

The Builder is an interactive, local-first development tool, not another marketing site. Use the same brand language with better information density. Treat tool windows and execution sessions as expensive resources; load them only when needed.

### 17.1 Application entry flow

1. User clicks `Start Building` on the localized Astro site.
2. Browser navigates to the corresponding `/app` localized route.
3. Next.js renders Welcome screen without mandatory authentication.
4. The app loads lightweight local project metadata and provider settings (not heavy runtimes).
5. Recent local projects and real template options are available.
6. User describes a project and submits.
7. Validate BYOK availability, request/attachments, runtime compatibility and file permissions.
8. Create or open a local project and navigate to its workspace.
9. Start AI planning + browser runtime initialization according to capability needs.
10. When task finishes or fails, persist state and return composer controls.

### 17.2 App route and state contracts

Route examples are proposals:

- `/app` — English welcome/overview.
- `/app/ja` — Japanese welcome.
- `/app/project/[id]` or locale equivalent — saved local project.
- `/app/settings` or locale equivalent — settings.
- `/app/templates` or locale equivalent — template browser.

Set `basePath`/proxy consistently. User ID is not part of routing. A local project ID is **not** a globally shareable URL; loading it in a different browser/device should explain that project data is not present, instead of showing a fake cloud sync result.

### 17.3 Shell architecture

- Header with editable project title, Code/Preview switch, runtime status, source download, and settings.
- Collapsible or context-sensitive file explorer.
- Main editor or preview occupies the greatest available area.
- Floating capsule handles agent activity and prompt composition.
- More detailed console, terminal, agent trace, or checkpoint history opens on demand.
- No payment or sign-in modal.

### 17.4 Performance guardrails

Keep Monaco and runtime modules in an appropriate client boundary, lazy-load when needed, and avoid bundling heavy components into the public marketing site. Confirm safe use of Next server/client components; do not initialize browser-only APIs during server rendering. Plan for efficient state subscriptions so each streamed token does not cause a whole-screen rerender.

## 18. Welcome screen, templates and attachment intake

### 18.1 Required composition

A calm welcome headline, concise supporting copy, multiline prompt composer, attachment button, mode selector, currently selected BYOK model, prompt submit, curated template categories, and recent local projects. Use a visual hierarchy that makes typing a first-class action.

### 18.2 Composer behavior

- Empty state: centered, compact.
- Typing/paste: expand multiline input without layout thrashing.
- Submission: explicit button plus documented keyboard shortcut; preserve composition for IME users.
- Disabled state: explain missing API key, unsupported model capability, active task, or invalid attachment.
- During task: prevent accidental duplicate requests; keep cancellation accessible.
- Retry: preserve prompt and references, no silent duplicate billing.
- Mode selection: separate Agent Mode (`Code`, `Plan`, ...) from View Mode (`Code`, `Preview`).

### 18.3 Attachment types and ingestion

| Category | Examples | Required ingestion behavior |
| --- | --- | --- |
| Images | PNG, JPEG, WebP, GIF, SVG, AVIF | Safe preview, type/size validation, vision-model compatibility |
| Source | HTML, CSS, JS/TS/JSX/TSX, Python, JSON, YAML | Text extraction, encoding/path validation, untrusted reference context |
| Documentation | PDF, DOCX, Markdown, TXT | Extract readable text, report parse/unsupported cases |
| Spreadsheets | CSV, XLSX, ODS | Structured extraction with limits; never execute embedded macros |
| Archives | ZIP | Explicit import flow, defend against zip-slip/zip bombs and excessive files |
| Configuration | TOML, `.env.example`, package metadata | Scrub secrets; do not execute pasted instructions or untrusted config blindly |

**Accepting a file ≠ executing it.** Uploaded Python is reference content unless a Python-capable runtime is available. PDF/DOCX/XLSX parsing and image understanding depend on parser/model capabilities; unknown formats require graceful failure rather than guessing.

### 18.4 Attachment limits

Define testable limits for file size, total batch size, file count, decoded image dimensions, archive expansion ratio, parsing time, context size, and memory. Avoid promising "all file types" literally. Detect MIME/content signatures, not just extensions; sanitize SVG display; prevent arbitrary uploaded scripts from executing in the trusted host.

### 18.5 Template requirements

- Categories may include business, SaaS, portfolio, agency, dashboard, e-commerce, landing page, education, restaurant, and developer tools.
- Every clickable template loads real project files/metadata or launches a truthful AI build flow.
- Templates must define dependencies, start scripts, language, framework, preview capability, and license provenance.
- Do not clone unlicensed vendor template source into exported user projects.
- A template may open with editable starter code before any AI call, preserving free platform value.

## 19. Project workspace: editor, preview and AI capsule

### 19.1 Code View

- Full-height Monaco, editor tabs, open/save/rename/delete, folder explorer, syntax highlighting, search, diagnostics, keyboard shortcuts and unsaved state.
- Generated code visibly streams into the relevant open file when possible; a user who switches tabs must **not** be forced back to AI's active file.
- Files and folders display clear creation/edit statuses.
- Stable writes to runtime filesystem must be controlled; partial AI token fragments should not trigger thousands of filesystem writes or installs.
- Edits from a user and an AI agent need revision/conflict checks, not last-writer-wins overwrites.

### 19.2 Preview View

- Show a real runnable output for supported projects; distinguish loading, installing, starting, ready, stale, unsupported, and failed.
- Provide desktop/tablet/mobile viewport presets without implying mobile browser runtime support is identical.
- Expose refresh and console/diagnostics unobtrusively.
- Protect host origin and credentials: generated JavaScript is untrusted.
- Auto-refresh/HMR only when runtime signals actually support it; do not pretend a static mockup is running code.

### 19.3 Floating Agent Capsule

The user's distinct interaction model is a **small bottom-centered capsule** that leaves the editor or preview as the primary canvas.

**State model:** `idle → planning → creating/editing file → saving → completed`, with parallel runtime states for boot, install, and preview. On a file completion, transition the item upward and show the next active file. Show spinner during generation and a green success tick only after the file operation truly completes. File completion **does not** prove the whole app compiles.

The capsule should:

1. Display the latest meaningful task with file name/path.
2. Permit expansion to chronological tool trace/agent history.
3. Show background installs distinctly from file writing.
4. Expose Pause/Cancel/Retry/Ask Permission where appropriate.
5. Convert into the next-prompt composer when work ends.
6. Remain accessible to keyboard and screen readers, with restrained live-region announcements.
7. Avoid blocking the bottom of the editor; reserve enough viewport space.

### 19.4 Code/Preview vs Agent Mode

- `Code`/`Preview` view switch changes **what the user sees**.
- `Code`/`Plan`/`Debug`/`Ask`/`Review` agent mode changes **what the AI is allowed and instructed to do**.
- Never let a visual view switch silently escalate tool permissions or cancel an agent task.

---
## 20. Adapting Kilo Code safely

### 20.1 What “Kilo-based” means

The product wants Kilo Code's agentic patterns and, where license/compatibility permit, reusable source components: tool calling, system prompts, agent modes, checkpoints, context management, subagent workflows, permissions, structured outputs, and session management.

**Do not assume** the VS Code extension, CLI, terminal-backed Kilo runtime, file watcher, native Git snapshot integration, or tool-hosting stack is directly importable into a browser-based Next.js app. A server-oriented agent package may expect Bun, native filesystem, subprocesses, unrestricted sockets, extension APIs, or database components unavailable in a normal browser.

### 20.2 Recommended source assessment

1. Confirm the authoritative upstream `https://github.com/Kilo-Org/kilocode` (or an explicitly selected, validated fork/revision).
2. Record the precise commit/version being evaluated; don't copy arbitrary head-of-main logic without provenance.
3. Read root and per-package licenses, upstream notices, transitive dependency licenses, trademarks, and redistribution requirements.
4. Map current upstream modules for agent definition, prompt composition, provider APIs, tool registry, permissions, sessions, context summaries, checkpoints, and delegations.
5. For every candidate module, document runtime dependencies and whether it can run in a browser/worker/edge environment.
6. Add an abstraction layer and typed contracts before borrowing implementations.
7. Write contract tests for the imported behavior; upstream unit tests are helpful but not sufficient for your environment.
8. Keep upstream modifications clearly traceable and preserve required notices/credits.
9. Use feature labels honestly: `adapted from`, `inspired by`, or `native integration` only as supported by actual source.

### 20.3 Browser compatibility matrix

| Kilo-like capability | Browser Builder approach | Major risk |
| --- | --- | --- |
| Agent loop | Adapted async orchestration in client-safe module | Cancellation, long-running state, context growth |
| Provider adapter | Capability-aware BYOK integration | CORS, key exposure, streaming differences |
| Tool registry | Declarative typed tool schemas | Arbitrary execution and permission bypass |
| Filesystem tools | Project model + runtime FS adapter | Path traversal, concurrent writes |
| Shell commands | Restricted browser runtime process API | Unsupported processes/native deps, untrusted scripts |
| Modes/prompts | Per-mode layered instructions + permissions | Prompt injection, model-specific behavior |
| Checkpoints | IndexedDB revision manifests/diffs | Quota, rollback corruption, legacy migration |
| Subagents | Task delegation with quotas and contexts | API cost multiplier, recursion, stale state |
| MCP | Optional broker for supported transports | OAuth, subprocess assumptions, provider trust |
| Browser automation | Strict optional capability or external service | Permissions and cross-origin restrictions |

### 20.4 Licensing and brand rules

The upstream repository has been publicly presented as MIT-licensed, but licenses can differ by package, older revision, dependency, or copied asset. **Verify the exact version before reuse**. Follow required notices and acknowledgments. Permission to reuse source under a license does **not** grant rights to present LadeStack as Kilo, use Kilo marks as your brand, or use closed/licensed third-party assets.

### 20.5 Deliverable of the Kilo audit

Create a precise internal module-level report with columns: source path/revision, desired capability, browser-safety result, dependencies, license status, security risk, integration plan, test evidence, and implementation owner. Gate actual import behind that report.

## 21. Agent modes, prompts and context construction

### 21.1 Standard mode contract

| Mode | Intended behavior | Default permissions |
| --- | --- | --- |
| **Code** | Generate/edit supported projects; run safe diagnostics | Read + approved project-scoped writes; controlled installs/commands |
| **Plan** | Analyze user request and propose architecture | Read/search only; no source mutation |
| **Debug** | Diagnose errors and propose/apply targeted fixes | Read/diagnostics; writes with appropriate policy |
| **Ask** | Explain the project and answer questions | Read-only |
| **Review** | Inspect diff, security/performance/accessibility | Read/diff/diagnostics; no silent writes |
| **Orchestrate** | Delegate scoped tasks to specialized agents | Delegation budget + per-subtask inherited permissions |
| **Custom** | User-defined specialization | Explicitly configured and bounded tool policy |

System modes cannot override the product's non-negotiable security rules. New custom agents start with least privilege and require explicit user action before higher-risk tools are enabled.

### 21.2 System prompt stack

Assemble a structured prompt from separate, testable layers:

1. **Core identity/task policy:** Agent role, honesty, completion criteria, tool usage requirements.
2. **Mode specialization:** Code vs Plan vs Debug restrictions and expected output.
3. **Tool descriptions:** Exact callable tools, typed schemas, permission boundaries, tool result handling.
4. **Environment capabilities:** Available runtime, filesystem, supported frameworks, network restrictions.
5. **Project instructions:** User-authored project conventions and goals; do not treat as platform policy.
6. **Workspace context:** Relevant files, file tree, diagnostics, prior checkpoints and task history.
7. **Attachments/retrieved text:** Explicitly untrusted data, with provenance and size limits.
8. **User request:** Current instruction and constraints.

Prompt text alone does not create security. The tool executor is responsible for enforcing allow/ask/deny outcomes.

### 21.3 Context budget and compaction

- Select relevant source files; avoid sending every file in every request.
- Include project structure, relevant dependency manifest, referenced components, touched file revisions, current errors and latest user instruction.
- Apply provider-aware token budgeting; leave room for tool arguments, outputs and repair iterations.
- Compact long conversations carefully; preserve decisions, explicit requirements, errors, user corrections, and pending approvals.
- Never compact out the current set of tool permissions or authoritative user constraints.
- Summaries and retrieved files are untrusted observations, not elevated instructions.

### 21.4 Structured task plan

A typical plan may specify: task ID; user goal; mode; proposed files; required dependencies; runtime capabilities; expected preview; files to protect; tool permissions; test plan; estimated model budget; checkpoint ID; and abort conditions. Log this plan for the activity timeline in an appropriately redacted form.

### 21.5 Multi-agent scope control

When delegating, give each subagent a narrowly scoped task, a bounded context, an explicit tool allowlist, and iteration/cost limits. Parent task must merge results with conflict detection. Avoid two agents concurrently editing the same file without coordination. Subagents do not get permission inheritance beyond the stricter of parent policy and their own allowed scope.

## 22. Tool calling, approval policy and execution loop

### 22.1 Why tool calling matters

The AI must act on real project state instead of merely outputting code text. A model selects structured tools; the application validates arguments and permission; the executor performs an operation against the project/runtime; the result is returned to the model for the next decision.

### 22.2 Suggested tool catalog

| Proposed tool | Action | Default |
| --- | --- | --- |
| `list_files` | Enumerate project folder entries | Allow |
| `read_file` | Read bounded project file | Allow |
| `search_code` | Query project contents | Allow |
| `write_file` | Add a file under project root | Allow only in authorized writable mode, with versioning |
| `edit_file` / `apply_patch` | Apply targeted change | Allow only with conflict/preview protection |
| `rename_file` | Rename/move within project | Ask if conflict/destructive |
| `delete_file` | Remove source file | Ask |
| `read_diagnostics` | Collect type/build/runtime diagnostics | Allow |
| `read_terminal` | Read bounded process output | Allow |
| `install_dependencies` | Reconcile approved project manifest | Automated with policy checks |
| `run_project_script` | Run manifest-defined dev/test/build | Scoped allowlist or ask |
| `execute_command` | Arbitrary compatible runtime command | Ask; may be unsupported |
| `get_preview_status` | Preview URL/state/health | Allow |
| `capture_preview` | Screenshot if secure integration exists | Capability-gated |
| `create_checkpoint` | Save project revision | Automatic or allowed |
| `restore_checkpoint` | Restore older revision | Ask; preserve current branch/checkpoint |
| `delegate_task` | Spawn bounded subagent | Policy/budget-controlled |
| `search_web` | Optional web/reference retrieval | Optional explicit capability |
| `export_zip` | Produce source ZIP | User-triggered unless explicitly authorized |

Exact tool names above are **proposed builder contracts**, not a claim that Kilo upstream uses those exact names.

### 22.3 Permission states

Every tool returns a decision from: `allow`, `ask`, `deny`. Decisions depend on agent mode, user policy, requested scope, runtime safety and irreversible risk. **An agent cannot approve its own higher-risk operation by editing a prompt file.**

Recommended presets:

- **Manual:** request approval before consequential writes/installs/commands; reads allowed when scoped.
- **Balanced (default):** safe reads and routine project-scoped edits automatically; sensitive commands, irreversible edits, secrets, network/process escalation and data exfiltration require approval or are denied.
- **Auto:** routine operations may proceed without repeated prompts, but permanent hard restrictions remain; never imply unlimited host-OS access.

### 22.4 Tool execution workflow

```text
Model outputs structured tool call
    ↓
Validate schema and tool name
    ↓
Resolve permissions (agent mode + user policy + hard security gate)
    ↓
If ASK: show actual command/path/effects and await user decision
    ↓
Create pre-change checkpoint when appropriate
    ↓
Execute against project/runtime adapter with timeout and cancellation
    ↓
Collect bounded stdout/stderr and file-change manifests
    ↓
Update local project storage, capsule event and audit trace
    ↓
Send structured result back to model
    ↓
Continue / retry / escalate / stop
```

### 22.5 Tool result contract

Use structured event fields such as `toolCallId`, `name`, `status`, `startedAt`, `endedAt`, `argsSummary`, `affectedFiles`, `errorCode`, `retryable`, `diagnosticSummary` and `outputRef`. Do not store/raw-display credentials or entire provider payloads. Implement idempotence or deduplication for retried write/install calls.

### 22.6 Agent termination and budgeting

- Define maximum turns, tool calls, nested delegations, wall-clock budget, and optionally model-token/cost caps.
- Expose Stop/Cancel, including aborting streaming requests and runtime processes where possible.
- After repeated identical failures, stop rather than burning API budget indefinitely.
- Surface a clear result: completed, partially completed, blocked, cancelled, or failed.
- If one step fails, record exact state; do not celebrate a generated file as a compiled application.

## 23. BYOK provider configuration and credential handling

### 23.1 Provider choices

Plan support for providers such as OpenRouter, OpenAI, Anthropic, Gemini, Groq, DeepSeek, Mistral, supported OpenAI-compatible endpoints, and optional local models (e.g. Ollama/LM Studio) **only as validated by actual SDK/browser/network capabilities**.

### 23.2 First-time connection workflow

1. User chooses provider from Settings or composer.
2. Display appropriate key format/help without requiring a LadeStack account.
3. Offer **session-only** key handling as safe-by-default convenience.
4. If the visitor explicitly chooses persistence, request and derive encryption from a user passphrase; handle unlocked key exposure honestly.
5. Test only a minimal, user-authorized provider request; show usable models and actual features supported.
6. Let user select a model suitable for tool calling, streaming, vision and desired context.
7. Warn that costs are paid to provider independently; provide request/iteration controls.
8. Never leak key to source code, Markdown/blog, error logs, telemetry, ZIP or Git.

### 23.3 Direct browser vs proxy

**Direct browser API:** May avoid a central proxy but must be supported by the provider's browser/CORS policy and still exposes credentials to the client runtime. Never enable risky browser SDK behavior under a false "secure" label.

**Minimal provider relay:** May improve CORS/adapter support but **the relay receives the user's key during requests**, creating trust, transport, log-suppression, rate-limiting and data-retention obligations. Keep relay stateless where practical, disclose handling, do not persist keys or prompts without explicit intent, and measure hosting/bandwidth budgets. A relay does not make the BYOK key magically private from the relay operator.

### 23.4 Credential storage rules

- Default: ephemeral memory/session preference, no automatic durable plain-text IndexedDB storage.
- Optional: passphrase-encrypted local credential blob, with versioned encryption metadata and safe recovery guidance. Use standard authenticated cryptography; never invent encryption primitives.
- Secret material must not appear in service-worker messages, URL query strings, checkpointer snapshots, console logs, crash reports, git diffs or screenshots.
- Browser application compromise or malicious same-origin code may read **unlocked** keys regardless of encryption-at-rest; state this limitation.
- Distinguish global provider configuration from per-project model selection; avoid copying secrets into each project.

### 23.5 Model capability matrix

Track: provider, model ID, tool-calling, streaming, vision, structured output, context size when verifiable, usage/budget information, browser support, endpoint policies and any known limitations. Reject or downgrade incompatible tasks clearly. A free model is not necessarily a reliable tool-calling model.

### 23.6 Safe request behavior

- Network timeouts, retries with jitter, cancellation, and `429` rate-limit guidance.
- Do not retry failed billable calls indefinitely or without deduplication thought.
- Redact `Authorization` and key-bearing headers in network-debug displays.
- Limit contextual file content sent to providers to what is relevant and user-authorized.
- Treat model outputs as untrusted proposed actions that require executor validation.

## 24. Runtime candidate research and benchmark plan

### 24.1 Candidates

- **WebContainers:** Mature browser-based Node workflow benchmark reference; verify current commercial licensing, browser isolation and actual API compatibility before a production commitment.
- **Lifo:** Open-source browser-native Node-like runtime challenger; verify maturity, licensing, npm semantics, service-worker origin safety and benchmark results.
- **Wasmer:** WASM/WASIX-capable runtime for specialized workloads; verify SDK license and Node/npm/preview compatibility independently.
- **Sandpack core / esbuild-wasm / similar:** Lightweight frontend compile/preview fallback; do not claim general Node process support.
- **Future candidates:** Evaluate only with the same standardized suite and security gate.

### 24.2 Reproducible benchmark kit

Construct fixed, non-AI-generated test projects:

| ID | Workload | Pass condition |
| --- | --- | --- |
| T01 | Cold boot | Bounded, repeatable time; clear error on unsupported browser |
| T02 | Mount 50–200 files | All file contents/paths match checksums |
| T03 | Fresh Vite React/TypeScript install | Required dependencies resolve and install |
| T04 | Start development server | Preview reaches real rendered healthy state |
| T05 | HMR/edit | Stable edit reflected without manual full relaunch where supported |
| T06 | `package.json` changed | Serialized reconcile updates dependencies correctly |
| T07 | Node API subset | Results documented as supported/unsupported individually |
| T08 | Typecheck/build | Expected scripts finish with correct exit/status |
| T09 | Express-style API | Server behavior works if the runtime advertises support |
| T10 | Next/SSR scenario | Framework support shown by reproducible evidence, not name alone |
| T11 | Install error + retry | Diagnosable error, safe retry, no corruption |
| T12 | Refresh/reopen | Durable source survives; runtime restarts cleanly |
| T13 | Memory/CPU/network | Cold/warm resource measurements captured |
| T14 | Browser matrix | Chromium + Safari + Firefox + mobile limitations documented |
| T15 | Security | Host data/keys isolated from generated preview code |

### 24.3 Evaluation method

- Fix project sources, dependency versions, network assumptions and browser/system profiles.
- Record cold-cache and warm-cache separately; use at least several repeated samples and report median/p95 where meaningful.
- Measure boot time, mount time, install time, server-ready time, actual rendered preview, HMR time, peak memory and failure rate.
- Test Chrome/Edge first, then Firefox/Safari and mobile as feasible.
- Capture licensing and redistribution obligations by exact runtime/package version.
- Prefer a **hard security/license pass gate** before any weighted performance score.
- Publish a conclusion of `eligible`, `limited`, `experimental`, or `rejected` with evidence and open risks.

### 24.4 Decision gates

1. Does commercial use and redistribution comply with terms?
2. Can preview execution be isolated from the trusted Builder origin and BYOK material?
3. Can the candidate pass critical npm/React/Vite/file-sync tests repeatedly?
4. Can it recover from unsupported packages and errors without destroying project state?
5. Are browser support/performance and maintenance acceptable?

A high numerical score must **not** overrule critical security or data-integrity failures.

## 25. Browser runtime lifecycle and npm automation

### 25.1 Important correction

A `package.json` is **not a prerequisite for booting WebContainers**. It is the standard Node project dependency/script manifest. For consistent generated JavaScript/TypeScript projects, require a valid project-specific `package.json` and use it to drive installs. Static non-Node projects may still have a deliberate minimal manifest under product conventions, but the runtime boot mechanism does not depend on the mere presence of the file.

### 25.2 Runtime lifecycle states

```text
not_initialized
  → selecting_adapter
  → booting
  → ready_for_mount
  → mounting_files
  → manifest_validating
  → installing_dependencies
  → starting_dev_server
  → preview_ready
  → running / reconciling / restarting
  → disposing / disposed
  ↘ failed / unsupported / cancelled
```

### 25.3 Prompt submission timeline

1. Keep runtime off while user only browses the Astro site or Builder welcome.
2. On project creation, start AI planning and runtime boot **in parallel** if compatible and useful.
3. Model proposes a project manifest based on requested framework, package manager and dependencies.
4. Validate that the manifest is complete, structured, allowed, safe and consistent with supported scripts.
5. Mount or sync coherent source files; keep local durable project model authoritative.
6. Serialize package installation; do not spawn concurrent installs for every token change.
7. Once minimal runnable source/dependencies exist, launch the declared `dev` script.
8. Wait for real server readiness; connect preview to the runtime-provided endpoint via a safe mechanism.
9. On changes, reconcile files; use HMR where supported and restart server when required.
10. On tab close, crash or project switch, snapshot durable source and dispose processes safely where possible.

### 25.4 Dependency manager state machine

Suggested statuses: `unresolved`, `manifest_dirty`, `validating`, `queued`, `installing`, `installed`, `failed`, `retrying`, `unsupported`, `cancelled`.

Required behavior:

- Compare normalized package manifest hash/revision to the last successfully installed revision.
- Debounce incomplete AI manifest writes and ignore transient invalid JSON until a valid coherent update is committed.
- Use only compatible package managers and lockfile conventions; don't switch installers silently.
- Serialize package reconciliation and stale-result detection across rapid manifest changes.
- Report errors with package names and tool output, redacting secrets.
- Limit retries, avoid endless loops and preserve source files when installation fails.
- Inform AI of actual diagnostics for repair, with user-controlled budget and permission limits.
- Distinguish dependency installation from full app readiness.

### 25.5 Security for generated packages

Package installation may execute third-party scripts, access runtime network capabilities, or introduce vulnerable code. Define allowed installation/runtime process capabilities, trusted origins, audit hooks, and scope restrictions. Always treat downloaded packages as untrusted; review adapter-specific guarantees rather than making blanket sandbox assertions.

### 25.6 Runtime failover

If the selected runtime cannot support a generated project, report why and offer eligible alternatives. Switching runtime may require clean restart and remount; preserve project content and checkpoint first. Do not try to silently move a running server/process memory state between incompatible runtimes.

## 26. Structured code streaming and reconciliation

### 26.1 Three separate flows

1. **AI output stream:** Model tokens/tool calls; may be partial or syntactically invalid.
2. **Project operations:** Validated create/edit/patch/rename/delete events with file revisions.
3. **Runtime events:** Mount/install/dev-server/HMR/test/diagnostics state changes.

Never infer filesystem success solely from streamed model text. User-visible capsule statuses must be grounded in actual operation acknowledgments.

### 26.2 Suggested file operation contract

An operation should identify `projectId`, `operationId`, `path`, `operationType`, `expectedRevision`, `newContent` or patch data, `agentTaskId`, and `checkpointId`. The executor validates paths, expected versions, size limits, file protections and permissions before applying.

For each operation:

1. Validate and authorize.
2. Save pre-change revision/checkpoint if needed.
3. Apply to canonical project model atomically.
4. Notify Monaco only for affected file(s).
5. Update runtime filesystem in bounded coherent batches.
6. Emit `saved` or a structured failure.
7. Update capsule and agent history; allow following tool actions.

### 26.3 Partial live code display

The open file can visually show interim AI output with a caret/progress marker, even if incomplete. Avoid persisting every token into runtime. On final coherent file content, commit file write to the project model and runtime. If streaming is cancelled, preserve user code and previously committed revisions; explicitly label incomplete generated drafts.

### 26.4 Concurrent manual editing

- User editing another file should not be disturbed by agent file switching.
- If user and AI touch the same revision, detect version conflict and offer review/merge/undo instead of overwriting.
- Preserve editor cursor/scroll when updating content if feasible.
- Separate local editor undo history from durable project checkpoint history.
- Multi-file agent operations should support a coherent snapshot or revert path.

### 26.5 Error recovery

When build diagnostics reveal an issue, feed bounded relevant diagnostics and affected files back to Debug agent (if authorized). Limit autonomous repair attempts. After repeated identical failures, stop, preserve the last safe checkpoint and provide a clear error summary instead of an unbounded paid token loop.

## 27. Local-first IndexedDB and OPFS storage

### 27.1 Data ownership

The primary copy of the project resides in a durable local project data model. A browser runtime filesystem is a transient execution replica. Generated code and dependencies can be reconstructed from saved source + manifest/lockfile; treat `node_modules` as replaceable cache unless a specific justified use case needs otherwise.

### 27.2 Suggested logical stores

| Store | Data | Sensitive-data considerations |
| --- | --- | --- |
| `projects` | IDs, titles, created/updated, framework, runtime preferences | Never infer cloud sync from local metadata |
| `projectFiles` | File path, content/revision references, hashes | Restrict path and size, preserve encodings |
| `fileBlobs` / OPFS | Large binary assets, images, archives | Quota/eviction, unsafe SVG, dedupe |
| `agentSessions` | Conversation metadata, mode, checkpoint pointers | Redact credentials and private reference data |
| `agentMessages` | User/agent messages and tool summaries | Avoid leaking prompt content into external telemetry |
| `toolExecutions` | Bounded operation journal/status | Strip secrets/headers and large raw logs |
| `checkpoints` | Immutable project manifests and parent relationships | Preserve rollback referential integrity |
| `agents` | Custom modes/prompts/tool policies | Treat user text as lower-trust settings |
| `providerSettings` | Provider IDs, model preferences, non-secret config | Do not store raw API key here |
| `encryptedCredentials` | Optional passphrase-encrypted BYOK blobs | Never export by default |
| `attachments` | Ingestion metadata/content references | Document provider transmission boundaries |
| `runtimeMetadata` | Last manifest hash/diagnostics state | Never confuse with persistent process state |
| `preferences` | Locale, editor style, theme, accessibility | Backward-compatible migration |

This is a conceptual schema, not a command to recreate databases. **Inspect existing stores first.** An earlier GB Coder lineage may include `gb-coder-projects-db` with `projects`/`projectFiles`, `gb-coder-workspace`, and `gb-coder-active-project-id`; preserve existing records and meanings if upgrading that actual codebase.

### 27.3 Migration guidance

- Determine existing DB names, versions, indexes, migration records, and file formats.
- Prepare representative fixtures from **synthetic** old project data for regression tests.
- Version schema changes; upgrade in transactional steps; avoid destructive resets.
- Preserve project type vs editor style as separate concepts where existing data uses them.
- Do not migrate a visitor's app files into a remote database simply for convenience.
- Provide a rollback/backup path and communicate non-reversible format changes.
- Test reload, multiple tabs, denied quota, interrupted upgrade, and malformed legacy records.

### 27.4 Storage quota and persistence

Web storage is subject to browser quotas, eviction policies, private browsing behavior and user deletion. Where supported, request persistent storage transparently. Offer backup/export, quota warnings, sensible cache cleanup, and garbage collection for unreferenced blobs. **Do not promise that IndexedDB alone is a backup.**

### 27.5 Multi-tab coordination

If the same project opens in two tabs, use a defined ownership/coordination approach (where browser APIs permit) to prevent simultaneous writes from corrupting the project. On conflict, preserve both edits or request resolution; never silently choose last writer.

## 28. Checkpoints, diffs, rollback and migration

### 28.1 Checkpoint philosophy

User work must be recoverable, understandable and reversible. Kilo may rely on Git snapshots in certain environments; the web app needs a **browser-native checkpoint system** that does not assume an OS Git worktree.

### 28.2 Suggested structure

- Immutable manifest of path → content hash/revision; parent checkpoint ID.
- Checkpoint metadata: task/source, label, created timestamp, author category (user/agent), branch or history link, affected paths.
- Blob content deduplication using hashes; unreferenced blob garbage collection only after referential checks.
- Pre-task safe checkpoint, post-task successful checkpoint and explicit manual checkpoint.
- Optional restore-branch so users can revisit newer work after rolling back.

### 28.3 Restore procedure

1. Show checkpoint label/date, affected files and diff preview.
2. Warn about unsaved manual changes; first save a recovery checkpoint when possible.
3. Require user approval for destructive/reverting operations.
4. Apply checkpoint to canonical local project model transactionally.
5. Update open Monaco tabs, active file and editor diagnostics.
6. Reconcile runtime filesystem with restored manifest.
7. Detect changed dependencies; reinstall/restart only if required.
8. Verify file hashes and preview state; report whether runtime is ready or requires repair.
9. Preserve readable history of restore action itself.

### 28.4 Checkpoint invariants

- A failed restore must not leave half old/half new files without a recovery record.
- File deletion or rename must be reflected in history, not only content hash changes.
- Path case-sensitivity and slash normalization must be consistent.
- Browser quota failures trigger a safe error, not silent data loss.
- Checkpoint history is **not** automatically backed up to GitHub or a cloud service.

## 29. Project import, export and ZIP safety

### 29.1 Source ZIP requirements

The user can click `Download ZIP` with no sign-in, subscription or platform credits. Include the actual project source, public assets, correct `package.json`, available lockfile, README/setup instructions, relevant safe config examples, and declared third-party licenses when required. Exclude `node_modules`, build caches, runtime temp files, raw API keys, `.env.local`, unlocked BYOK credentials, agent internal audit dumps and unrelated workspace projects.

### 29.2 Additional backup option

Separate **Source ZIP** (portable code and assets) from **Workspace Backup** (optional conversations, checkpoints, settings, safe metadata) to avoid unexpectedly exporting sensitive user prompts, attachments, or local credentials. Workspace Backup must include an explicit privacy review and opt-in selection of optional content; never include raw keys.

### 29.3 ZIP import safety

- Validate archive size, entry count and expanded size before extraction.
- Reject absolute paths, `../` traversal, Windows drive paths, symlink surprises and nested archive bombs.
- Avoid running package lifecycle scripts simply because an uploaded ZIP contains a manifest.
- Validate file encodings, names and reserved system directories.
- Offer a project name/merge/replace choice; never overwrite an existing local project silently.
- Preserve content hash and show summary of imported files and compatibility warnings.

### 29.4 Export verification

After ZIP generation, reopen in a test harness, check manifest contents, compare source-file hashes, verify no prohibited secrets, and ensure the exported project can install/build within its advertised framework. Large projects may need a streaming/export strategy to avoid browser memory spikes.

## 30. Settings and permissions user journeys

### 30.1 Core settings groups

1. **AI Providers:** BYOK keys, model selection, endpoint, connection tests, streaming/tool/vision support.
2. **Agents & Modes:** Current mode, custom mode definitions, system prompt overrides, tool allowlists.
3. **Permissions:** Manual/Balanced/Auto policy, audit history, sensitive-tool prompts.
4. **Runtime:** Selected runtime, supported capabilities, diagnostics, install behavior.
5. **Editor:** Font, theme, tabs, indentation, autosave, keyboard commands, accessibility.
6. **Language & Appearance:** Eight locales, density, motion preference, light/dark workspace options.
7. **Checkpoints:** Automatic snapshot settings, retention, restore, cleanup with safeguards.
8. **Data & Privacy:** Local storage size, project backup, import/export, deletion confirmations, secrets policy.

### 30.2 UX rules

- Use one structured Settings area, not dozens of modal interruptions.
- Advanced controls should be accessible but not visually overwhelming.
- Label permission presets with **actual effects**, not vague "Safe" marketing claims.
- Clearly separate global settings from per-project overrides.
- Never apply destructive defaults without user review.
- Keep keyboard navigation and accessible names on dense settings controls.

### 30.3 Permission approval dialog

Show agent name/mode, tool, exact relevant paths or command, expected network/process effects, reversible vs irreversible risk, estimated request cost if known, and `Allow Once` / `Deny` controls. Optional scoped "Always Allow in This Project" must never bypass a hard security restriction; a revocation control must exist.

## 31. Security, privacy and threat modeling

### 31.1 Threat actors and entry points

Assume malicious or compromised: user-supplied files; remote documents; model outputs; third-party npm packages; imported project ZIPs; unsafe preview code; browser extensions; same-origin dependencies; provider endpoints; network relays; stale service workers; and accidental Git commits. Also consider normal accidents: user refresh, process crash, storage eviction, and duplicate edits.

### 31.2 Critical trust boundaries

| Boundary | Policy |
| --- | --- |
| User prompt/reference → Agent | Treat as task data, not authority to bypass system policy |
| Agent tool output → Executor | Validate schema, paths, permissions and size |
| Generated project → Builder host | Strong preview sandbox/origin separation; no credential access |
| Browser runtime → Network | Runtime-specific controls, documented external package traffic |
| BYOK key → Provider/Relay | Clear, minimal transmission; never log/store blindly |
| Project local DB → Export/Git | Explicit user action for export; never auto-push generated projects |
| External Kilo/MCP/plugin source → App | Audited license, compatibility, permissions, supply-chain risk |

### 31.3 High-severity security tests

- Generated preview JS cannot read the Builder's BYOK key, IndexedDB project database, or trusted app controls.
- Preview iframe sandbox/CSP/origin behavior is validated, including service-worker scope and same-origin access hazards.
- User attachment text cannot change tool permissions or write files outside the project.
- `../../` paths, symbolic link tricks, weird case/Unicode paths and archive traversal are blocked.
- Untrusted package scripts cannot exceed the documented browser runtime capabilities or access host secrets.
- OAuth/API keys are redacted from tool output, errors, URLs and support diagnostics.
- Destructive tools require appropriate user approval; Auto policy does not override hard-deny rules.
- Browser reload or failed storage transaction does not silently delete source files.

### 31.4 Privacy statements must match deployed reality

No signup **does not** automatically mean no data leaves the device. A BYOK inference request normally sends the selected prompt and relevant context to the user's chosen AI provider (and potentially a relay). Npm dependencies may be fetched from external registries. Analytics/telemetry, if later introduced, require truthful disclosure. Don't promise zero collection before auditing every network request.

### 31.5 Safe supply-chain process

Use lockfiles, dependency audit and license scanning; review imported UI snippets; avoid unreviewed install scripts; document known native Node incompatibilities. Check CSP and cross-origin isolation after every hosting/proxy change. Security regressions block release and GitHub push of knowingly insecure features.

## 32. Accessibility, responsive layouts and performance

### 32.1 Accessibility goals

Target WCAG 2.2 AA where applicable and validate behavior, not just contrast. Provide semantic landmarks, visible focus, keyboard-operable navigation, labels, appropriate field errors, screen-reader descriptions, and accessible alternatives to visual-only loader/animations.

### 32.2 Keyboard UX

- `Tab` reaches the entire builder without trapping focus.
- `Escape` dismisses menus/dialogs and clears transient views when appropriate.
- Command palette and file search have discoverable keyboard shortcuts.
- File tree allows accessible focus, expand/collapse and selection.
- Code/Preview toggle is operable by keyboard and announces the active view.
- Approval dialog does not interpret Enter/Space in unexpected dangerous ways.
- Active AI statuses are announced sparingly (avoid a screen-reader announcement per token).

### 32.3 Responsive design

- Astro marketing pages: fully responsive hero, grid, footer and article typography.
- Next Builder: **desktop-first** high-productivity interface with deliberate mobile fallbacks; do not simply shrink four dense panes.
- On narrow widths, move file explorer, agent history, and terminal to navigable drawers/tabs.
- Account for on-screen keyboard, touch targets, viewport resizing and landscape modes.
- Treat mobile full Node runtime support as measured capability, not an implicit promise.

### 32.4 Performance rules

- Heavy Monaco/runtime/terminal modules should not load until relevant user journey.
- Batch AI streamed editor updates; avoid rerendering entire Next app per token.
- Throttle diagnostics, file sync and runtime status updates appropriately.
- Measure runtime cold/warm paths, preview readiness, HMR, memory and storage usage.
- Reduce motion per browser/user preferences; do not animate text editing itself.
- Preserve Astro static performance by avoiding unnecessary React hydration on marketing pages.

---
## 33. Testing strategy and quality gates

Quality means code behavior is measured against the actual product contract, not that an AI agent merely declared the task finished. Tests should cover the **marketing experience, Builder UX, agent execution, runtime functionality, persistent source integrity and deployment routing**.

### 33.1 Test layers

| Layer | Scope | Example assertions |
| --- | --- | --- |
| Unit | Pure utilities/contracts | Locale mapping, file-path normalization, manifest hashing, approval decisions |
| Component | Accessible UI behavior | Composer state, dialog focus, file tree keyboard navigation, capsule transitions |
| Integration | Data and service adapters | IndexedDB migration, checkpoint writes, provider stream adapter, tool policies |
| Runtime contract | Candidate-independent adapters | Boot/mount/process/output/error/cleanup semantics |
| Browser E2E | Real workflow | Prompt → files → npm → preview → checkpoint → export |
| Localization | Eight-language integrity | Key parity, blog parity, title/description and links |
| Security | Trust boundaries | No key leakage, preview isolation, unsafe ZIP rejection |
| Visual regression | Important layouts | Editorial hero, nav, IDE panels, dialogs, multilingual wrapping |
| Deployment smoke | Public host | Correct routes, status codes, headers, assets, app proxy |

### 33.2 Core end-to-end acceptance cases

**E2E-01: First visit.** No account required; public site opens; `Start Building` works and preserves selected locale; welcome loads without runtime boot.

**E2E-02: BYOK setup.** User selects provider/model and can see capability limitations. Secrets are not logged/exported. Missing/invalid key results in actionable message.

**E2E-03: Project creation.** Prompt plus valid attachment creates local project metadata and begins qualified agent workflow; tool statuses accurately reflect real operations.

**E2E-04: Live code.** Monaco shows incremental code without stealing focus when user switches files. Generated files are editable.

**E2E-05: Auto npm.** Valid manifest triggers serialized dependency installation, server starts when ready and preview displays actual generated app. Manifest update triggers correct reconcile once.

**E2E-06: Manual changes.** User edits source, refreshes, reopens project, and gets same file contents/active state as expected.

**E2E-07: Checkpoint.** Create, diff, restore, and re-open. File hashes and runtime sync remain consistent.

**E2E-08: Error recovery.** Invalid dependency/build error displays readable diagnostics; bounded retry and cancellation work; stored source remains intact.

**E2E-09: ZIP.** Export contains correct source/lockfile/README; no keys, temp files or unrelated projects; import/round-trip works.

**E2E-10: Eight locales.** Every public page and published article exists in all languages; equivalents switch correctly; Builder UI locale changes preserve project.

### 33.3 Testing against actual scripts

Do not assume `pnpm lint` or `pnpm test` exists. Discover actual scripts first:

```bash
# Example inspection commands (safe to run only inside actual repository).
cat package.json
# If present, inspect workspace package manifests and CI workflow files.
# Then use only the scripts defined there.
```

Test reports must say **not run** when tools/environment are unavailable; never convert unavailable checks into a false pass.

### 33.4 Performance acceptance metrics (targets, not measurements)

Initial targets to revisit after benchmarks:

- Marketing Core Web Vitals within Google's good thresholds on representative devices.
- Local project-file integrity: **zero unexplained hash mismatches** in reload/migration/export tests.
- Vite/React fresh preview: aim for p95 ≤30s on a documented reference browser/hardware/network, subject to package downloads.
- Cached-project preview: aim for p95 ≤8s on the same reference setup.
- HMR: aim for p95 ≤2s for typical source edits on a warm session.
- Agent UI remains responsive during long streams and dependency installs.
- No high/critical verified vulnerability exposed in production build or project preview isolation.

These are **engineering goals**, not benchmarks already achieved. Measure, report conditions and refine.

### 33.5 Testing failure policy

Never push an intentionally broken or unsafe source change just to comply with the delivery rule. If a coherent change cannot pass its relevant checks, keep it as a clearly marked local work-in-progress, fix it, then deliver. If the blocker is environmental, report it with real evidence and leave repository state understandable.

## 34. Local development and integration workflows

### 34.1 Workstation startup

1. Clone/open the **authorized** source repository.
2. Run Git checks from §4 and inspect current dirty state.
3. Read `README.md`, this guide, design reference and active project configs.
4. Select the package manager from lockfile/`packageManager`.
5. Install dependencies using repository-provided documented command.
6. Start Astro and Next dev servers via real workspace scripts.
7. Verify marketing page, Builder welcome and proxied `/app` routes in browser.
8. Inspect browser console/network and expected service-worker scope.
9. Start an atomic implementation unit and follow mandatory delivery loop.

### 34.2 Local port and proxy conventions

Do not hardcode guessed port numbers into docs as facts. Use environment-appropriate ports and confirm which dev server owns which route. A local composite proxy may forward:

```text
http://localhost:<gateway-port>/      → Astro dev server
http://localhost:<gateway-port>/app/* → Next.js dev server
```

Support Next static assets, API endpoints and WebSocket/HMR where required. Validate locale-aware paths, route priority and CORS/CSP behavior. If direct development on separate origins is unavoidable, document differences from production and avoid falsely assuming local behavior proves production integration.

### 34.3 Feature branch workflow

Use repository-defined branch rules. For a scoped feature:

- First create issue/task notes or a small implementation plan.
- Change one cohesive feature with associated tests and translations.
- Run checks and inspect expected artifact behavior.
- Commit/push when atomic unit is done; repeat for next independent unit.
- Open a PR when required; do not merge to protected main without authorization.
- Keep feature flags or status labels for partial/experimental runtime capabilities.

### 34.4 Research spikes vs product changes

A benchmark spike may live in an isolated branch/worktree with clearly labeled experimental code. Do not let experimental runtime scripts leak into shipped bundles. Commit/push coherent experiment results when safe and authorized; never claim experimental tests meet release gates without evidence.

## 35. Deployment on Vercel or Cloudflare

The hosting goal is **compatibility and portability**, not a blanket assertion that one framework build runs identically everywhere. The product has separate Astro and Next builds under one public host and browser-side runtime constraints that often become visible **only after production deployment**.

### 35.1 Deployment baseline

- Astro: static prerender by default, including multilingual Markdown content.
- Next.js: App Router build using actual platform-supported adapter/path strategy.
- Shared public host: path-aware routing for `/` and `/app`, with correct Next asset ownership.
- CDN/static caching configured for immutable hashed assets, but no dangerous caching of BYOK request content.
- Actual HTTPS, CSP, COOP/COEP and service-worker behavior tested after deploy.
- Provider relay, if configured, must respect privacy, rate limits, log redaction and hosting resource limits.

### 35.2 Vercel path

1. Confirm correct Git repository/project/environment scope.
2. Configure separate build/deploy units as required; make sure both apps are represented in routing.
3. Ensure Builder `basePath` and static asset paths resolve through the chosen gateway.
4. Apply required runtime security headers to only the appropriate resources/routes; verify their interaction with third-party assets.
5. Test both marketing pages and Next editor over the canonical host.
6. Validate SSE/streaming responses, any relay, service workers, browser runtime, install logs, preview and ZIP download.
7. Verify production deployment URLs, redirects and custom domain before declaring success.

**Note:** Vercel is a native Next.js platform, but composite Astro+Next single-host routing still requires deliberate configuration. A local working preview does not guarantee production WebContainer success.

### 35.3 Cloudflare path

1. Use a static-compatible build output for Astro where possible.
2. For Next.js on Workers, verify current official compatibility/adapter approach (e.g. applicable OpenNext or vinext guidance **for the exact versions used**); availability/behavior can evolve.
3. Check unsupported Node-specific APIs, middleware, ISR, streaming semantics and artifact bundling.
4. Confirm Worker CPU/request/memory/network limits for any AI relay; browser runtime CPU is separate from Worker CPU.
5. Configure route ownership, asset caching, rewrite rules, headers and preview security.
6. Deploy to staging and run the exact same E2E/browser checks as on Vercel.
7. Do not accept a provider because the homepage works while `/app` fails.

### 35.4 Critical deployment smoke matrix

| Surface | Test |
| --- | --- |
| `/` and `/ja/` | Localized Astro markup and navigation |
| `/about`, `/blog`, article URLs | 200, correct content and metadata |
| `/app`, `/app/ja` | Next shell, correct locale, working assets |
| Project workspace | Open existing IndexedDB project after reload |
| BYOK | Provider request works with supported browser policy/relay |
| Browser runtime | Boots in production, installs and serves preview |
| Security headers | COOP/COEP/CSP/iframe behavior actually compatible |
| Source ZIP | Download, contains expected files and no secrets |
| Errors | 404 HTTP status and realistic failure UI |
| SEO | Sitemap, hreflang, robots and canonical URLs |

### 35.5 Release security and privacy gate

Verify preview execution cannot access trusted host keys, browser storage or routes; validate relay redaction; check package/asset licensing; protect user source migrations. Block production rollout if a critical trust-boundary issue remains.

### 35.6 Cost and lifetime-free constraints

No user payments means **the owner still covers** hosting, relay bandwidth, logs, build minutes, storage if introduced, and maintenance. Keep the marketing site static and offload compatible project execution to the visitor's browser. Any automatic feature that materially increases paid provider/API/platform usage must be budgeted, optional or bounded. Never imply unlimited free provider inference.

## 36. Observability and error handling

### 36.1 Design error taxonomy

| Error family | Example | UI response |
| --- | --- | --- |
| Validation | Invalid image, document, JSON manifest | Keep draft, show actionable field/file issue |
| Credential | Invalid BYOK key | Show provider-specific check without exposing key |
| Provider | 429, unavailable model, CORS/relay failure | Rate-limit/backoff guidance; budget-conscious retry |
| Agent | Malformed tool arguments, missing permissions | Tool call rejected with clear reason |
| Filesystem | Invalid path, conflict, failed transaction | Preserve old revision; offer resolution |
| Runtime | Unsupported browser, native dependency, boot failure | Show limits and compatible fallback if available |
| Preview | Server failed / HMR disconnected | Keep code; show logs, reload/restart options |
| Storage | Quota, corruption, tab conflict | Protect source; export/cleanup options |
| Export | ZIP fails, includes disallowed path | Stop, show result, preserve originals |
| Deployment | Wrong path proxy, missing headers, edge error | Do not conflate with app logic; collect deploy evidence |

### 36.2 User-facing error principles

- State what failed, what remains safe, and the next action.
- Use humanized localized language rather than raw stack traces.
- Surface technical details in an optional disclosure for developers.
- Always distinguish **incomplete**, **failed**, **unsupported**, and **cancelled** outcomes.
- Do not discard unsaved project drafts because a provider fails.
- Include error codes/task IDs where they actually help support without collecting unnecessary personal data.

### 36.3 Logs and traces

Store bounded redacted tool execution records in local project history when useful. Do not log API keys, raw authorization headers, all attachments by default, or full user source to remote monitoring. If telemetry is later added, document retention, redaction, opt-in/opt-out and legal implications before rollout.

### 36.4 Failure isolation

The marketing website should remain readable during a Builder runtime failure. Builder editor should remain usable when live preview fails. Stored source should survive an agent/provider crash. The capability status UI should tell the visitor what is still functional.

## 37. Troubleshooting playbooks

### 37.1 Astro page renders but `/app` is 404

1. Verify reverse proxy route priority and Next base path.
2. Inspect rewritten path; avoid duplicate `/app/app`.
3. Check static asset URLs and Next runtime routes.
4. Verify production output rather than local direct-port behavior.
5. Add regression test for `/app`, `/app/ja`, and project routes.

### 37.2 Language switching returns wrong page

1. Confirm locale registry contains all eight locales.
2. Check shared translation ID/slug mapping for blog articles.
3. Inspect links built from current route rather than literal paths.
4. Verify English default has no stray `/en/` duplication unless intentionally configured.
5. Check canonical/hreflang metadata in rendered HTML.

### 37.3 WebContainer or browser runtime works locally but not after deployment

1. Check secure HTTPS context and browser feature detection.
2. Check COOP/COEP (where required), CSP, service workers, blocked cross-origin assets and network requests.
3. Inspect console errors/failed workers and affected origin.
4. Verify bundle loading paths and Next `basePath`/edge rewrite compatibility.
5. Test in a supported browser with extensions and cache variables controlled.
6. Re-run the runtime benchmark POC on the production host.
7. Avoid changing storage schema or deleting user data as a speculative fix.

### 37.4 `npm install` loops or runs on every token

1. Check manifest revision/hash and validation/debounce boundary.
2. Confirm install queue serialization and cancellation behavior.
3. Inspect lockfile/package manager consistency.
4. Confirm successful installed-revision memoization.
5. Add test for rapid manifest updates and stale completion events.

### 37.5 Preview stays blank despite generated files

1. Distinguish file-saved status from dependency/install/server-ready status.
2. Verify the runtime really started the project dev server.
3. Confirm preview URL/origin and iframe sandbox allow required **limited** communication.
4. Inspect build/runtime diagnostics and console.
5. Check if project asks for unavailable backend/env variables.
6. Present a real error; do not swap in a static screenshot while claiming live preview.

### 37.6 IndexedDB projects disappear or fail migration

1. Confirm origin/path/browser profile and user-site-data state; never assume cross-device sync.
2. Inspect database/version, stores, active project metadata, and migration logs.
3. Avoid destructive delete/recreate sequences.
4. Preserve a recoverable copy and reproduce with synthetic fixtures.
5. Investigate quota/eviction/private mode, origin changes and schema incompatibilities.
6. Add migration regression tests before redeploy.

### 37.7 Agent keeps modifying unrelated files

1. Confirm mode permissions and tool file-scope validation.
2. Check context selection, project root and patch target IDs.
3. Ensure destructive edits ask approval.
4. Restore last safe checkpoint if needed, preserving user changes.
5. Audit prompt injection from attachments and untrusted tool outputs.
6. Add explicit file-scope regression test.

### 37.8 API key appears in logs or export

1. Stop affected upload/export/deployment path.
2. Treat key as compromised; rotate/revoke through provider.
3. Remove key from stored artifacts and logs within authorized procedures (respecting history policies).
4. Fix redaction/storage architecture and add a test for that leakage path.
5. Do not publish a commit containing secrets, even if GitHub push is normally mandatory.

### 37.9 Git push fails after code is complete

1. Preserve local commit and exact diff.
2. Inspect remote URL, upstream, branch permissions and authentication.
3. Determine whether branch protection requires a PR.
4. Do not force-push, rewrite others' changes, or substitute another remote.
5. Report **push blocked**, commit hash, branch and required remedy.
6. Retry only after authorization/connectivity/conflict is resolved and checks still pass.

## 38. Translation, blog and design review checklists

### 38.1 Per-page localization checklist

- [ ] Eight locales present with identical intent, not necessarily word-for-word copy.
- [ ] Navigation/CTA/footer/metadata/alt/ARIA labels translated.
- [ ] Page is readable with Cyrillic, CJK, Korean and accented Latin fonts.
- [ ] All links and equivalent page switching are correct.
- [ ] No hidden default English strings in dialogs, validation or error notifications.
- [ ] Page title, canonical and hreflang use the correct locale URL.

### 38.2 Per-blog checklist

- [ ] Source article fact-checked and useful.
- [ ] All eight Markdown versions have stable translation ID and valid frontmatter.
- [ ] Localized slugs and related links are consistent.
- [ ] Code blocks and image licenses verified.
- [ ] Human-sounding local-language review completed.
- [ ] Build/content parity checks pass; drafts not accidentally published.
- [ ] Commit **and GitHub push** completed after validation.

### 38.3 Design checklist

- [ ] Original brand with cream canvas / restrained orange.
- [ ] Editorial display typography and hairline cards, no gratuitous shadows.
- [ ] No pricing, login/signup or fake business metrics.
- [ ] Inter/Geist instead of unlicensed CursorGothic.
- [ ] shadcn/React Aria base + audited Kibo/Aceternity additions.
- [ ] Functional Monaco and capsule use appropriate density and no unnecessary motion.
- [ ] Contrast, keyboard, focus and reduced-motion checks pass.

## 39. Feature-by-feature delivery playbooks

Each playbook finishes with the **mandatory per-atomic-change GitHub push**.

### 39.1 Add a homepage component

1. Confirm section belongs on homepage, not a new route.
2. Design with existing tokens/components, add semantic markup.
3. Add translated content for all locales and relevant SEO/anchor links.
4. Check responsive layout, Lighthouse/accessibility and JavaScript footprint.
5. Validate, diff, commit, push, verify and report.

### 39.2 Add a blog article

1. Draft/fact-check English.
2. Translate into all seven other languages as Markdown.
3. Verify translation IDs/frontmatter, snippets, metadata and links.
4. Run content/build tests and publish-state checks.
5. Commit/push the article release; verify upstream.

### 39.3 Add an AI provider

1. Verify terms, SDK, endpoint behavior, browser CORS/relay need, and model capabilities.
2. Implement/redact provider adapter and request/stream parsing.
3. Validate tool calls, cancellation, rate limits, bad key behavior and no secret leakage.
4. Add accessible settings copy across eight locales.
5. Execute tests, commit/push, verify and document provider limitations.

### 39.4 Add an agent tool

1. Define schema, preconditions, file/runtime scope and error model.
2. Classify allow/ask/deny for each mode, including hard denials.
3. Implement validator/executor with cancellation, idempotence and audit metadata.
4. Write happy-path, denial, malformed-input, path attack, conflict and failure tests.
5. Confirm capsule reflects tool outcome and no secret enters logs.
6. Commit/push the completed unit.

### 39.5 Add/change a runtime adapter

1. Start with licensing/compatibility/security benchmark.
2. Implement generic capabilities and explicit unsupported responses.
3. Run same fixed reference projects, cold/warm metrics and browser matrix.
4. Verify isolation, service workers, preview and auto npm semantics.
5. Gate production activation on security and reliability; feature-flag experimental modes.
6. Commit/push independently validated capability increments.

### 39.6 Change IndexedDB schema

1. Audit existing stores and real migration path.
2. Design backward-compatible versioned upgrade; preserve previous active project keys.
3. Test synthetic old/new fixtures, interrupted upgrade, quota and reload.
4. Validate checkpoints, exports and multi-tab behavior.
5. Commit/push only after data-integrity tests pass; do not use destructive recreation.

### 39.7 Change the IDE or capsule

1. Map new interaction to the two view modes and distinct agent modes.
2. Preserve file editing, focus, cursor and separate status event streams.
3. Validate multiple simultaneous tasks, file switching, keyboard navigation and reduced motion.
4. Avoid introducing heavy decorative dependencies in the editor.
5. Commit/push after visual and functional checks.

### 39.8 Fix a production issue

1. Capture precise symptoms, environment, route, timestamps and real logs without secrets.
2. Reproduce, identify root cause and write a targeted test.
3. Implement minimal safe fix; verify adjacent routes and persistence.
4. Run release smoke tests in staging; commit/push, follow branch policy and deploy only when authorized.
5. Report the before/after evidence and known residual risk.

## 40. Release process and rollback

### 40.1 Pre-release checklist

- [ ] All intended changes are atomic, committed, and **pushed to GitHub**; remote commits verified.
- [ ] CI/build/typecheck/lint/test statuses match current head.
- [ ] All eight locales and equivalent blog variants complete.
- [ ] Legal content reflects actual data flows; pricing/auth absent.
- [ ] Source assets and reused Kilo/UI/runtime licenses verified.
- [ ] BYOK keys, tool logs, exports and published assets contain no secrets.
- [ ] Browser runtime/preview isolation gate passes.
- [ ] IndexedDB migrations backed by passing synthetic fixtures.
- [ ] Astro + Next route/proxy and security header smoke matrix passes.
- [ ] Error pages produce appropriate statuses where under application control.
- [ ] Source ZIP works and excludes private content.
- [ ] Release rollback/recovery route exists.

### 40.2 Recommended deployment sequence

1. Merge/approve according to actual branch policy.
2. Deploy Astro and Next to isolated staging or preview environment.
3. Run production-like browser runtime, BYOK mock/authorized live, import/export and storage restore scenarios.
4. Review headers, CSP/COOP/COEP, routing, locale switch and CDN cache.
5. Promote to production using configured platform procedure and authorized credentials.
6. Smoke-check `/`, localized pages, blog, `/app`, project workspace, preview and ZIP.
7. Record deployed version/commit and actual environment outcome.

### 40.3 Rollback

- Separate source rollback from **visitor local data schema** rollback: deployed code can change, but IndexedDB may already have migrated.
- Maintain compatibility windows and forward-safe migrations where practical.
- Do not replace a failed deployment by deleting browser data.
- Roll back proxy/header changes only with tests of preview security and routing.
- Report unresolved schema/performance limitations and avoid claiming "fully recovered" without evidence.

## 41. Development roadmap and milestone gates

| Milestone | Deliverable | Gate to proceed |
| --- | --- | --- |
| M0: Inventory | Current repo audit; source-of-truth docs; migration risks | No unexamined production data |
| M1: Platform skeleton | Monorepo, Astro/Next routing, shared tokens, locale registry | `/` and `/app` load correctly in dev/staging |
| M2: Marketing | Fully localized homepage, About/Contact/legal/errors | Eight-language route/content/SEO checks pass |
| M3: Blog | Markdown collection, all-locale article workflow | Translation parity and static builds pass |
| M4: Builder shell | Welcome, template flows, Monaco, capsule, Code/Preview | Accessible interactive UX smoke pass |
| M5: Agent foundation | Audited Kilo adaptation, BYOK, tool registry, permissions | Tool isolation/capability and secret-redaction tests pass |
| M6: Runtime | Qualified adapter, npm, filesystem sync, real preview | Critical benchmark and security gates pass |
| M7: Persistence | IndexedDB/OPFS, checkpoints, restore, ZIP | Data-integrity and reload round-trip pass |
| M8: Public alpha | Staging/prod deployment, security/UX/perf coverage | Full release gates and documented limits pass |
| M9: Advanced features | Subagents, MCP, richer templates, debugging, additional runtimes | Separate benchmark/permissions/usage review |

Roadmap order is an implementation proposal. Run high-risk compatibility/security **spikes early**, even before polishing every public page, to avoid marketing claims that cannot be shipped. Do not ship incomplete placeholder pages as though the platform is finished.

## 42. Definition of done and final reporting

A change is **functionally complete** only when:

1. Its expected behavior is implemented (or explicitly marked as planned/experimental).
2. Tests appropriate to its risk have passed, with honest untested areas disclosed.
3. Translation, accessibility, design, security and documentation impacts were addressed.
4. No unrelated edits, secrets, generated caches, or user-private projects are in staged source.
5. Data integrity and relevant runtime behavior are preserved.
6. The atomic change has a reviewed commit.
7. **The Git commit has been pushed to the authorized GitHub branch and the remote position verified.**

If item 7 cannot be completed for a valid reason, the work is **local/blocked**, not remotely delivered. Report that state; do not hide it behind a "done" message.

### 42.1 Developer/agent completion report template

```text
Task: <short objective>
Status: Completed & pushed | Local-only (push blocked) | Partial | Failed
What changed: <scoped files and behavior>
Tests: <commands and real outcomes; mark Not run clearly>
Security/data: <secret scan / migration / isolation outcomes>
Localization: <affected locales and parity status>
Git: <repository identity, branch, short commit>
Push: <approved remote/branch and verified outcome or exact blocker>
Deployment: <not attempted | staging | production, with verification>
Known limitations: <truthful unresolved items>
Next action: <only if required>
```

### 42.2 Do not confuse statuses

- `Created file` ≠ `Committed`
- `Committed` ≠ `Pushed`
- `Pushed` ≠ `Merged`
- `Merged` ≠ `Deployed`
- `Deployed` ≠ `Production verified`
- `Generated source` ≠ `Successful build`
- `Preview ready` ≠ `Production backend hosting`
- `Encrypted at rest` ≠ `Protected from all browser compromise`

## 43. Quick reference and common commands

**Commands below are illustrations, not a promise that an unseen repository contains matching scripts.**

| Goal | Example/action | Caution |
| --- | --- | --- |
| Confirm repo | `git rev-parse --show-toplevel` | Must be correct product source |
| Inspect branch/dirty files | `git status --short --branch` | Preserve unrelated work |
| Inspect remote | `git remote -v` | Do not guess destination |
| Inspect scoped diff | `git diff -- path/to/file` | Look for secrets/unrelated edits |
| Whitespace check | `git diff --check` | Also run actual tests |
| Review staging | `git diff --cached` | Only approved paths |
| Commit | `git commit -m "type(scope): message"` | After validation |
| Push | `git push` | Use configured approved upstream |
| Verify | `git rev-parse HEAD` and `git rev-parse '@{upstream}'` | Confirm remote is refreshed |
| Script list | Inspect `package.json` / CI | Do not invent script names |
| Browser storage | DevTools → Application/Storage | Don't delete user projects |
| Runtime failure | Console/network + adapter diagnostics | Separate host/proxy/runtime |
| Blog missing locale | Check translation IDs and files | Do not silently fallback published SEO |
| Source ZIP | Export then validate round-trip | Strip credentials/temp files |

### 43.1 Routine change sequence (reference)

```text
Inspect repository and constraints
    ↓
Implement ONE independently complete change
    ↓
Review diff and scan for secrets
    ↓
Run available relevant checks
    ↓
Stage only intended files
    ↓
Commit with a scoped message
    ↓
Push to authorized GitHub branch
    ↓
Verify remote includes the commit
    ↓
Report evidence, then proceed to next change
```

## 44. Non-goals, assumptions and open decisions

### 44.1 Explicit non-goals

- Mandatory signup/login.
- Pricing page, subscription payment system, and product-credit checkout.
- User cloud sync or account-based storage in the initial architecture.
- Unlimited hosted AI inference paid by LadeStack.
- Arbitrary full-stack/server/Docker/native-language compatibility promised without tests.
- Automatic GitHub upload of end-user generated projects.
- Copying Cursor, Lovable, Kilo or other vendors' brand assets or proprietary fonts.
- Treating static marketing mockups as evidence of shipped Builder functionality.

### 44.2 Known open architectural decisions

1. Final browser runtime selection pending reproducible benchmark, licensing and security gate.
2. Exact Kilo reusable module set pending version-specific source audit.
3. Direct BYOK vs minimal relay policy per provider, respecting CORS/security and operating cost.
4. Exact proxy/edge route ownership for Astro `/` + Next `/app` under one canonical host.
5. Exact Chinese/Portuguese regional linguistic variants when regional/legal copy is required.
6. Detailed local schema and migration path pending existing repo inspection.
7. Production preview origin and service-worker isolation strategy pending selected runtime capabilities.
8. Specific CI/test script names and release tooling pending actual codebase manifest review.
9. Third-party UI/component/template redistribution and attribution by exact dependency versions.
10. Whether a future optional source-hosting/export connector is added; must be explicit opt-in.

**Do not silently “resolve” these open decisions merely to complete a document.** Surface the needed benchmark/approval or justify a clearly reversible implementation choice.

## 45. Operational checklists

### 45.1 Before implementing any task

- [ ] Confirm actual repository/worktree and authorized GitHub remote.
- [ ] Check branch, upstream, dirty files and PR protections.
- [ ] Read relevant rules/specifications and inspect existing source.
- [ ] Identify smallest atomic deliverable and test plan.
- [ ] Note data/secret/licensing/browser/runtime risks.
- [ ] Identify all affected locale/content versions.

### 45.2 Before marking an atomic task complete

- [ ] Actual behavior verified, not just generated or planned.
- [ ] Diff reviewed; no unrelated edits.
- [ ] Relevant tests/build/lint/typecheck run and results recorded.
- [ ] Security, BYOK, user data and UI accessibility impacts checked.
- [ ] Necessary translations, docs and design adjustments completed.
- [ ] Scoped paths staged and reviewed.
- [ ] Commit made with precise message.
- [ ] **GitHub push executed against approved remote/branch.**
- [ ] **Remote push verified (or explicitly reported blocked).**
- [ ] Only then proceed to next independently completed change.

### 45.3 Before shipping a marketing page

- [ ] Correct route and all eight translations.
- [ ] No unauthorized separate Features/Use Cases/How It Works/Technology page.
- [ ] Correct canonical/hreflang and valid sitemap inclusion.
- [ ] Humanized content, accurate product claims, verified assets.
- [ ] Contrast, focus, mobile layout and performance tested.
- [ ] No pricing, sign-in, fake testimonial or unsupported metric.

### 45.4 Before shipping AI/runtime functionality

- [ ] Provider/model capabilities verified with consent and bounded budget.
- [ ] Tool schema/permissions enforced outside prompt text.
- [ ] Runtime selected via benchmark and its license approved.
- [ ] Preview origin isolated from trusted data/keys.
- [ ] Auto-install queue bounded and manifest-versioned.
- [ ] Cancel/retry/error recovery present.
- [ ] Local project files and checkpoints survive reload/errors.
- [ ] ZIP export has no secrets and round-trip checks pass.

### 45.5 Before changing persistence

- [ ] Current DB schema and legacy version inspected.
- [ ] Synthetic old-data migration fixtures tested.
- [ ] No destructive reset or store rename without migration.
- [ ] Project style/type and active-project state preserved.
- [ ] Quota, crash, concurrent tabs and incomplete transactions exercised.
- [ ] Rollback/recovery path documented.

### 45.6 Before release

- [ ] Source commit and verified GitHub push recorded.
- [ ] Branch/PR/CI state meets repository policy.
- [ ] Staging E2E and security gate pass.
- [ ] Astro localized pages and Next `/app` routes pass.
- [ ] Headers and browser runtime production behavior verified.
- [ ] Data/credentials/ZIP safety verified.
- [ ] Deployment/release identifier recorded.
- [ ] Rollback plan rehearsed or documented with constraints.

## 46. Appendix: implementation contracts and examples

The following structures illustrate interfaces and validation expectations. They are **not ready-to-import source files** or a claim that they already exist in the repository. Match the actual codebase and selected runtimes before implementing.

### 46.1 Example project creation metadata

```json
{
  "projectId": "local-project-uuid",
  "title": "SaaS Dashboard",
  "projectType": "react-vite",
  "editorStyle": "advanced",
  "runtimePreference": "auto",
  "languageOfGeneratedSite": "en",
  "localOnly": true,
  "checkpointHead": "checkpoint-0001",
  "manifestRevision": "sha256-example"
}
```

`projectType` (framework) and `editorStyle` (workspace presentation) are distinct. Never conflate them in migrations or runtime selection.

### 46.2 Example agent tool event

```json
{
  "taskId": "task-001",
  "toolCallId": "call-003",
  "mode": "code",
  "tool": "write_file",
  "scope": "project",
  "status": "completed",
  "affectedFiles": ["src/App.tsx"],
  "savedRevision": "rev-0042",
  "checkpointId": "checkpoint-0002"
}
```

Never include raw API keys, full private attachment contents, or unredacted provider headers in a tool event history entry.

### 46.3 Example runtime capability declaration

```json
{
  "adapterId": "benchmark-selected-runtime",
  "capabilities": {
    "filesystem": true,
    "npmInstall": true,
    "nodeProcesses": "compatibility-dependent",
    "developmentServer": true,
    "nativeBinaryAddons": false,
    "python": false,
    "isolatedPreview": "must-verify"
  },
  "qualification": "experimental"
}
```

These example fields are not facts about any named vendor runtime; populate them from actual tests, not expectation.

### 46.4 Example file operation with optimistic concurrency

```json
{
  "projectId": "local-project-uuid",
  "operation": "edit_file",
  "path": "src/App.tsx",
  "expectedRevision": "rev-0041",
  "proposedRevision": "rev-0042",
  "requiresCheckpoint": true,
  "permission": "allow-or-ask-after-policy"
}
```

The executor must reject or surface conflicts when the saved current revision differs from `expectedRevision`.

### 46.5 Example locale entry

```json
{
  "locale": "ja",
  "marketingHome": "/ja/",
  "builderHome": "/app/ja",
  "homepageAnchors": [
    "features",
    "use-cases",
    "how-it-works",
    "technology"
  ]
}
```

All eight locales share anchor IDs while translated headings and content vary naturally.

### 46.6 Example checkpoint metadata

```json
{
  "id": "checkpoint-0002",
  "projectId": "local-project-uuid",
  "parentId": "checkpoint-0001",
  "reason": "agent-task-completed",
  "label": "Dashboard components generated",
  "filesManifestHash": "sha256-example",
  "reversible": true
}
```

A checkpoint is valid only if its referenced manifest/blobs are recoverable and the metadata matches persisted project state.

### 46.7 Example acceptance record

```json
{
  "task": "Implement localized homepage feature section",
  "implementation": "verified-locally",
  "localesChecked": ["en", "ru", "ja", "ko", "zh", "tr", "fr", "pt"],
  "checks": {
    "typecheck": "passed",
    "build": "passed",
    "seoLinks": "passed",
    "accessibility": "passed"
  },
  "gitCommit": "replace-with-real-commit-hash",
  "githubPush": "must-be-verified-not-assumed",
  "deployment": "not-deployed"
}
```

Never fill this record with `passed`, `pushed`, or `deployed` without corresponding actual evidence.

---

## Final operating principle

**Ship a clear, human, multilingual public introduction first; deliver a powerful, local-first AI development experience behind it; preserve ownership of the user's projects and credentials; never overstate browser-runtime support; and after every completed authorized product-code/file change, validate it, commit it, push it to GitHub, and verify the remote result.**

A polished interface without working agent/runtime behavior is not complete. A capable agent without tool security or reliable local recovery is not production-ready. A locally completed code change that has not been remotely delivered must be reported as local-only, never falsely represented as pushed.
