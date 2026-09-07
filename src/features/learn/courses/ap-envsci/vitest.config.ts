import path from "node:path";
import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const courseDirectory = path.dirname(fileURLToPath(import.meta.url));
const rootDirectory = path.resolve(courseDirectory, "../../../../..");

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(rootDirectory, "src"),
      "server-only": path.resolve(rootDirectory, "tests/unit/server-only.ts"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: [path.resolve(rootDirectory, "tests/unit/setup.ts")],
    include: [path.join(courseDirectory, "content.test.ts")],
  },
});
