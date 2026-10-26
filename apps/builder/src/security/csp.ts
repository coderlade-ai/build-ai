import { providers } from "../providers/registry";

/**
 * Builder Content-Security-Policy (ADR 0015). Scripts run only with this response's nonce or when
 * loaded by a script that had it ('strict-dynamic', which covers Monaco's AMD loader). Network
 * access is limited to this origin and the four BYOK provider APIs, so an injected script cannot
 * send a key anywhere else. Project previews are framed only from the isolated preview origin
 * (ADR 0016), when one is configured.
 */
export const providerOrigins = Array.from(
  new Set(Object.values(providers).map((p) => p.apiOrigin)),
).sort();

export function buildCsp(nonce: string, dev = false, previewOrigin: string | null = null): string {
  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    "script-src": [`'nonce-${nonce}'`, "'strict-dynamic'", ...(dev ? ["'unsafe-eval'"] : [])],
    // Monaco and React inject style elements/attributes at runtime.
    "style-src": ["'self'", "'unsafe-inline'"],
    "img-src": ["'self'", "data:", "blob:"],
    "font-src": ["'self'", "data:"],
    "worker-src": ["'self'", "blob:"],
    "connect-src": ["'self'", ...providerOrigins, ...(dev ? ["ws:"] : [])],
    "frame-src": previewOrigin ? [previewOrigin] : ["'none'"],
    "object-src": ["'none'"],
    "base-uri": ["'none'"],
    "form-action": ["'self'"],
    "frame-ancestors": ["'none'"],
    "manifest-src": ["'self'"],
  };
  const policy = Object.entries(directives).map(([k, v]) => `${k} ${v.join(" ")}`);
  if (!dev) policy.push("upgrade-insecure-requests");
  return policy.join("; ");
}

/** A fresh, unguessable nonce per response (128 bits, base64). */
export function createNonce(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return btoa(String.fromCharCode(...bytes));
}

/** Headers that do not vary per response (served from next.config). */
export const staticSecurityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "no-referrer" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
];
