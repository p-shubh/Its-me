import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Production builds are served from GitHub Pages at /Its-me/.
// Two pages: the main portfolio (/) and a draft redesign (/v2/).
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/Its-me/" : "/",
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: { main: "index.html", v2: "v2/index.html" },
    },
  },
}));
