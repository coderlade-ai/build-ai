# LadeStack Build

### A local-first, agentic AI website and application builder

**Product domain:** [build.ladestack.in](https://build.ladestack.in)  
**Product family:** LadeStack  
**Product category:** AI-powered no-code / low-code web development workspace  
**Product model:** Free-to-use platform · no accounts · Bring Your Own Key (BYOK)  
**Planned architecture:** Astro marketing website + Next.js AI Builder + browser-based execution  
**Specification status:** **Architecture and product blueprint — not evidence of a completed implementation**  
**Last updated:** 21 October 2026

> **Project status disclaimer:** This README describes the agreed product vision, proposed technical design, acceptance criteria, and implementation plan. Unless confirmed by the actual repository and automated tests, the features described here are **planned**, not shipped. Do not portray prototypes, architectural assumptions, third-party feature claims, security controls, supported runtimes, or deployments as already implemented.

---

## Contents

1. [Vision and product principles](#1-vision-and-product-principles)
2. [Product boundaries and non-goals](#2-product-boundaries-and-non-goals)
3. [User experience and primary journeys](#3-user-experience-and-primary-journeys)
4. [System architecture](#4-system-architecture)
5. [Domains, routing, and application boundaries](#5-domains-routing-and-application-boundaries)
6. [Astro marketing website](#6-astro-marketing-website)
7. [Internationalization and content localization](#7-internationalization-and-content-localization)
8. [Markdown blog and editorial system](#8-markdown-blog-and-editorial-system)
9. [SEO, discoverability, and content quality](#9-seo-discoverability-and-content-quality)
10. [Design system and UI libraries](#10-design-system-and-ui-libraries)
11. [Next.js AI Builder](#11-nextjs-ai-builder)
12. [Agentic AI and Kilo Code integration](#12-agentic-ai-and-kilo-code-integration)
13. [Tools, permissions, and safe autonomy](#13-tools-permissions-and-safe-autonomy)
14. [System prompts, context, and skills](#14-system-prompts-context-and-skills)
15. [BYOK: models, credentials, and usage](#15-byok-models-credentials-and-usage)
16. [Browser runtime and dependency automation](#16-browser-runtime-and-dependency-automation)
17. [Streaming code generation and preview](#17-streaming-code-generation-and-preview)
18. [Local-first storage, checkpoints, and recovery](#18-local-first-storage-checkpoints-and-recovery)
19. [Attachments, imports, templates, and ZIP export](#19-attachments-imports-templates-and-zip-export)
20. [Application settings](#20-application-settings)
21. [Privacy, trust, security, and accessibility](#21-privacy-trust-security-and-accessibility)
22. [Errors, failure modes, and observability](#22-errors-failure-modes-and-observability)
23. [Performance and quality targets](#23-performance-and-quality-targets)
24. [Proposed monorepo structure](#24-proposed-monorepo-structure)
25. [Development and deployment environments](#25-development-and-deployment-environments)
26. [Testing strategy and acceptance criteria](#26-testing-strategy-and-acceptance-criteria)
27. [Phased delivery roadmap](#27-phased-delivery-roadmap)
28. [Open decisions, risks, and dependencies](#28-open-decisions-risks-and-dependencies)
29. [Contributing and implementation rules](#29-contributing-and-implementation-rules)
30. [Licenses, credits, and references](#30-licenses-credits-and-references)

---

## 1. Vision and product principles

LadeStack Build aims to turn an idea, prompt, design screenshot, or existing codebase into an editable and runnable web project without forcing the user through account creation, subscription checkout, or a proprietary source-code lock-in.

The experience combines:

- A fast, multilingual, search-friendly **Astro public website** explaining the product.
- A powerful, highly focused **Next.js AI development workspace**.
- **Kilo Code-inspired agentic workflows**: modes, tool calls, configurable prompts, permissions, diagnostics, delegation, and checkpoints.
- **User-provided AI credentials (BYOK)** instead of platform-managed AI credits.
- **Local-first projects in IndexedDB**, with OPFS considered for large/binary assets.
- A **benchmark-selected browser runtime** for compatible Node.js/web development projects.
- **Live code streaming** inside an IDE-style editor and a separate live-preview mode.
- A compact **floating agent activity capsule**, not a permanently dominant chat panel.
- **Full source-code ownership**, including a reproducible downloadable project ZIP.

### Mission

Make professional AI-assisted web development approachable to people who prefer describing intent, while preserving the visibility and control expected by programmers and engineering teams.

### Product principles

| Principle | Meaning |
| --- | --- |
| Free platform access | No subscription, paid tier, platform credit pack, or mandatory login. Provider API charges may still apply. |
| BYOK-first | Users choose a supported model provider and pay that provider under their own account. |
| User owns the files | Files can be read, edited, versioned, backed up, imported, and exported. |
| Local-first | Project data defaults to user-controlled browser storage, not a central account database. |
| Agentic rather than chat-only | The AI plans and uses validated tools, observes results, and iterates. |
| Code-first generation | The main area displays live editable code; a small capsule communicates progress. |
| Enterprise-grade engineering | Accessibility, safe permissions, rollback, predictable states, error recovery, and rigorous tests. This is a quality goal, **not a compliance certification**. |
| Honest compatibility | Do not promise universal Node, Python, Docker, database, or full-stack support when a browser runtime cannot provide it. |
| Progressive disclosure | Show essential controls first; reveal complexity on demand. |
| Excellent localization | Eight complete language editions, with natural human-sounding copy and genuine translations. |
| Independent deployment | Astro and Next.js remain separate deployable applications behind one public domain. |

### Success definition

A visitor can understand the product, open the builder, configure a compatible provider key, describe a supported website/app, watch files appear live, preview the result, make additional AI/manual edits, restore a checkpoint, and download an independently usable source ZIP—all without creating an account.

---

## 2. Product boundaries and non-goals

### In scope

- Astro home page, informational pages, multilingual Markdown blog, legal and error pages.
- Separate Next.js Builder with welcome screen, prompt composer, attachments, templates, project workspace, Monaco, preview, settings, and local projects.
- BYOK provider adapters, model capability checks, streaming, agent modes, tool execution, and permissions.
- Project-aware generation, auto-managed package manifests, dependency installation, diagnostics, and agent-assisted repair where supported.
- Local sessions, file history, checkpoints, export, import, and recovery.
- A deliberately minimal, editorial marketing style alongside a professional developer workspace.

### Explicit non-goals

- **No pricing page, pricing cards, subscriptions, paid plans, paid credits, checkout, or upsell.** Ignore all pricing components in the supplied design reference.
- **No mandatory registration, login, identity provider, cloud account, or user-profile database.**
- No central hosted project storage or cross-device sync in the base product.
- No promise that every npm package, Node API, framework, Python package, database engine, or Docker workload runs locally in every browser.
- No promise that user-created backend services remain online after the browser closes.
- No unrestricted terminal or filesystem access outside a project-scoped execution environment.
- No blind copy of another product's logo, trademark, paid assets, proprietary fonts, or copyrighted layouts.
- No claims that all Kilo Code desktop/CLI features function unchanged in a web browser.
- No fake testimonials, fabricated user counts, false benchmarks, or claims that unshipped features already work.

### Free-to-use is not zero-cost operation

The platform does not charge the user, but operating costs can still include hosting, CDN traffic, optional API relays, monitoring, dependency delivery, and legally required runtime licenses. Model inference is billed by the user's provider, subject to that provider's terms. The platform must budget for its own hosting and prevent abuse without adding user accounts.

---

## 3. User experience and primary journeys

### Journey A — New visitor

1. Open `https://build.ladestack.in/` in the default English edition or a localized route.
2. Read the hero, product showcase, Features, Use Cases, How It Works, Technology, FAQ, and final call to action.
3. Click **Start Building**.
4. Open the Next.js builder at `/app` with the selected locale preserved.
5. See the welcome screen: greeting, prompt composer, attachments, templates, agent mode, and provider status.
6. If no provider is configured, add a BYOK key before an AI-dependent operation.
7. Submit a prompt or choose a template.

### Journey B — Generate a project

1. Validate prompt and references; create a local project record.
2. Determine the project capability profile and compatible browser runtime.
3. Begin AI planning while booting a permitted runtime in parallel.
4. Produce project metadata, source tree, and a valid `package.json` for Node-based projects.
5. Start dependency reconciliation after a **complete, validated** manifest becomes available.
6. Show streamed source in a Monaco-based VS Code-like interface.
7. Keep generation, installation, and validation status inside a compact floating capsule; advanced detail expands on demand.
8. Start a compatible development server once the project is runnable.
9. Expose Code and Preview as independent **view modes**.
10. Validate, report errors, propose controlled repairs, create a checkpoint, and re-enable the prompt composer.

### Journey C — Continue or recover

- Reopen a locally saved project from Recent Projects.
- Read and manually edit files regardless of AI provider connectivity.
- Switch AI agent mode without changing the Code/Preview view mode.
- Compare differences before accepting a sensitive change.
- Revert to an earlier checkpoint; preserve the current state first.
- Export source ZIP or a richer local backup.

### Journey D — Work in another language

- Choose a language on the Astro site.
- Keep the same translated page/article when switching languages.
- Carry the locale into `/app` navigation and local app preferences.
- Localize menus, settings, dialogs, errors, confirmations, onboarding, and agent UI.
- Keep the **language of the builder interface** separate from the **requested language of the generated project**.

---

## 4. System architecture

```text
                https://build.ladestack.in
                           |
                   Edge / Path Router
                     /           \
                    /             \
            Astro Public Site    Next.js Builder
                 /               /app/**
         Static/Prerendered         |
         Pages + Markdown          UI + Orchestration
                                   |
                 +-----------------+------------------+
                 |                 |                  |
             BYOK Layer       Project Core       Agent Engine
          Client or Secure    IndexedDB / OPFS    Kilo-adapted
             Relay            Snapshots/Exports   Loop + Tools
                 |                 |                  |
             Model APIs        Runtime Adapter <----+
                                   |
                       Browser-Executed Project
                       Files / npm / Dev Server
                                   |
                           Isolated Live Preview
```

### Architectural layers

| Layer | Responsibility | Constraints |
| --- | --- | --- |
| Astro public experience | Marketing, guides, blog, SEO, localization, legal content | Prefer prerendering; minimal client JS |
| Next.js application shell | Welcome, project workspace, settings, routes, UI state | Avoid unnecessary server dependence |
| Agent orchestrator | Prompt composition, model turns, tool calls, approvals, retries, context | Browser-compatible interfaces; bounded execution |
| Provider adapter | BYOK configuration, model capability detection, streaming | Respect CORS, credentials, and provider policies |
| Project core | Files, revisions, project metadata, transactions, import/export | Storage integrity and recovery |
| Runtime adapter | Boot, mount, install, process lifecycle, logs, preview | Capability detection and benchmark gating |
| Preview boundary | Render generated code/app | Protect the trusted builder origin and credentials |
| Shared packages | Design tokens, types, locale registry, contracts | Do not force builder-heavy JS into Astro |

### Critical distinction

**Next.js runs the builder, not necessarily the project the user created.** The user project runs inside a browser runtime when its framework and dependencies are supported. Production deployment of the created project is an entirely separate concern.

---

## 5. Domains, routing, and application boundaries

### Canonical public domain

- **Base domain:** `https://build.ladestack.in`
- **Astro root:** `/`
- **Next.js builder:** `/app`
- **No mandatory redirect directly to the builder.** First-time users can learn about the product on the marketing website.
- **No account pages** (`/login`, `/signup`, `/billing`, `/pricing`) are planned.

### Proposed URL map

| Route | Application | Notes |
| --- | --- | --- |
| `/` | Astro | Full home/landing page |
| `/#features` | Astro | Home section; not a separate features page |
| `/#use-cases` | Astro | Home section |
| `/#how-it-works` | Astro | Home section |
| `/#technology` | Astro | Home section |
| `/about` | Astro | Separate About page |
| `/contact` | Astro | Separate contact information page; no contact form |
| `/blog` | Astro | Localized blog index |
| `/blog/[slug]` | Astro | Individual Markdown article |
| `/privacy` | Astro | Privacy policy |
| `/terms` | Astro | Terms and conditions |
| `/disclaimer` | Astro | AI output/compatibility disclaimers |
| `/cookies` | Astro | Cookie and local-storage disclosures as applicable |
| `/open-source` | Astro | License notices and credits |
| `/app` | Next.js | Builder welcome screen |
| `/app/project/[id]` | Next.js | Browser-local workspace; ID does not imply cloud sharing |
| `/app/settings` | Next.js | App settings and subviews |
| `/ru/`, `/ja/`, ... | Astro | Non-English marketing locales |
| `/app/ru`, `/app/ja`, ... | Next.js | Non-English builder locales (exact routing contract to implement) |

### Routing implementation rules

- Treat Astro and Next.js as **separately deployable** applications behind a shared edge path router, reverse proxy, or platform routing configuration.
- Explicitly map `/app/**` and all of its assets and framework requests to Next.js; route everything else to Astro.
- Account for Next.js base paths, static chunks, images, caching, prefetching, and error routes.
- Guard against ambiguous rewrites between `/app` and localized paths.
- The two applications may share the public origin. In that case, namespace their local storage carefully and **never execute untrusted generated preview JavaScript on that trusted origin**.
- A dedicated preview origin, with restricted messaging, should be preferred when supported by the selected runtime.

---

## 6. Astro marketing website

The marketing website introduces the application. It is not the application itself and should be fast even if the user's browser cannot run the project runtime.

### Navigation

- Brand wordmark / logo → Home.
- **Features** → `/#features`.
- **Use Cases** → `/#use-cases`.
- **How It Works** → `/#how-it-works`.
- **Technology** → `/#technology`.
- **About** → `/about`.
- **Blog** → `/blog`.
- **Contact** → `/contact`.
- Primary **Start Building** CTA → `/app` while preserving the selected locale.
- Mobile: accessible collapsible navigation.

### Home sections, in recommended order

| # | Section | Core message | Presentation |
| --- | --- | --- | --- |
| 01 | Hero | From idea to editable, running code | Editorial headline, brief copy, primary CTA, meaningful editor/product preview |
| 02 | Product Showcase | See generation, code, and preview | Demo of actual code generation and activity capsule |
| 03 | Features | Agentic workflows and direct code control | Editorial feature bands/cards, concrete capabilities |
| 04 | Use Cases | What users can build | Visual templates for portfolios, SaaS, agency, business, dashboards, landing pages, etc. |
| 05 | How It Works | Describe → Build → Run → Refine → Export | Step sequence with UI illustrations |
| 06 | Technology | Honest engineering foundations | BYOK, agent tooling, Monaco, IndexedDB, compatible browser runtimes |
| 07 | BYOK & Local-first | Your keys, your files, your control | Privacy and ownership explanation; no absolute security claims |
| 08 | Templates | Practical starting points | Searchable category preview / jump to builder |
| 09 | FAQ | Clear answers and limitations | Accessible accordion, plain-language copy |
| 10 | Final CTA | Open the builder | Simple, calm final call to action |
| 11 | Footer | Product, company, legal, language | Responsive structured navigation |

**There must not be separate `/features`, `/use-cases`, `/how-it-works`, or `/technology` pages unless the product owner explicitly changes this decision.**

### Separate pages

**About:** LadeStack background, purpose, principles, honest product evolution, open-source acknowledgments where relevant.

**Contact:** Official business contact details and verified social destinations. Do not invent email addresses, phone numbers, testimonials, or social links. No contact form is needed.

**Blog:** All articles are human-edited Markdown, published in every required language.

**Privacy, Terms, Cookies, Disclaimer, Open Source:** Real policies matched to actual data flows and current licenses. Legal content needs appropriate final review; do not present generic generated text as legal approval.

### Error pages

- **404:** useful search/navigation recovery in the visitor's language.
- **500:** custom application-error handling where the hosting/rendering mode supports it.
- **501:** only if a genuine HTTP “Not Implemented” condition exists; not a generic UI fallback.
- **503:** friendly maintenance/unavailable message where the infrastructure permits.
- Edge/CDN-originated errors may bypass app-level pages; document and test the platform's behavior.
- Avoid confusing an unsupported browser runtime with HTTP 501: show an in-product compatibility explanation instead.

### Marketing editorial rules

- Write in a natural, concise, helpful, non-hyped tone.
- Demonstrate how a real task is accomplished rather than making broad marketing assertions.
- Do not claim every full-stack framework works, every model supports tool calling, or BYOK creates zero risk.
- Link only to working, implemented destinations in production.
- Feature demonstrations may be illustrative before launch, but must be visibly distinguishable from live product behavior.

---

## 7. Internationalization and content localization

### Supported languages — exactly eight in the current scope

| Locale | Language | Marketing example | Builder example |
| --- | --- | --- | --- |
| `en` | English — default | `/about` | `/app` |
| `ru` | Russian | `/ru/about` | `/app/ru` |
| `ja` | Japanese | `/ja/about` | `/app/ja` |
| `ko` | Korean | `/ko/about` | `/app/ko` |
| `zh` | Chinese (initially Simplified) | `/zh/about` | `/app/zh` |
| `tr` | Turkish | `/tr/about` | `/app/tr` |
| `fr` | French | `/fr/about` | `/app/fr` |
| `pt` | Portuguese (regional variant to finalize) | `/pt/about` | `/app/pt` |

### i18n requirements

1. English is the default route without `/en` by design; other languages use locale prefixes.
2. All visible navigation, content, buttons, alt text, labels, validation errors, tool permissions, empty states, settings, and metadata must use the selected locale.
3. A language switch keeps the reader on the corresponding page or translated article whenever available.
4. Homepage anchor sections remain in-page: `/ja/#features`, `/fr/#technology`, etc.
5. Launching the builder transfers the selected locale through the navigation URL (not cross-origin localStorage assumptions).
6. Builder UI language can differ from the language of the project the user asks AI to generate.
7. Persist the builder locale locally as a preference while respecting explicit locale URLs.
8. Localize the SEO title, description, Open Graph text, navigation, footers, FAQ, and error pages.
9. Keep translated terminology stable across Astro and Next.js with a shared glossary.
10. Use real locale-aware typography, date formats, punctuation, and line wrapping.
11. Use proper `lang` tags and avoid automatic redirect behavior that prevents crawlers or users from selecting a language.
12. Define missing-translation behavior explicitly; do not mix half-English and half-translated public pages.

### Translation quality policy

Translation is an editorial workflow, not merely UI string replacement. Human-sounding output must use the appropriate tone and conventions of each language. Technical terms, code, commands, provider names, and product names should remain accurate. Each article and marketing page must be proofread before multilingual release.

### Article consistency contract

Every published article has a stable `translationId`, exactly one finalized Markdown edition per supported locale, mapped alternate links, and locale-specific slugs/metadata. Missing editions block simultaneous multilingual publication rather than silently publishing incomplete language sets.

---

## 8. Markdown blog and editorial system

### Technology

- Astro **Content Collections**.
- Markdown as the canonical source format; MDX only if explicitly required by an approved interactive feature.
- Schema-validated frontmatter.
- Static prerendering by default.
- Syntax-highlighted, copyable code samples with accessible language labels.

### Proposed content layout

```text
apps/website/src/content/blog/
  en/
    getting-started.md
  ru/
    getting-started.md
  ja/
    getting-started.md
  ko/
    getting-started.md
  zh/
    getting-started.md
  tr/
    getting-started.md
  fr/
    getting-started.md
  pt/
    getting-started.md
```

This structure is **illustrative**, not an assertion that these files already exist.

### Planned article metadata

| Field | Purpose |
| --- | --- |
| `translationId` | Stable cross-language identity |
| `locale` | Article language |
| `slug` | Language-appropriate URL path |
| `title` | Human-written article title |
| `description` | Summary and SEO description |
| `publishedAt` / `updatedAt` | Publication and update dates |
| `author` | Actual credited author/team |
| `category` / `tags` | Blog navigation/filtering |
| `coverImage` / `coverAlt` | Responsive imagery and accessible alt text |
| `draft` | Publication gating |
| `canonical` | Override only when editorially justified |

### Reader features

- Featured articles, categories, tag filters, on-site search.
- Readable prose width, semantic headings, table of contents for longer posts.
- Reading time, article author, publication date, related articles, previous/next navigation.
- Responsive imagery, code syntax highlighting, keyboard-operable controls.
- RSS feed and sitemap integration.
- No fabricated comments/reviews. Avoid building a user-auth system merely for blog comments.

### Publishing workflow

Draft topic → write source edition → produce eight human-quality localized versions → check technical accuracy → validate metadata and links → check translation completeness → accessibility/SEO review → publish all locales → verify alternate URLs and sitemap.

---

## 9. SEO, discoverability, and content quality

### Technical SEO

- Canonical absolute URLs for every indexable page.
- Self-referencing and reciprocal language alternate (`hreflang`) relationships where applicable; include sensible `x-default` routing.
- Localized title and description tags, Open Graph/Twitter cards, favicon, robots policy.
- XML sitemap covering only valid, published, canonical URLs.
- Article, breadcrumb, organization, and FAQ structured data only when semantically and factually appropriate.
- Clear internal linking from marketing home → About/Blog/Contact/Legal and from relevant articles to the builder.
- Avoid indexable duplicate content, thin locale placeholders, orphaned articles, or misleading language auto-redirects.
- Use optimized images, cacheable assets, minimal JS, and accessible semantic HTML.

### Content strategy

Priority topics: how AI tool calling works, BYOK fundamentals, local-first project ownership, supported frameworks, designing apps from screenshots, using checkpoints, writing reliable prompts, and getting started with the builder. Articles should reflect actual product capability and include honest limits.

### Important routing note

Same-domain Astro + Next.js does not automatically improve SEO. Search performance depends on content usefulness, crawlability, localized quality, metadata, structured navigation, and real-world relevance. Builder workspace/private local-project URLs generally should not be SEO landing pages.

---

## 10. Design system and UI libraries

The supplied editorial design reference is adopted **as a design specification for appearance**, with product-specific adaptations; it is not permission to reuse a competing brand's name, logos, commercial fonts, or proprietary artwork.

### Brand direction

- Warm cream canvas with editorial whitespace.
- Warm near-black typography; minimal orange accents.
- Clean 1px hairlines, almost no decorative shadows.
- Regular-weight large display headings (not oversized bold SaaS clichés).
- Compact buttons, deliberately designed code/IDE mockups.
- Pastel AI-action pill colors only for agent activity visualization.
- Actual workspace remains a readable, functional dark IDE surface where appropriate.

### Proposed design tokens

| Token | Value / intent |
| --- | --- |
| `canvas` | `#F7F7F4` — warm cream |
| `canvasSoft` | `#FAFAF7` — quiet pane background |
| `surfaceCard` | `#FFFFFF` |
| `surfaceStrong` | `#E6E5E0` |
| `ink` | `#26251E` |
| `body` | `#5A5852` |
| `muted` | `#807D72` |
| `hairline` | `#E6E5E0` |
| `hairlineSoft` | `#EFEEE8` |
| `hairlineStrong` | `#CFCDC4` |
| `primary` | `#F54E00` — sparing orange CTA |
| `primaryActive` | `#D04200` |
| `success` | `#1F8A65` |
| `error` | `#CF2D56` |
| `timelineThinking` | `#DFA88F` — peach |
| `timelineSearch` | `#9FC9A2` — mint |
| `timelineRead` | `#9FBBE0` — blue |
| `timelineEdit` | `#C0A8DD` — lavender |
| `timelineDone` | `#C08532` — warm gold |

**Accessibility overrides are permitted and required:** for example, check the contrast of small white text on orange rather than assuming all reference combinations satisfy WCAG. Colors should be defined in shared tokens, not scattered inline hex values.

### Typography and spacing

- Display/body: **Inter** or **Geist**, with a carefully tuned regular-weight editorial display style. Do **not** bundle CursorGothic or other licensed font files without rights.
- Code: **JetBrains Mono** (subject to its license and inclusion method).
- Display hierarchy: ~72px desktop hero down to ~32px mobile, responsively, with readable line lengths.
- Content max width: approximately **1200px**.
- Desktop section rhythm: approximately **80px**.
- Spacing scale: **4px base**; common gaps 8/12/16/20/24/32/48px.
- Standard button/input radius: **8px**. Cards: **12px**. Large cards: **16px** when justified.
- Prefer borders and tonal contrast to heavy shadows, large glow effects, and saturated gradients.

### Library responsibilities

| Library/resource | Design responsibility |
| --- | --- |
| [shadcn/ui](https://ui.shadcn.com/) | Default buttons, dialogs, menus, tabs, forms, tooltips, settings, layout patterns |
| [React Aria](https://react-aria.adobe.com/) | Keyboard interaction, accessible collections, advanced selection, focus behavior |
| [Kibo UI](https://www.kibo-ui.com/) | Audited, specialized building blocks (e.g., dropzone, structured code display) |
| [Aceternity UI](https://ui.aceternity.com/components) | Sparse, optional motion/visual enhancements, never the editor foundation |
| [Vibrant.design](https://vibrant.design/) | Visual inspiration and layout research; not assumed to be an installable library |
| [Monaco Editor](https://microsoft.github.io/monaco-editor/) | Actual editable code; never replace with a read-only code-block component |
| [Lucide](https://lucide.dev/) | Consistent icon family |

**Do not indiscriminately mix incompatible component primitives.** Audit Kibo/shadcn/React Aria interactions, focus trapping, portals, overlays, and dependencies per component. Verify code-redistribution rights especially if third-party component source would appear in user-exported ZIPs.

### Responsive strategy

- Astro pages: complete mobile, tablet, desktop layouts.
- Builder: desktop-first, but provide usable mobile flows for project browsing, prompt entry, preview, approval, and file inspection.
- Prefer a panel/drawer navigation model to shrinking the entire desktop IDE onto a phone.
- Respect reduced-motion preferences. Avoid visual effects that compete with local compilation CPU/GPU usage.

---

## 11. Next.js AI Builder

### Welcome screen

User-visible essentials:

1. Calm welcome headline and concise value proposition.
2. Central multiline **prompt composer** that expands naturally during typing.
3. Attachment button, drag-and-drop, previews, progress, removal, and error states.
4. **AI mode selector** and **model/provider status** within the composer area.
5. Template categories, searchable template gallery, and project import.
6. Recent browser-local projects and resume actions.
7. Compact Settings control, without login/avatar conventions implying accounts.

Do **not** boot an expensive runtime merely because the welcome page loaded. Begin runtime startup **after** the user requests project generation/opening (and only when execution is needed).

### Project workspace

- Project title and type, code/preview switch, source download, settings, checkpoint access.
- Full-screen **Code view**: collapsible file explorer, folders, file tabs, Monaco, find/replace, diagnostics, edit support, optional terminal drawer.
- Full-screen **Preview view**: running application with desktop/tablet/mobile viewport options, refresh, error/connection state, open-preview action when safe.
- Bottom-center **floating agent capsule**: minimal current task, active file, spinner/check, status summary; expand to inspect tool history and approvals.
- A post-generation **prompt composer** for iterative changes.
- Clearly distinguish **Code vs Preview (visual view modes)** from **Code vs Plan vs Debug, etc. (AI agent modes)**.

### Generation capsule behavior

- For the active file: queued → generating → saving → completed or failed.
- Streaming progress uses a loader; completed items transition to a check indicator and scroll away as new tasks begin.
- File progress is grounded in actual file write events, not fabricated token counts.
- A green check means **file saved**, not that the entire application compiled successfully.
- A separate installation/preview-ready lifecycle is visible on expansion.
- The capsule should not permanently hide the bottom lines of code; provide editor padding or repositioning.
- When the agent is waiting for approval, make that state unmistakable and keyboard-accessible.
- After the task, restore the compact input state and surface final validation results.

### Templates

Starting categories may include: Business, Portfolio, SaaS, E-commerce, Agency, Dashboards, Education, Restaurants, Real Estate, Productivity, AI Apps, Developer Tools, Blogs, Events, and Landing Pages. Categories should contain **working** templates; do not ship decorative empty catalog cards.

Template actions must distinguish **start from prebuilt source** from **ask AI to generate something inspired by this design**.

---

## 12. Agentic AI and Kilo Code integration

### Source of inspiration and potential reuse

Official Kilo Code repository: <https://github.com/Kilo-Org/kilocode>  
Kilo documentation: <https://kilo.ai/docs>

As checked at planning time, Kilo's main public repository describes an **MIT-licensed** codebase with coding agents and related tools. **Before copying source, pin the exact commit and verify the license, original notices, transitive dependencies, and source-file provenance for that revision.** Kilo's CLI and IDE-extension implementations contain assumptions about Node/Bun/native processes, desktop editors, local terminals, and filesystem access; these cannot be imported into a browser-only app indiscriminately.

### Integration policy

**Audit → Identify portable modules → Adapt behind interfaces → Test in browser → Attribute correctly.**

Prefer reuse of proven logic where compatible:

- Agent turn state machine / orchestration concepts.
- Modes and custom agents.
- Prompt construction and project instruction mechanisms.
- Tool-call dispatch, argument validation, and permission rules.
- Provider/model abstraction and streaming patterns.
- Context management, summaries, and diagnostics.
- Checkpoint semantics and activity history.
- Delegated tasks/subagents where browser-compatible.

Implement browser-native replacements for dependencies requiring unrestricted shell access, native Git, host filesystem, privileged network, process spawning outside the runtime, or backend databases.

### Modes

| Agent mode | Intended behavior | Default permissions |
| --- | --- | --- |
| **Code** | Generate, inspect, and update project files | Project-scoped read/write; risky operations gated |
| **Plan / Architect** | Requirements, architecture, implementation plan | Read/search; no project source writes |
| **Ask** | Explain code and answer project questions | Read/search; no writes or arbitrary commands |
| **Debug** | Inspect diagnostics, reproduce, propose/perform fixes | Read and tests; edits with policy/checkpoint |
| **Review** | Inspect code for bugs, security, performance, maintainability | Read/diff/diagnostics by default |
| **Orchestrate** | Delegate subtasks, combine outputs | Delegation permitted, permissions never elevated |
| **Custom** | User-defined goals, prompts, tools, model | Constrained by global security policy |

These are **proposed product modes**; do not assume an exact one-to-one match to all versions of Kilo's default mode names, behaviors, or extensions.

### Agent loop

```text
User task + attachments
  ↓
Mode prompt + trusted policies + selected project context
  ↓
Provider streaming response / tool call
  ↓
Validate schema and project-scoped authority
  ↓
Approval decision (allow / ask / deny)
  ↓
Execute browser-compatible tool and collect result
  ↓
Update files, diagnostics, UI timeline, and checkpoint state
  ↓
Continue / repair / ask user / finish / cancel / budget exhausted
```

### Agent operation safeguards

- Bound the number of turns and tool calls; provide per-session request/token budget controls.
- Cancel outstanding generation and prevent stale tool results from committing.
- Use correlation IDs, revision IDs, idempotency where practical, and a serial write queue for conflicting file operations.
- Never bypass denied permissions merely because the model asks, an attachment says to, or a custom agent is configured.
- Tool output is **untrusted data**. Browser pages, repository files, PDFs, and prompt attachments may include malicious instructions.
- Support visible summaries of what changed and what remains unverified.
- Avoid exposing private model reasoning. Show actual task/tool progress and concise action summaries.

---

## 13. Tools, permissions, and safe autonomy

### Proposed browser tool registry

| Tool concept | Responsibility | Default policy |
| --- | --- | --- |
| `list_files` | List project files and folders | Allow |
| `read_file` | Read authorized project file | Allow |
| `search_code` | Search text/symbols across local project | Allow |
| `write_file` | Create file in project | Allow with snapshot/revision tracking |
| `edit_file` / `apply_patch` | Targeted modifications | Allow with conflict safety |
| `rename_file` | Move or rename path | Ask for widespread/destructive change |
| `delete_file` | Delete project file | Ask unless explicitly scoped approval |
| `read_diagnostics` | Read build/type/runtime errors | Allow |
| `install_dependencies` | Reconcile package manifest | Allow under package policy |
| `run_command` | Execute command in runtime | Ask or restrictive allowlist |
| `read_terminal` | Inspect process output | Allow |
| `get_preview_status` | Check running project state | Allow |
| `capture_preview` | Capture preview if supported and secure | Allow if capability exists |
| `create_checkpoint` | Save local version state | Automatic |
| `restore_checkpoint` | Roll back source state | Ask |
| `delegate_task` | Delegate to specialized agent | Controlled and bounded |
| `search_web` | Access documentation or references | Optional, disclosed provider/service |
| `export_source_zip` | Produce source archive | Normally user-triggered |

These **are proposed interface names**, not claims that Kilo exposes identical functions.

### Permission presets

| Preset | Behavior |
| --- | --- |
| **Manual** | Ask before consequential write, install, and command operations. |
| **Balanced (default)** | Auto-allow project-scoped low-risk operations; ask before destructive/high-impact operations. |
| **Auto** | Auto-approve only eligible bounded operations; never defeat hard security restrictions. |

### Policy enforcement

- Use explicit `allow`, `ask`, `deny` rules per capability and scope.
- Verify paths are inside the currently selected virtual project; block traversal/symlink escape where applicable.
- Terminal operations need an operation-specific policy, not a blanket “safe shell” assumption.
- Package install hooks and third-party dependencies can execute untrusted logic; address supply-chain risks.
- External network access, provider secrets, environment variables, and privileged APIs receive special treatment.
- Persist consent for narrow patterns only; provide visibility and revocation.
- Approval dialogs show command, affected files, reason, provider/request origin, and risk.
- Default denied: access to host app credentials, unrelated site/browser storage, unrestricted local OS resources, and cross-project data.

---

## 14. System prompts, context, and skills

### Layered prompt design

1. **Non-overridable application policy** — tool safety, scope, data protection, truthfulness.
2. **Agent core behavior** — how to reason over tasks, call tools, react to failures, and report results.
3. **Mode-specific instructions** — Code, Plan, Debug, Ask, Review, Orchestrate, Custom.
4. **Runtime capability context** — supported APIs, frameworks, package manager, preview limitations.
5. **Tool declarations** — argument schema, side effects, permission behavior, error contracts.
6. **Project instructions** — project conventions, stack, style guide, app-owned `AGENTS.md` equivalent.
7. **Workspace context** — file tree, relevant source, active diagnostics, accepted checkpoints.
8. **Current user task** — prompt, attachments, reference designs, output language.

Uploaded reference files and project rule files are lower-trust input. They may add coding preferences but must not override application security or permissions.

### Context management

- Index file paths, sizes, language, dependency relationships, and relevant symbols locally.
- Use targeted context retrieval and code search rather than dumping the entire project into every request.
- Support summaries/compaction for long agent conversations.
- Track model context capabilities, tool-call support, streaming support, multimodal support, and output limits.
- Save user-visible sessions locally; avoid placing API keys or raw secrets in context snapshots.
- Surface token/cost estimates where provider metadata supports it; never fabricate exact bills.

### Skills and advanced workflows

The product may later support reusable task instructions, imported skill descriptions, workflow steps, and subagents. Tool/plugin/MCP integrations must be audited for browser compatibility and require explicit approval where they introduce external services or privileged processes. **“Kilo feature parity” is a tracked roadmap, not an MVP guarantee.**

---

## 15. BYOK: models, credentials, and usage

### Goal

Users supply their own model credentials rather than using LadeStack credits. Model API charges, limits, and usage terms belong to the selected provider.

### Candidate provider integrations

- OpenAI
- Anthropic
- Google Gemini
- OpenRouter
- DeepSeek
- Mistral
- Groq
- Compatible custom OpenAI-style endpoints
- Optional local providers (Ollama/LM Studio) if local browser/network access is feasible and users understand setup

Provider support should be based on actual tested API capability, not a static list that implies all models support tools or images.

### Required BYOK features

- Add, test, choose, replace, and remove provider key.
- Select default provider and model per agent/mode if desired.
- Detect tool calling, streaming, image input, structured-output, and context-window support.
- Graceful handling for missing, invalid, expired, insufficient-credit, rate-limited, or disallowed credentials.
- Cancel a running request and communicate whether provider billing may already have occurred.
- Optional per-session budget/iteration limits controlled by the user.
- Separate settings-only metadata from secret material.

### Credentials architecture

**Direct browser API:** Lower infrastructure burden, but only feasible for provider endpoints with suitable browser/CORS and credential policies; the user key is inherently accessible to the running client.

**Optional secure relay:** Useful where browsers cannot directly call a provider, but the relay will receive the key and requires transparency, rate limiting, abuse mitigation, no-secret logging, appropriate infrastructure, and trust. No-auth public relays are abuse-sensitive. The relay does not make the user's browser-held key magically confidential.

### Key persistence policy

- Default to a session-scoped approach with no indefinite plaintext persistence.
- Offer **opt-in** passphrase-derived local encryption for persistent keys, after a security assessment.
- Never claim that encryption fully protects a key from malicious scripts running in the already-unlocked application origin.
- Never put keys in project files, Git history, URL parameters, local diagnostic reports, prompt logs, exported ZIPs, or checkpoint manifests.
- Redact secrets from errors and telemetry and avoid transmitting them to external analytics.
- Clearly disclose if requests travel through LadeStack infrastructure.

---

## 16. Browser runtime and dependency automation

### Runtime strategy: benchmark first, lock later

| Candidate | Why evaluate | Main caution |
| --- | --- | --- |
| **WebContainers** | Strong Node/npm browser development reference | Commercial production license requirements; browser constraints |
| **Lifo** | Browser-native Node-compatible open-source alternative | Compatibility, maintenance, and preview isolation require independent verification |
| **Wasmer** | WASM/WASIX and specialized multi-language execution | Not automatic full npm/Node compatibility; SDK/license details vary |
| **Sandpack / browser bundler** | Lightweight static/frontend fallback | Core bundler does not equal a full unrestricted Node server; Nodebox terms separate |
| **esbuild-wasm** | Lean browser-side JS/TS bundling | Bundling alone is not complete Node runtime/process support |

Do not invent winning benchmarks or choose production WebContainers usage before checking current commercial permission. Record verified test results and license findings against exact package versions.

### Runtime adapter contract (proposed)

```text
capabilities() → supported languages, APIs, packages, network, preview, resources
initialize() / dispose()
mountProject(files)
readFile(path) / writeFile(path, content) / deleteFile(path)
installDependencies(manifest, lockfile, policy)
startProcess(command, args) / stopProcess(id)
streamProcessOutput(id)
getPreviewEndpoint() / observePreviewStatus()
snapshotWorkingState() / reconcileProjectRevision()
```

Adapters must return **unsupported** where necessary, not fake success. Prevent simultaneous conflicting installations and ensure that a project revision is consistent with runtime state.

### Project startup lifecycle

```text
Prompt submitted
  ├─ Analyze requirements and attachments
  ├─ Choose compatible project profile and runtime
  └─ Boot runtime in parallel with initial agent planning
             ↓
       Valid project manifest
             ↓
       Mount coherent files
             ↓
       Dependency reconciliation (automated)
             ↓
       Start compatible dev server
             ↓
       Runtime server-ready signal
             ↓
       Preview, HMR, diagnostics, repair
```

### `package.json` policy

- Every generated **Node/JavaScript-based project** has a valid, reproducible `package.json` with appropriate scripts/dependencies.
- The file is not a precondition for the runtime's *boot API* itself; it is a standard project manifest for dependency and command workflows.
- Non-Node references (e.g., uploaded Python source) do not imply native Python runtime support.
- Use a recognized package manager and preserve its lockfile whenever practical.

### Dependency reconciliation

- Validate the **complete** manifest, not an incomplete AI token stream.
- Detect content/revision changes in dependencies and development dependencies.
- Debounce/coalesce rapid changes into a single requested install.
- Run at most one conflicting install at a time; report progress and failure.
- Ignore stale completion from a superseded install revision.
- Reuse caches where safe; avoid repeated installs for unchanged manifests.
- Treat install scripts and network fetching as security-sensitive.
- Restart dev servers only when necessary; preserve HMR for ordinary source edits.
- Allow errors to flow into a bounded AI diagnosis/repair loop.

### Browser restrictions

Browser runtimes cannot guarantee Docker, arbitrary native binaries, all C++ npm addons, background daemons, production hosting, persistent server processes, or every framework. Design a capability-aware support matrix. Mark incompatible project requests upfront and offer a supported alternative where possible.

---

## 17. Streaming code generation and preview

### Streaming is not direct blind file append

The AI provider's token stream may be incomplete, unordered at the file-operation level, or interrupted. Build a **structured operation layer** between model output, visible editor text, durable project files, and executable runtime copies.

### Three conceptual streams

1. **Code-display stream** — incremental syntax-highlighted text in Monaco.
2. **File-operation stream** — `create`, `edit`, `rename`, `delete`, `save`, with stable file IDs and revisions.
3. **Runtime event stream** — runtime boot, installation, stdout/stderr, server readiness, HMR, diagnostics, cancellation.

### Proposed event categories

- `agent.task.started`, `agent.task.completed`, `agent.task.failed`, `agent.task.cancelled`
- `agent.tool.requested`, `agent.tool.approved`, `agent.tool.denied`, `agent.tool.completed`
- `project.file.started`, `project.file.delta`, `project.file.saved`, `project.file.failed`
- `runtime.boot.started`, `runtime.boot.ready`, `runtime.boot.failed`
- `runtime.install.started`, `runtime.install.progress`, `runtime.install.completed`, `runtime.install.failed`
- `runtime.server.ready`, `runtime.preview.updated`, `runtime.diagnostic`
- `checkpoint.created`, `checkpoint.restore.requested`, `checkpoint.restored`

These event names are an **illustrative contract**, not implemented API declarations.

### UX and correctness constraints

- Streamed code is visible in Monaco, but filesystem updates occur in coherent batches/patches rather than on every token.
- User can browse/edit other files while the AI works; never force active-tab switching repeatedly.
- Manual edits are not silently overwritten; use revision verification and conflict handling.
- Installation can proceed while files are generated, but the server starts only once prerequisites are valid.
- File saved ≠ build passed ≠ preview ready; display accurate, independent status indicators.
- Reconnect/retry must not duplicate destructive operations.
- Stop generation cleanly on cancellation, provider failure, tab suspension, or runtime crash.
- Preserve a pre-task checkpoint before high-impact AI edits.

### Preview modes

- **Static:** isolated HTML/CSS/JS preview, without a full Node dependency when possible.
- **Framework frontend:** React/Vite and other benchmark-validated toolchains with live HMR.
- **Compatible Node API:** previewable backend endpoints if the runtime truly supports required APIs.
- **External services:** explicit user-configured database/auth services; user credentials stay protected.
- **Unsupported:** explain why a specific framework or dependency cannot run locally.

### Critical preview security boundary

Prefer a **separate untrusted preview origin**, restricted `postMessage` schema, sandboxing, and narrowly scoped permissions. Do not allow user-generated preview code to read the trusted builder's BYOK keys, session storage, IndexedDB data, or privileged app APIs. Browser Service Worker origin/scope behavior must be tested for each candidate runtime.

---

## 18. Local-first storage, checkpoints, and recovery

### Storage approach

- **IndexedDB** for structured project data, files/revisions where practical, settings, tasks, sessions, and checkpoint manifests.
- **OPFS** where appropriate for large assets, binary content, and filesystem-oriented caches.
- **Browser runtime filesystem** is the temporary working execution copy, not the sole durable source.
- Use browser storage persistence APIs where appropriate, and document that device/browser clearing can still remove data.

### Proposed IndexedDB stores

| Store | Purpose |
| --- | --- |
| `projects` | Project identity, framework, settings, timestamps |
| `projectFiles` | File identities, content hashes, revisions, paths |
| `fileBlobs` | Deduplicated content if using content-addressed storage |
| `agentSessions` | Conversation history and task metadata |
| `agentMessages` | User/assistant/tool-visible messages |
| `toolExecutions` | Validated tool call audit data, redacted |
| `checkpoints` | Immutable project snapshot manifests |
| `templates` | Template metadata / locally cached assets |
| `attachments` | Reference metadata and safe content pointers |
| `agents` | Custom agent configs and prompts |
| `providerSettings` | Non-secret provider/model preferences |
| `encryptedCredentials` | Optional passphrase-protected BYOK settings |
| `runtimeState` | Recoverable process/manifest metadata |
| `preferences` | Locale, theme, editor, permissions |

Names are **proposed**, not an approved schema or existing migration.

### Checkpoint model

- Automatically snapshot before major AI actions and at meaningful task boundaries.
- Support optional manual/named checkpoints.
- Capture a file manifest referencing immutable content hashes to avoid copying an entire project per minor edit.
- Display per-file diffs and checkpoint summary.
- Warn before restoring a version; checkpoint the current work first.
- Do not promise to undo external side effects (emails, API requests, remote deployments, remote databases, package downloads).
- Handle storage quota and checkpoint garbage collection without losing reachable versions.
- Maintain consistency between restored project source, runtime filesystem, package manifest, and preview.

### Multi-tab and conflict safety

- Define single-writer or coordinated multi-tab behavior.
- Use project/file revision identifiers; reject stale overwrite operations.
- Preserve local manually edited work when an agent modifies overlapping files.
- Transactions and crash recovery must protect against partially committed operations.

### Backup vs source ZIP

- **Source ZIP:** runnable/editable code, assets, manifests, README; no credentials/cache.
- **Workspace backup:** optional portable data package including conversations/checkpoints/settings where consented and safely redacted.
- These formats are not interchangeable.

### Migration safety

If this project evolves from an existing GB Coder installation, first audit its current IndexedDB stores and localStorage keys. Preserve project identities, source files, preferences, and compatibility. In particular, do **not** silently drop existing project data or assume the existing editor-style and project-type fields are interchangeable. Require tested forward migrations, rollback plans, and representative fixtures before changing storage versions.

---

## 19. Attachments, imports, templates, and ZIP export

### Proposed attachment compatibility

| Category | Examples | Handling |
| --- | --- | --- |
| Images | PNG, JPG/JPEG, WebP, GIF, SVG, AVIF | Preview, safe asset handling, optional model vision input |
| Code | HTML, CSS, JS, JSX, TS, TSX, JSON, PY and related source | Read as project reference or deliberate import |
| Documents | PDF, DOCX; legacy DOC where supported | Text extraction, structure/context processing |
| Spreadsheets | XLSX, CSV, ODS; legacy XLS where supported | Tabular extraction and truncation policy |
| Text/PRD | TXT, MD, MDX, YAML, XML | Context/reference material |
| Archives | ZIP | Scan, validate, unpack within project boundaries |

Accepting an upload format is **not equivalent** to fully understanding every file's content or executing it. Complex scans, password protection, macro behavior, embedded media, formulas, and legacy formats may have limited support.

### Attachment pipeline

1. Validate file type/signature, size, quotas, encoding, and path safety.
2. Extract usable text/images/tables through browser-compatible processors.
3. Summarize or chunk oversized context for model limits.
4. Store attachment references separately from executable source files.
5. Ask or follow explicit intent before importing a reference file into the project.
6. Remove unsafe metadata/secrets where appropriate.
7. Show attachment errors and partial extraction warnings.

### Template system

Each template should include working source, category/tags, supported runtime profile, preview/demo, original licensing metadata, and a defined import/create path. Do not export third-party design source in ZIP without suitable redistribution rights.

### Source ZIP acceptance criteria

- Exact project source tree, assets, `package.json`, compatible lockfile, relevant build config, README/setup notes.
- Exclude `node_modules`, runtime caches, temporary artifacts, provider API keys, actual `.env` secrets, internal logs, and unsafe references.
- Include `.env.example` only with non-secret placeholders when needed.
- Preserve filenames, casing, relative paths, binary asset integrity, and valid ZIP structure.
- ZIP should be independently usable with the stated toolchain; don't claim successful installation without testing.
- Support large-project export with memory-aware browser handling and failure feedback.
- Allow import of compatible ZIPs with path traversal/zip bomb protections.

---

## 20. Application settings

### Settings categories

| Category | Controls |
| --- | --- |
| **AI Providers** | API keys, provider list, model discovery, custom endpoints, connection tests |
| **Model Behavior** | Default model, reasoning/output settings where available, streaming, token/turn budgets |
| **Agents & Modes** | Built-in/custom modes, prompts, model overrides, allowed tools, subagents |
| **Permissions** | Manual/Balanced/Auto, per-tool rules, command approvals, allowlist review |
| **Runtime** | Runtime adapter, supported frameworks, startup policy, install status, diagnostics |
| **Editor** | Code theme, tab size, word wrap, minimap, autosave, file explorer, terminal UI |
| **Appearance** | Marketing vs workspace theme behaviors, compact/comfortable density, reduced motion |
| **Language** | Eight supported UI languages; selected output/project language separately |
| **Checkpoints** | Automatic snapshots, retention, naming, comparison, restore policy |
| **Data & Privacy** | IndexedDB usage, key removal, project import/export, backup, data clear |
| **Templates** | Preferred stack/template settings and recently used templates |
| **Advanced** | Agent logs (redacted), performance diagnostics, experimental compatibility toggles |

### Settings UX

Searchable sidebar/categories, clear descriptions, sensible safe defaults, meaningful errors, keyboard-accessible forms, confirmation for destructive actions, and per-setting persistence semantics. **No profile/billing/login settings.**

---

## 21. Privacy, trust, security, and accessibility

### Threat model

Treat AI output, generated source, third-party npm packages, uploaded references, scraped web pages, ZIP files, MCP/tools, custom prompts, and preview JavaScript as **potentially untrusted**.

### High-priority security controls

1. Isolate untrusted preview execution from the trusted builder origin, storage, and BYOK credentials.
2. Validate every tool call against a typed schema, path scope, current project, permission policy, and runtime capability.
3. Never treat a system prompt as a substitute for hard permission enforcement.
4. Gate terminal commands, dependency installation, destructive changes, network access, and secret usage.
5. Enforce content/file validation for ZIP imports and attachments; block traversal and resource exhaustion.
6. Prevent untrusted attachment instructions from overriding security policy.
7. Redact keys, tokens, and sensitive values from errors, telemetry, checkpoints, export, and URLs.
8. Use CSP, safe iframe permissions, cross-origin messaging validation, and secure headers appropriate to the selected runtime.
9. Assess service worker registrations/scopes; avoid letting generated code seize the builder application's scope.
10. Apply dependency auditing and supply-chain policies; prefer pinned versions when reproducibility matters.
11. Document browser key-exposure realities and external AI provider data flow honestly.
12. Provide a clear way to cancel tasks, deny permissions, remove keys, clear local data, and export data.

### Privacy promises that **must not** be overstated

- “No account” does not mean “no network requests.”
- “Stored locally” does not mean attached prompts/files are never sent to the chosen AI provider.
- “Encrypted key storage” does not protect an already-unlocked key against arbitrary malicious same-origin scripts.
- “Free forever” does not mean unlimited free third-party inference, hosting, or remote database usage.
- “Browser sandbox” does not automatically make untrusted package install scripts harmless.

### Accessibility and inclusive UX

Target **WCAG 2.2 AA** for both public site and builder: semantic markup, sufficient contrast, visible focus, keyboard use, meaningful error messages, accessible dialogs, screen reader announcement for non-noisy statuses, reduced motion, responsive layouts, and internationalized labels. Perform automated **and** manual accessibility checks; this README does not assert certification.

### External/provider disclosure

Privacy and legal pages must explain: browser-local data, optional AI-provider transfer of prompts/attachments, optional relay behavior, any analytics if introduced, third-party CDN/assets, local browser storage, and how data deletion/backup works.

---

## 22. Errors, failure modes, and observability

### Marketing website errors

- Localized 404 and useful navigation recovery.
- Where supported, localized 500 / service unavailable views.
- Proper HTTP status codes and no false 501 handling.
- Handle CMS/content build failures and missing translations as release blockers.

### Builder error taxonomy

| Failure | User-facing behavior | Recovery |
| --- | --- | --- |
| No API key | Explain BYOK requirement | Open provider settings |
| Invalid/expired key | Non-sensitive provider error | Replace/test key |
| Model lacks tools | Explain capability mismatch | Select compatible model/mode |
| Provider rate limit | Retry guidance; no fabricated ETA | Retry after provider permits |
| Prompt/attachment too large | Explain size/context issue | Split, trim, or summarize |
| Runtime unsupported | Name incompatible capability | Supported stack/fallback |
| Container boot failure | Clear runtime failure state | Retry/select fallback |
| npm install failure | Show sanitized diagnostics | Agent-assisted repair/rollback |
| Build/type error | Display actual diagnostics | Guided fixes/checkpoint |
| Preview fails | Separate source/build/server status | Reconnect/restart where safe |
| Browser storage quota | Warn before losing data | Export/cleanup |
| Checkpoint restore conflict | Show files/revisions and confirm | Safe restore/cancel |
| Browser refresh/crash | Restore durable project/source | Resume from checkpoint/local storage |
| ZIP export failure | Preserve source, report exact error | Retry using smaller package |

### Observability without surveillance

- Prefer opt-in, privacy-minimizing diagnostics.
- Do not upload raw project source, attachments, prompts, API keys, or user workspace metadata by default.
- Redact secrets in terminal logs and error payloads.
- Use anonymized aggregate performance counters only if an appropriate privacy disclosure and user control exist.
- Make diagnostics export user-initiated and inspectable before sharing.

---

## 23. Performance and quality targets

**These are proposed engineering targets, not measured results or guarantees.** Confirm baselines on a declared reference machine/browser/network and record p50/p95 values.

### Public Astro site

- Prerender core content, including localized blog posts.
- Favor minimal hydration and optimized static assets.
- Meet good Core Web Vitals thresholds in realistic testing.
- Use responsive imagery, font optimization, sitemap/hreflang checks, and page budgets.
- Avoid shipping Monaco, runtime engines, or builder-only dependencies in the marketing bundle.

### Builder

- Load welcome screen without prebooting Node runtime.
- Lazy-load Monaco, terminal, diff viewer, and runtime as required.
- Prevent token streaming from rerendering the entire app on every character.
- Use batching/backpressure for file and progress events.
- Keep editor responsive while dependencies install.
- Monitor storage quota, memory pressure, and CPU cost in long-running projects.
- Preserve all committed source files under tested crash/reload conditions.

### Benchmark targets (subject to feasibility)

| Metric | Initial target |
| --- | --- |
| Critical security/data-integrity tests | 100% pass |
| Core React/Vite test-suite success | ≥95% across repeated compatible runs |
| Cached project preview readiness | p95 ≤8 s on reference desktop/network |
| Fresh project first preview | p95 ≤30 s on reference desktop/network when packages available |
| Simple HMR update | p95 ≤2 s under defined test conditions |
| Compatible dependency reconciliation | ≥98% success across test suite |
| Durable source recovery after reload | 100% in defined crash/reload scenarios |
| Localization coverage of published articles | 100% across eight required locales |

If these targets cannot be met on a candidate runtime, revise scope or candidate rather than misrepresenting performance.

---

## 24. Proposed monorepo structure

A single repository can contain both apps, with independent deployment configurations and carefully shared packages. The structure below is **proposed**, not a description of created files:

```text
ladestack-build/
├── README.md
├── design.md                         # User-provided visual design reference
├── apps/
│   ├── website/                      # Astro public website
│   │   ├── src/
│   │   │   ├── pages/                 # Home, About, Contact, Blog, Legal, Errors
│   │   │   ├── layouts/
│   │   │   ├── components/
│   │   │   ├── content/
│   │   │   │   └── blog/              # en, ru, ja, ko, zh, tr, fr, pt
│   │   │   ├── i18n/
│   │   │   └── styles/
│   │   └── public/
│   └── builder/                      # Next.js application under /app
│       ├── app/                       # Next App Router, layouts, locale handling
│       ├── components/
│       │   ├── welcome/
│       │   ├── composer/
│       │   ├── workspace/
│       │   ├── editor/
│       │   ├── preview/
│       │   ├── agent-capsule/
│       │   ├── checkpoints/
│       │   └── settings/
│       ├── features/
│       ├── services/
│       └── public/
├── packages/
│   ├── design-system/                # Shared tokens and audited primitives
│   ├── i18n/                         # Locale registry, labels, shared terminology
│   ├── shared-types/                 # Project, agent, tool, event contracts
│   ├── agent-core/                   # Browser-adapted Kilo-compatible patterns
│   ├── provider-adapters/            # BYOK and model capability abstraction
│   ├── tool-registry/                # Tool policy and execution routing
│   ├── runtime-adapters/             # Lifo/WebContainers/Wasmer/etc. experiments
│   ├── project-storage/             # IndexedDB/OPFS, migrations, backups
│   ├── checkpoint-engine/           # Content revisions and rollback
│   └── zip-io/                      # Source export/import
├── tooling/
│   ├── locale-validation/
│   ├── content-quality/
│   └── benchmark-harness/
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   ├── accessibility/
│   ├── i18n/
│   ├── security/
│   └── runtime-benchmarks/
├── docs/
│   ├── architecture/
│   ├── decisions/
│   ├── api-contracts/
│   ├── security/
│   └── deployment/
└── deployment/
    ├── vercel/
    └── cloudflare/
```

### Dependency direction

Shared packages should not import app-specific routing/layout code. Astro must avoid importing browser-runtime or Monaco dependencies. Sensitive tool execution belongs in an audited layer behind typed interfaces. Exact filenames/scripts/versions are implementation decisions, not settled in this README.

---

## 25. Development and deployment environments

### Preferred targets

| Application | Initial preference | Alternative |
| --- | --- | --- |
| Astro marketing website | Cloudflare static deployment | Vercel static hosting |
| Next.js builder | Vercel (native Next.js support) | Cloudflare Workers with a tested Next.js compatibility solution |
| Optional BYOK relay | Minimal edge endpoint if absolutely needed | Another secure independently hosted relay |
| User-generated app preview | User's own compatible browser runtime | Capability-based frontend fallback |

### Same-domain deployment challenge

Astro `/` and Next.js `/app/**` can be served from two independent deployments by a correct reverse proxy, edge router, or platform rewrites. Requirements:

- All app chunks/assets/image routes have correct base paths.
- Localization and Next.js prefetching survive rewrites.
- SEO sitemap and robots belong to the marketing site.
- Browser runtime requires its documented isolation/COOP/COEP headers where applicable.
- Third-party cross-origin embeds, images, scripts, OAuth popups (if ever used), preview frames, and CSP behavior are tested.
- Never broadly enable unsafe cross-origin access merely to make preview work.
- Deploy and roll back each application independently.
- Validate cache headers for HTML, immutable assets, service workers, and runtime artifacts.

### Cloudflare caveat

A Next.js-on-Cloudflare path may depend on a compatibility implementation such as **vinext**. As documented during planning, vinext is a beta compatibility project; verify exact Next.js/App Router features with an automated compatibility matrix before treating deployment as equivalent to native Vercel. Do not assume Cloudflare Workers executes arbitrary project Node processes on the server—the builder's browser runtime is separate.

### Environment and configuration principles

A future implementation may define environment variables for **public marketing/build URLs**, optional service endpoints, environment name, and feature flags. Keep any relay credentials/server-side secrets restricted to the server. **Do not add a platform-owned universal model API key that silently replaces the BYOK promise.** Do not include unverified `npm run ...` commands in installation instructions before the repository actually contains the associated scripts.

### Developer setup (to be finalized after scaffolding)

1. Install the repository's pinned JavaScript runtime/package manager.
2. Install workspace dependencies with the package manager named in the lockfile.
3. Configure local domain/path routing and environment examples.
4. Start Astro and Next.js dev services independently.
5. Run unit, lint, type, content/i18n, accessibility, security, and E2E checks.
6. Test a real supported browser runtime, a sample project, npm install, preview, checkpoint restore, and export.
7. Confirm production headers/rewrite behavior in staging before public deployment.

**Exact commands, versions, and environment keys: TBD when implementation begins.**

---

## 26. Testing strategy and acceptance criteria

### Marketing acceptance

- Home features/use-cases/how-it-works/technology exist as **sections**, not standalone pages.
- About, Contact, Blog, Privacy, Terms, Disclaimer, Open Source, and relevant error views work.
- Exactly eight target locales have complete core site content.
- Every published blog has eight valid Markdown translations and matching alternate metadata.
- Canonical, hreflang, sitemap, robots, article metadata, and localized navigation validate.
- Content is natural, technically truthful, and readable at mobile widths.
- No pricing, billing, sign-in, or sign-up components exist.

### AI Builder acceptance

- User enters without account creation.
- User supplies own compatible provider key and can remove it.
- Prompt + attachments initiate a local project and visible streaming.
- AI modes have actual role-specific permissions.
- File explorer, Monaco, tabs, code edits, and Code/Preview switching work.
- Capsule reports genuine file/runtime events without dominating the workspace.
- Compatible project installs dependencies automatically after manifest validation.
- Agent observes real errors and can attempt policy-bounded repair.
- Checkpoints save/compare/restore consistent source state.
- Browser reload recovers saved projects.
- ZIP export contains valid code/assets and excludes secrets/dependency caches.
- Settings, dialogs, agent tool prompts, and errors work in all supported UI locales.

### Runtime benchmark suite

| Test ID | Scenario | Pass definition |
| --- | --- | --- |
| R01 | Cold initialize | Starts correctly with measured timing/errors |
| R02 | Project mount | 50–200 files present with correct contents |
| R03 | npm install | React/Vite dependencies and lockfile work |
| R04 | Dev server | Preview endpoint becomes ready |
| R05 | HMR | Source update correctly changes preview |
| R06 | Manifest change | Added dependency installs without manual command |
| R07 | Node APIs | Documented compatibility tests pass |
| R08 | TypeScript build | Typecheck/build completes for reference project |
| R09 | Node API service | Compatible sample API works where claimed |
| R10 | Advanced framework | Next.js SSR/routes tested, not assumed |
| R11 | Failure recovery | Broken package/error safely recovered or reported |
| R12 | Persistence | Reload restores durable source accurately |
| R13 | Resource usage | Memory/CPU/network numbers captured |
| R14 | Browser coverage | Chrome, Edge, Firefox, Safari against support matrix |
| R15 | Isolation/security | Generated code cannot access trusted app secrets/storage |

**Hard gates:** no critical source corruption, no critical preview-origin exposure, valid commercial rights, reproducible core install/preview, honest unsupported-state behavior. A high average benchmark score does not override failure of these gates.

### Test layers

- **Unit:** locale registry, manifest diffing, file content hashes, tool schemas, permission evaluation, ZIP paths.
- **Integration:** provider streaming, tool execution, IndexedDB transactions, runtime adapter lifecycle.
- **E2E:** anonymous onboarding, complete build flow, user edits, cancel, resume, checkpoint, export.
- **Security:** prompt injection, malicious ZIP, path traversal, preview origin isolation, secret redaction, command policies.
- **Accessibility:** keyboard-only use, screen reader checks, reduced motion, mobile dialogs.
- **Content:** translation completeness, links, hreflang, localized Markdown and metadata.
- **Deployment:** preview server headers, `/app` rewrites, service worker registration, static assets, error routing.

---

## 27. Phased delivery roadmap

| Phase | Deliverable | Exit gate |
| --- | --- | --- |
| **0. Discovery** | Lock scope, source licenses, design tokens, URL/i18n contract, runtime benchmark suite | Architecture decisions documented |
| **1. Foundations** | Monorepo, shared types/design tokens, CI, staging targets | Repeatable local builds/tests |
| **2. Astro public site** | Full home sections, About, Contact, Legal, errors, responsive design | SEO/accessibility review |
| **3. Content/i18n** | Markdown collections and eight complete locale editions | Translation/alternate validation |
| **4. Next.js shell** | Welcome, templates, prompts, settings, project workspace | Usable keyboard/mobile UI shell |
| **5. Local project core** | IndexedDB, migrations, import/export, checkpoints | Durable project recovery |
| **6. BYOK + agents** | Provider capabilities, Kilo-adapted engine, modes, tool policy | Validated safe tool loop |
| **7. Runtime integration** | Benchmark winner, npm manager, preview, diagnostics | Critical runtime tests pass |
| **8. Quality/security** | Preview isolation, failure recovery, secure logging, extensive tests | Hard gates passed |
| **9. Public alpha** | Production routing, localized publication, documentation, feedback loop | Real user workflows validated |
| **10. Advanced** | Subagents, skills, MCP as feasible, visual inspect, advanced integrations | Each feature independently security-reviewed |

**Do feasibility research early even if marketing site is implemented first.** Publishing unsupported claims before the runtime/agent prototype is validated creates a credibility and rework risk.

---

## 28. Open decisions, risks, and dependencies

### Decision register

| Decision | Current direction | Required validation |
| --- | --- | --- |
| Public domain | `build.ladestack.in` | DNS and routing configured in deployment |
| Marketing framework | Astro | Build + i18n + Markdown implementation |
| Builder framework | Next.js | `/app` basePath/routing and host compatibility |
| Deployment | Cloudflare Astro; Vercel builder initially | Same-domain edge router behavior |
| Languages | `en`, `ru`, `ja`, `ko`, `zh`, `tr`, `fr`, `pt` | Portuguese locale variant and editorial glossary |
| Visual system | Supplied cream/orange design reference | Accessibility and licensed asset audit |
| AI engine | Selective Kilo reuse/adaptation | Pinned source revision and browser portability audit |
| Browser runtime | Benchmark-first; Lifo/WebContainers/Wasmer/fallback | Runtime, license, security hard gates |
| Default project stack | React + TypeScript + Vite candidate | Benchmarks and product prioritization |
| Data | IndexedDB + optional OPFS | Quota, migration, crash, multi-tab tests |
| Provider transport | BYOK direct where safe, optional relay | CORS, abuse, credentials, disclosure |
| Permission default | Balanced | Tool-specific risk/approval matrix |
| Generated project deployment | Not part of core local preview guarantee | Future standalone integration design |

### Principal risks

1. **Kilo portability:** CLI/extension packages may require native APIs; blanket import is unrealistic.
2. **Runtime licensing:** Commercial use requirements can conflict with a free-platform business model.
3. **Runtime compatibility:** Browser Node and package support are incomplete or uneven.
4. **Preview isolation:** Untrusted code on the host origin could compromise keys and projects.
5. **BYOK exposure:** Direct client keys are visible to the browser execution context; relays create additional trust/cost/abuse risks.
6. **No-auth abuse:** Anonymous public relay or web endpoints need careful abuse protection.
7. **Local data durability:** Browser eviction/deletion can remove projects; export and backup UX are essential.
8. **Same-domain split apps:** Rewrites, service workers, COOP/COEP, i18n routes, and static assets can conflict.
9. **Eight-language workload:** Quality review multiplies editorial effort; shortcuts harm the product and SEO.
10. **Over-scoping:** “All modern features” must be phased; an unreliable all-in-one release is worse than a dependable core workflow.
11. **Legal content:** Privacy promises must match actual provider/network/storage behavior; professional review may be needed.
12. **Long-term costs:** Free platform requires a sustainable hosting/maintenance budget even with BYOK.

---

## 29. Contributing and implementation rules

### Engineering rules

- Do not claim a feature is shipped merely because it exists in this README.
- Preserve project data and implement versioned storage migrations; never wipe IndexedDB to "fix" an upgrade.
- Keep `projectType`, framework capability, and editor appearance as separate concepts.
- Make runtime/provider implementations adapter-driven and test each with consistent fixtures.
- Treat external AI output and uploaded content as untrusted.
- Check tool permissions in executable policy code, not just prompts/UI state.
- Never put user model keys in source exports, logs, analytics, or repository secrets.
- Avoid excessive animation in the editor; prioritize live performance and accessibility.
- Maintain all eight locales whenever public content/navigation changes.
- Document breaking changes, migrations, runtime compatibility, and known limitations.
- Keep Astro lightweight; do not import the Next.js builder into marketing page hydration.
- Do not add pricing, subscriptions, sign-up, or cloud account dependencies without an explicit product-scope change.
- Audit each third-party component/license before bundling it in the product or generated user ZIP.
- Base public claims on real test results and user-visible functionality.

### Proposed pull-request checklist

- [ ] Change has a clear scope, tests, and product acceptance criteria.
- [ ] No accidental user project/data deletion or incompatible storage migration.
- [ ] Updated settings and permission behavior are reviewed.
- [ ] All eight translations and relevant docs/content are updated.
- [ ] New UI works via keyboard and with reduced motion.
- [ ] Agent tool and provider error paths are handled.
- [ ] No sensitive credential/source data is logged or exported.
- [ ] Browser/runtime compatibility matrix updated if relevant.
- [ ] Vercel/Cloudflare routing and production header impact considered.
- [ ] Licenses and attribution notices maintained.
- [ ] README status descriptions updated to distinguish planned vs implemented functionality.

### Specification updates

Keep architectural decisions in `docs/decisions/` (when created), include rationale and alternatives, and update this README when an open choice is resolved by benchmark or production test. **The real repository and test outputs, once available, supersede speculative parts of this planning document.**

---

## 30. Licenses, credits, and references

### Product/source licensing

The license for the **future LadeStack Build codebase** is **to be selected by the product owner**. Do **not** infer that the entire future application becomes MIT-licensed just because parts of Kilo Code or other dependencies are MIT-licensed. Preserve per-dependency notices and comply with applicable distribution terms.

### Important dependencies and references

- [Astro documentation](https://docs.astro.build/) — public-site framework, content collections, i18n.
- [Next.js documentation](https://nextjs.org/docs) — App Router, localized builder routes, application architecture.
- [Kilo Code source](https://github.com/Kilo-Org/kilocode) — upstream coding agent, source and license review.
- [Kilo documentation](https://kilo.ai/docs) — agents, modes, workflows, configuration and tooling.
- [StackBlitz WebContainers](https://developer.stackblitz.com/) — API capabilities and current commercial terms.
- [Wasmer](https://wasmer.io/) — WebAssembly runtime research.
- [Sandpack](https://sandpack.codesandbox.io/) — frontend sandbox/bundler research.
- [shadcn/ui](https://ui.shadcn.com/) — reusable UI patterns.
- [React Aria](https://react-aria.adobe.com/) — accessible interactions.
- [Kibo UI](https://www.kibo-ui.com/) — specialized UI components.
- [Aceternity UI](https://ui.aceternity.com/components) — selective motion/visual treatments; verify redistribution rights.
- [Vibrant.design](https://vibrant.design/) — editorial and interaction inspiration.
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) — code editing.
- [Cloudflare Workers — Next.js](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/) — current framework compatibility guidance.
- [Vercel — Next.js](https://vercel.com/docs/frameworks/full-stack/nextjs) — native hosting guidance.
- [MDN — IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) — browser storage model.
- [MDN — Origin private file system](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system) — browser-managed file storage.
- [W3C — WCAG](https://www.w3.org/TR/WCAG22/) — accessibility success criteria.

### Design reference

A user-provided editorial `design.md`-style reference informed the warm-cream canvas, orange CTA, thin borders, regular-weight headline hierarchy, compact card radii, and pastel activity palette. Its **pricing designs are explicitly excluded**. This document does not supply or redistribute the reference brand's proprietary font, logos, or visual assets.

### Attribution and trademark principles

Using upstream open-source code does not grant ownership of Kilo Code's, Cursor's, Lovable's, or other companies' trademarks. The application should use original **LadeStack** identity and its own assets. Preserve notices for any reused upstream source; confirm scope/version-specific licensing before commercial distribution, especially for embedded previews, third-party component source, and runtime APIs.

---

## Closing note

**LadeStack Build is designed to be free to access, easy to begin using, and uncompromising about code ownership.** The public Astro site introduces the idea; the local-first Next.js workspace provides a careful, agentic path from prompt to runnable project. Users remain in control of the model they pay for, the files they create, the permissions they grant, and the code they export.

**Current stage:** Detailed product and architecture specification. Implement, verify, and release each capability before labeling it production-ready.
