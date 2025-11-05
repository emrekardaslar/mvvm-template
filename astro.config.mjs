import { defineConfig } from "astro/config";
import react from "@astrojs/react";

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
});
