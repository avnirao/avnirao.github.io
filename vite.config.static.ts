// Static export config — used only for GitHub Pages deploys.
// Run with: STATIC_EXPORT=true bun run build:static
// It builds the app as a prerendered SPA: real index.html + hashed assets in dist-static/.
// BASE_PATH lets you deploy under https://<user>.github.io/<repo>/ (e.g. BASE_PATH=/repo/).
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

const basePath = process.env["BASE_PATH"] ?? "/";

export default defineConfig({
  base: basePath,
  plugins: [
    tsConfigPaths(),
    tailwindcss(),
    tanstackStart({
      // Generates a static index.html shell; client-side routing handles all routes.
      spa: { enabled: true },
      prerender: { enabled: true, crawlLinks: true },
    }),
    viteReact(),
  ],
  build: {
    outDir: "dist-static",
    emptyOutDir: true,
  },
});
