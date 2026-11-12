import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // jest-lite is a browser build, which needs `window`
    environment: "jsdom",
    include: ["**/*.test.ts"],
    exclude: ["node_modules", ".bundled"],
  },
});
