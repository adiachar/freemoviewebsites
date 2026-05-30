import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 8090,
    host: true,
    strictPort: true,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
