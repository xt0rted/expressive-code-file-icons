import { ExpressiveCodePlugin } from "@expressive-code/core";
import { pluginFrames } from "@expressive-code/plugin-frames";
import { describe, expect, test } from "vitest";

import { pluginFileIcons } from "../src/pluginFileIcons.js";
import { getProperty, iconSelector, selectSingle } from "./helpers/hast.js";
import { buildFixture, renderAndOutputHtmlSnapshot } from "./helpers/testing.js";
import { testName } from "./helpers/vitest.js";

describe("aria attributes", async () => {
  const plugins: ExpressiveCodePlugin[] = [pluginFrames(), pluginFileIcons()];

  test("aria-hidden added to icon", async ({ task }) => {
    await renderAndOutputHtmlSnapshot({
      testName: testName(task),
      testBaseDir: import.meta.dirname,
      fixture: buildFixture({
        code: "",
        meta: 'title="test config"',
        plugins,
        blockValidationFn: (block) => {
          const icon = selectSingle(iconSelector, block.renderedGroupAst);
          const propertyValue = getProperty(icon, "aria-hidden");

          expect(propertyValue).toBe("true");
        },
      }),
    });
  });
});
