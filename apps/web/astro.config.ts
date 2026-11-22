import node from "@astrojs/node";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://miranda.example.com",
  output: "server",
  adapter: node({ mode: "standalone" }),
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  i18n: {
    locales: ["es", "en"],
    defaultLocale: "es",
    // Fase 1: ES en la raíz, EN en /en/. En la fase 3 se puede pasar a /es/ y /en/.
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
