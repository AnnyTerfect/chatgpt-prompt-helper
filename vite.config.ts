import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import monkey, { cdn } from "vite-plugin-monkey";
import eslint from "vite-plugin-eslint";
import { resolve } from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  plugins: [
    react(),
    monkey({
      entry: "src/main.tsx",
      userscript: {
        icon: "https://chat.openai.com/favicon.ico",
        namespace: "npm/vite-plugin-monkey",
        match: ["https://chatgpt.com*"],
      },
      build: {
        externalGlobals: {
          react: cdn.jsdelivr("React", "umd/react.production.min.js"),
          "react-dom": cdn.jsdelivr(
            "ReactDOM",
            "umd/react-dom.production.min.js",
          ),
        },
      },
    }),
    eslint({
      cache: false,
      emitWarning: true,
      emitError: true,
    }),
  ],
});
