/**
 * English source text for the legal, open-source and error pages.
 * Every locale must match this shape. Legal text is a draft until reviewed by counsel.
 */
export const en = {
  common: {
    legal: "Legal",
    draft: "Draft: this text has not yet been reviewed by a lawyer and may change before launch.",
    updated: "Last updated",
    backHome: "Back to the homepage",
  },
  links: {
    privacy: "Privacy",
    terms: "Terms",
    disclaimer: "Disclaimer",
    openSource: "Open source",
  },
  privacy: {
    title: "Privacy",
    description:
      "How LadeStack Build handles your data: local storage, your AI key and third parties.",
    sections: [
      {
        h: "No account, no profile",
        p: "You can use LadeStack Build without signing up. We do not run user accounts, and this website does not set advertising or analytics cookies.",
      },
      {
        h: "Your projects stay in your browser",
        p: "The builder stores projects, files and checkpoints in your browser's local storage on your device. We do not keep a copy on our servers. Clearing your browser data can delete them, so export a ZIP for safekeeping.",
      },
      {
        h: "Your AI key and prompts",
        p: "You connect your own AI provider. By default your key is kept only for the current browser session and is never written into your project or its exports. Your prompts and the files the agent needs are sent to the provider you choose, under that provider's own privacy terms.",
      },
      {
        h: "Other services",
        p: "Installing packages contacts the npm registry. Our hosting provider may process technical request data, such as IP addresses, to deliver and protect the site.",
      },
      {
        h: "Your choices",
        p: "You can delete your projects and saved settings at any time from your browser or the builder settings, and download your work before you do.",
      },
    ],
  },
  terms: {
    title: "Terms of use",
    description: "The basic terms for using LadeStack Build.",
    sections: [
      {
        h: "Using the service",
        p: "LadeStack Build is offered free of charge, as is, while it is in development. Features can change or be unavailable at any time.",
      },
      {
        h: "Your content",
        p: "You own what you create, including the code the agent writes for you. You are responsible for reviewing it and for how you use it.",
      },
      {
        h: "Third-party services",
        p: "AI providers, npm and other services you connect have their own terms and may charge you. Those charges are between you and them.",
      },
      {
        h: "Acceptable use",
        p: "Do not use the service to break the law, harm others or attack other systems.",
      },
      {
        h: "No warranty",
        p: "The software is provided without warranty of any kind, to the extent the law allows, as described in the MIT licence.",
      },
    ],
  },
  disclaimer: {
    title: "Disclaimer",
    description: "Limits of AI-generated code and the in-browser runtime.",
    sections: [
      {
        h: "AI can be wrong",
        p: "Code and text written by AI models can contain errors, security issues or outdated practices. Review and test everything before you rely on it.",
      },
      {
        h: "Browser runtime limits",
        p: "Running projects in the browser has limits. Some packages, native modules and back-end features may not work, and browser support varies.",
      },
      {
        h: "Not professional advice",
        p: "Nothing produced by the builder is legal, financial, medical or security advice.",
      },
    ],
  },
  openSource: {
    title: "Open source",
    description: "LadeStack Build's licence and the open-source projects it builds on.",
    intro:
      "LadeStack Build is open source under the MIT licence. It is built with the projects below; their licences and notices are kept with the source code.",
    planned: "planned",
  },
  notFound: {
    title: "Page not found",
    description: "The page you were looking for does not exist.",
    body: "This page does not exist or has moved.",
  },
};

export type PagesDictionary = typeof en;
