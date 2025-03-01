import { pluginFrames } from "@expressive-code/plugin-frames";
import { describe, test } from "vitest";

import { pluginFileIcons } from "../src/pluginFileIcons.js";
import { debugSettings, pluginDebugStyles } from "./helpers/debugging.js";
import { selectSingle, titleSelector } from "./helpers/hast.js";
import { buildFixture, renderAndOutputHtmlSnapshot } from "./helpers/testing.js";
import { testName } from "./helpers/vitest.js";

import type { ExpressiveCodePlugin } from "@expressive-code/core";

describe("renders an icon in the title", async () => {
  const plugins: ExpressiveCodePlugin[] = [pluginDebugStyles(), pluginFrames(), pluginFileIcons(debugSettings)];

  test.concurrent("adds icon based on code block language", async ({ expect, task }) => {
    await renderAndOutputHtmlSnapshot({
      testName: testName(task),
      testBaseDir: import.meta.dirname,
      fixture: buildFixture({
        code: "",
        language: "js",
        meta: 'title="test config"',
        plugins,
        blockValidationFn: (block) => {
          const title = selectSingle(titleSelector, block.renderedGroupAst);

          expect(title).toMatchSnapshot();
        },
      }),
    });
  });

  test.concurrent("adds icon based on title file extension", async ({ expect, task }) => {
    await renderAndOutputHtmlSnapshot({
      testName: testName(task),
      testBaseDir: import.meta.dirname,
      fixture: buildFixture({
        code: "",
        language: "js",
        meta: 'title="test.ts"',
        plugins,
        blockValidationFn: (block) => {
          const title = selectSingle(titleSelector, block.renderedGroupAst);

          expect(title).toMatchSnapshot();
        },
      }),
    });
  });

  test.concurrent("adds icon based on title file name", async ({ expect, task }) => {
    await renderAndOutputHtmlSnapshot({
      testName: testName(task),
      testBaseDir: import.meta.dirname,
      fixture: buildFixture({
        code: "",
        language: "js",
        meta: 'title="astro.config.js"',
        plugins,
        blockValidationFn: (block) => {
          const title = selectSingle(titleSelector, block.renderedGroupAst);

          expect(title).toMatchSnapshot();
        },
      }),
    });
  });
});
