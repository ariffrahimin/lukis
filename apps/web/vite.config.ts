/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import articlesPlugin from "./plugins/vite-plugin-articles";

export default defineConfig({
  plugins: [react(), articlesPlugin()],
  base: "/", // Important for Azure App Service
  build: {
    outDir: "dist",
    assetsDir: "assets",
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name]-[hash][extname]",
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("@xyflow")) return "xyflow";
            if (id.includes("react-dom")) return "vendor";
            if (id.includes("react")) return "vendor";
            if (id.includes("lucide-react")) return "ui";
            if (id.includes("@radix-ui")) return "ui";
            if (id.includes("html-to-image") || id.includes("gifenc")) return "export";
          }
        },
      },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.ts",
  },
});
