// @ts-check
import { defineConfig } from "astro/config";

// Locale list mirrors @ladestack/i18n. English is served without a prefix.
export default defineConfig({
  site: "https://build.ladestack.in",
  output: "static",
  trailingSlash: "ignore",
  i18n: {
    defaultLocale: "en",
    locales: ["en", "ru", "ja", "ko", "zh", "tr", "fr", "pt"],
    routing: { prefixDefaultLocale: false, redirectToDefaultLocale: false },
  },
});
