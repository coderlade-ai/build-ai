import { NextResponse, type NextRequest } from "next/server";
import { buildCsp, createNonce } from "./security/csp";
import { previewOrigin } from "./preview/origin";

/**
 * Sets a per-response nonce CSP (ADR 0015). Next.js reads the nonce from the request's CSP header
 * and stamps it on its own scripts; that needs dynamic rendering, which the root layouts force.
 */
export function middleware(request: NextRequest) {
  const nonce = createNonce();
  const csp = buildCsp(nonce, process.env.NODE_ENV === "development", previewOrigin);
  const headers = new Headers(request.headers);
  headers.set("x-nonce", nonce);
  headers.set("Content-Security-Policy", csp);
  const response = NextResponse.next({ request: { headers } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

// Must stay literal: Next.js reads this config statically.
export const config = {
  matcher: [
    // "/app" itself: the pattern below needs a path segment after the basePath.
    {
      source: "/",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
    {
      // Pages only: static assets and self-hosted Monaco carry no inline scripts.
      source: "/((?!_next/static|_next/image|monaco/|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
