import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import { fileURLToPath, URL } from "node:url";

// https://astro.build/config
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [react()],
  adapter: node({
    mode: "standalone",
  }),
  build: {
    inlineStylesheets: "never",
  },
  vite: {
    resolve: {
      alias: {
        "@domain": fileURLToPath(new URL("./src/domain", import.meta.url)),
        "@application": fileURLToPath(new URL("./src/application", import.meta.url)),
        "@infrastructure": fileURLToPath(new URL("./src/infrastructure", import.meta.url)),
        "@presentation": fileURLToPath(new URL("./src/presentation", import.meta.url)),
      },
    },
  },
});
