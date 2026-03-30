import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 5000,
    strictPort: true,
    proxy: {
      "/api": {
        target: "https://lumina-cms-uf6n.vercel.app",
        changeOrigin: true,
      },
      "/uploads": {
        target: "https://lumina-cms-uf6n.vercel.app",
        changeOrigin: true,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1900, // Increase limit to 1000KB
  },
});
