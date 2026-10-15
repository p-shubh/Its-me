import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Production builds are served from GitHub Pages at /Its-me/.
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/Its-me/" : "/",
  plugins: [react(), tailwindcss()],
}));
