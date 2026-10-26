/**
 * The isolated preview origin (ADR 0016), set per deployment with NEXT_PUBLIC_PREVIEW_ORIGIN.
 * Only https, or http on localhost/127.0.0.1 for development. Unset or invalid means no preview.
 */
export function parsePreviewOrigin(raw: string | undefined): string | null {
  if (!raw) return null;
  try {
    const u = new URL(raw);
    const local = u.hostname === "localhost" || u.hostname === "127.0.0.1";
    if (u.protocol !== "https:" && !(local && u.protocol === "http:")) return null;
    if (u.username || u.password || (u.pathname !== "/" && u.pathname !== "")) return null;
    return u.origin;
  } catch {
    return null;
  }
}

export const previewOrigin = parsePreviewOrigin(process.env.NEXT_PUBLIC_PREVIEW_ORIGIN);
