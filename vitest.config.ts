import { coverageConfigDefaults, defineConfig } from "vitest/config";
import { isCI } from "std-env";

export default defineConfig({
  test: {
    coverage: {
      enabled: isCI,
      reportOnFailure: true,
      reporter: ["text", "html", "json", "json-summary"],
      exclude: [...coverageConfigDefaults.exclude, "scripts/**", "svgo.config.js"],
    },
  },
});
