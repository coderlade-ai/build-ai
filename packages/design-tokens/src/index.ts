/**
 * LadeStack Build design tokens.
 * Source: DESIGN.md (visual reference only; pricing components excluded).
 * Keep colours here instead of scattering hex values through components.
 */
export const colors = {
  canvas: "#F7F7F4",
  canvasSoft: "#FAFAF7",
  surfaceCard: "#FFFFFF",
  surfaceStrong: "#E6E5E0",
  ink: "#26251E",
  body: "#5A5852",
  muted: "#807D72",
  mutedSoft: "#A09C92",
  hairline: "#E6E5E0",
  hairlineSoft: "#EFEEE8",
  hairlineStrong: "#CFCDC4",
  primary: "#F54E00",
  primaryActive: "#D04200",
  onPrimary: "#FFFFFF",
  success: "#1F8A65",
  error: "#CF2D56",
  timelineThinking: "#DFA88F",
  timelineSearch: "#9FC9A2",
  timelineRead: "#9FBBE0",
  timelineEdit: "#C0A8DD",
  timelineDone: "#C08532",
} as const;

export const radius = { sm: "6px", md: "8px", lg: "12px", xl: "16px", pill: "9999px" } as const;

/** 4px base spacing scale. */
export const space = {
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  8: "32px",
  12: "48px",
  20: "80px",
} as const;

export const fonts = {
  sans: '"Inter", "Geist", system-ui, -apple-system, "Segoe UI", sans-serif',
  mono: '"JetBrains Mono", ui-monospace, "SFMono-Regular", Menlo, monospace',
} as const;

export const layout = { contentMaxWidth: "1200px", sectionRhythm: "80px" } as const;

export type ColorToken = keyof typeof colors;
