/** Preview widths the user can switch between; the frame is centred and keeps the pane's height. */
export const viewports = ["desktop", "tablet", "mobile"] as const;
export type Viewport = (typeof viewports)[number];

/** CSS width of the preview frame for each viewport (desktop fills the pane). */
export const viewportWidth: Record<Viewport, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "390px",
};

const storageKey = "ladestack:preview-viewport";

/** The viewport chosen last in this tab, or desktop. */
export function loadViewport(storage: Pick<Storage, "getItem"> | undefined): Viewport {
  try {
    const v = storage?.getItem(storageKey);
    return (viewports as readonly string[]).includes(v ?? "") ? (v as Viewport) : "desktop";
  } catch {
    return "desktop";
  }
}

export function saveViewport(storage: Pick<Storage, "setItem"> | undefined, v: Viewport): void {
  try {
    storage?.setItem(storageKey, v);
  } catch {
    // storage unavailable: the choice just isn't remembered
  }
}
