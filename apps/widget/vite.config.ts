/// <reference types="vite/client" />

import { fileURLToPath, URL } from "url";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  plugins: [solidPlugin()],
  build: {
    target: "esnext",
  },
  resolve: {
    conditions: ["development", "browser"],
    alias: [
      {
        find: "~",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
    ],
  },
});
