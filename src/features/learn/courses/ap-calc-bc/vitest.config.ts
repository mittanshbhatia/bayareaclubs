import path from "node:path";
import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const directory = path.dirname(fileURLToPath(import.meta.url));
const rootDirectory = path.resolve(directory, "../../../../../");

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.join(rootDirectory, "src"),
    },
  },
  test: {
    environment: "jsdom",
    include: [path.join(directory, "content.test.ts")],
  },
});
