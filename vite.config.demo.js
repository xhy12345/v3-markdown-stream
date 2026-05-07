import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  base: "./",
  build: {
    outDir: "docs",
    rollupOptions: {
      input: {
        main: "./index.html",
      },
    },
  },
});
