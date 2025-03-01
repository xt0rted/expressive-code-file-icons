import { getClassNames } from "@expressive-code/core/hast";
import { pluginFrames } from "@expressive-code/plugin-frames";
import { describe, expect, test } from "vitest";

import { pluginFileIcons } from "../src/pluginFileIcons.js";
import { pluginDebugStyles } from "./helpers/debugging.js";
import { iconSelector, selectSingle, titleSelector } from "./helpers/hast.js";
import { buildFixture, renderAndOutputHtmlSnapshot } from "./helpers/testing.js";
import { testName } from "./helpers/vitest.js";

import type { ExpressiveCodePlugin } from "@expressive-code/core";

const defaultPlugins: ExpressiveCodePlugin[] = [pluginDebugStyles(), pluginFrames()];

describe("handles options", async () => {
  test("no classes added by default", async ({ task }) => {
    await renderAndOutputHtmlSnapshot({
      testName: testName(task),
      testBaseDir: import.meta.dirname,
      fixture: buildFixture({
        code: "",
        meta: 'title="test"',
        plugins: [...defaultPlugins, pluginFileIcons()],
        blockValidationFn: (block) => {
          const title = selectSingle(titleSelector, block.renderedGroupAst);
          const svg = selectSingle(iconSelector, block.renderedGroupAst);

          expect(getClassNames(title)).toHaveLength(1); // Should only contain the title class
          expect(getClassNames(svg)).toHaveLength(0);
        },
      }),
    });
  });

  test.for([
    { classes: ["class-1"] },
    { classes: ["class-1", "class-2"] },
    { classes: ["class-1", "class-2", "class-3"] },
  ])("add icon classes to svg $classes", async ({ classes }, { task }) => {
    await renderAndOutputHtmlSnapshot({
      testName: testName(task),
      testBaseDir: import.meta.dirname,
      fixture: buildFixture({
        code: "",
        meta: 'title="test"',
        plugins: [
          ...defaultPlugins,
          pluginFileIcons({
            iconClass: classes.join(" "),
          }),
        ],
        blockValidationFn: (block) => {
          const element = selectSingle(iconSelector, block.renderedGroupAst);
          const elementClasses = getClassNames(element);

          expect(elementClasses).toEqual(expect.arrayContaining(classes));
        },
      }),
    });
  });

  test.for([
    { classes: ["class-1"] },
    { classes: ["class-1", "class-2"] },
    { classes: ["class-1", "class-2", "class-3"] },
  ])("add title classes to title $classes", async ({ classes }, { task }) => {
    await renderAndOutputHtmlSnapshot({
      testName: testName(task),
      testBaseDir: import.meta.dirname,
      fixture: buildFixture({
        code: "",
        meta: 'title="test"',
        plugins: [
          ...defaultPlugins,
          pluginFileIcons({
            titleClass: classes.join(" "),
          }),
        ],
        blockValidationFn: (block) => {
          const element = selectSingle(titleSelector, block.renderedGroupAst);
          const elementClasses = getClassNames(element);

          expect(elementClasses).toEqual(expect.arrayContaining(classes));
        },
      }),
    });
  });
});
