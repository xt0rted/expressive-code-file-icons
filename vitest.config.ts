import { defineConfig } from "vitest/config";
import { isCI } from "std-env";

export default defineConfig({
  test: {
    coverage: {
      enabled: isCI,
      reportOnFailure: true,
      reporter: ["text", "html", "json", "json-summary"],
    },
  },
});
