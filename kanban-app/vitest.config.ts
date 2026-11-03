import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],

    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],

      thresholds: {
        "src/utils/**": {
          lines: 80,
          branches: 80,
        },
        "src/schemas/**": {
          lines: 80,
          branches: 80,
        },
        "src/store/**": {
          lines: 80,
          branches: 80,
        },
        "src/hooks/**": {
          lines: 80,
          branches: 80,
        },
      },
    },
  },
});

