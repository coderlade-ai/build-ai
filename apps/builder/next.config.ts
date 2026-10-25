import type { NextConfig } from "next";

/**
 * The builder is served under /app on the same domain as the Astro site
 * (ADR 0007). Locale-prefixed builder routes (/app/ru, ...) arrive with the
 * builder i18n work; English is the only route for now.
 */
const nextConfig: NextConfig = {
  basePath: "/app",
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ["@ladestack/design-tokens", "@ladestack/i18n", "@ladestack/shared-types"],
};

export default nextConfig;
