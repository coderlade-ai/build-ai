/**
 * English source dictionary. Every other locale must match this shape exactly;
 * a missing key is a type error (I18N-05) and a test failure.
 */
export const en = {
  meta: {
    title: "LadeStack Build: AI website and app builder in your browser",
    description:
      "Describe what you want, watch an AI agent write real code, preview it and download the files. Free, no account, bring your own AI key. In development.",
  },
  skipToContent: "Skip to content",
  nav: {
    features: "Features",
    useCases: "Use cases",
    howItWorks: "How it works",
    technology: "Technology",
    menu: "Menu",
    language: "Language",
    start: "Start Building",
  },
  status: "In development. This page describes what we are building; none of it is live yet.",
  hero: {
    eyebrow: "AI development, on your terms",
    title: "From an idea to working code",
    subtitle:
      "Describe a website or app. An AI agent plans it, writes the files in a real code editor and runs a live preview, all in your browser. You keep every line.",
    primary: "Start Building",
    secondary: "See how it works",
  },
  features: {
    title: "What you get",
    intro: "A real development workspace, not a black box.",
    items: [
      {
        title: "Agent modes",
        body: "Code, Plan, Ask and Debug modes with clear permissions, so the agent only does what the mode allows.",
      },
      {
        title: "Live code editor",
        body: "Watch files appear in a Monaco editor with a file tree. Edit anything yourself at any time.",
      },
      {
        title: "Preview in the browser",
        body: "Dependencies install from package.json and a dev server runs in a browser runtime, where supported.",
      },
      {
        title: "Bring your own key",
        body: "Connect your own AI provider. You pay them directly; LadeStack adds no fees.",
      },
      {
        title: "Checkpoints",
        body: "Changes are saved as checkpoints you can compare and restore before and after AI edits.",
      },
      {
        title: "Download as ZIP",
        body: "Export the full source with its folder structure at any time, no account needed.",
      },
    ],
  },
  useCases: {
    title: "What you can build",
    intro: "Front-end projects on React, TypeScript and Vite first, with more stacks later.",
    items: [
      { title: "Landing pages", body: "Product launches, events and campaigns." },
      { title: "SaaS dashboards", body: "Admin panels, charts and data tables." },
      { title: "Portfolios", body: "Personal sites for designers, developers and creators." },
      { title: "Business websites", body: "Multi-page sites for small companies and agencies." },
      { title: "Store front-ends", body: "Product grids and carts, wired to your own back end." },
      { title: "Documentation sites", body: "Guides and references for your project." },
    ],
  },
  howItWorks: {
    title: "How it works",
    steps: [
      { title: "Describe", body: "Write what you want and add references if you like." },
      { title: "The agent plans and writes", body: "It creates files step by step in the editor." },
      { title: "Files appear", body: "Each saved file is marked as it is written." },
      { title: "Preview and refine", body: "Run it, ask for changes or edit the code yourself." },
      { title: "Export", body: "Download a ZIP of your project." },
    ],
  },
  technology: {
    title: "Technology",
    intro: "Choices still under evaluation are marked as such.",
    items: [
      {
        title: "Agent inspired by Kilo Code",
        body: "Modes, tools, permissions and checkpoints adapted from open-source agent ideas.",
      },
      {
        title: "Monaco editor",
        body: "The editor engine behind VS Code, running in your browser.",
      },
      {
        title: "Browser runtime (being evaluated)",
        body: "Candidate runtimes are benchmarked for compatibility, licence and security before one is chosen.",
      },
      {
        title: "Local-first storage",
        body: "Projects are kept in your browser's storage. There is no cloud copy, so export regularly.",
      },
    ],
  },
  byok: {
    title: "Your key, your code",
    items: [
      {
        title: "No platform fees",
        body: "You pay your AI provider for what you use. There are no plans or credits here.",
      },
      {
        title: "Keys stay in the session",
        body: "By default your key is kept only for the current session and never written into your project.",
      },
      {
        title: "Honest about data",
        body: "Prompts go to the AI provider you choose, and package installs reach npm. Your project files stay in your browser until you export them.",
      },
    ],
  },
  faq: {
    title: "Questions",
    items: [
      {
        q: "Is it free?",
        a: "Yes. LadeStack Build has no paid plans. Your AI provider may charge you for model usage.",
      },
      { q: "Do I need an account?", a: "No. You can start building without signing up." },
      {
        q: "Where are my projects stored?",
        a: "In your browser on this device. Clearing browser data can delete them, so download a ZIP for safekeeping.",
      },
      {
        q: "Which frameworks are supported?",
        a: "React with TypeScript and Vite is the first supported stack, on desktop Chrome and Edge. Others will be added once they pass testing.",
      },
    ],
  },
  cta: {
    title: "Ready when you are",
    body: "Open the builder and describe your first project.",
    button: "Start Building",
  },
  footer: {
    tagline: "A free, local-first AI builder by LadeStack.",
    product: "Product",
    licence: "Open source under the MIT licence.",
  },
};

/** Shape every locale must satisfy (strings widened, arrays kept). */
export type Dictionary = typeof en;
