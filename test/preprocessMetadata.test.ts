import { ExpressiveCodeEngine } from "@expressive-code/core";
import { describe, expect, test } from "vitest";

import { pluginFileIcons } from "../src/pluginFileIcons.js";

import type { ExpressiveCodeBlockProps, PartialAllowUndefined } from "@expressive-code/core";

import type { IconName } from "../src/iconNames.js";

describe("handles known options", () => {
  test.for<{ icon: IconName; noIcon: boolean }>([
    { icon: "astro", noIcon: false },
    { icon: "yaml", noIcon: true },
  ])("leaves props as-is when options aren't provided", async ({ icon, noIcon }) => {
    const { props } = await processMetadata({
      meta: 'title="test"',
      props: { icon, noIcon },
    });

    expect(props.icon).toBe(icon);
    expect(props.noIcon).toBe(noIcon);
  });

  test("sets icon prop", async () => {
    const { props } = await processMetadata({
      meta: 'icon="css"',
      props: { icon: "astro" },
    });

    expect(props.icon).toBe("css");
  });

  test("sets noIcon prop", async () => {
    const { props } = await processMetadata({
      meta: "no-icon",
      props: { noIcon: false },
    });

    expect(props.noIcon).toBe(true);
  });
});

async function processMetadata({
  meta,
  props,
}: {
  language?: string;
  meta: string;
  props?: PartialAllowUndefined<ExpressiveCodeBlockProps> | undefined;
}) {
  const engine = new ExpressiveCodeEngine({
    plugins: [pluginFileIcons()],
  });

  const { renderedGroupContents } = await engine.render({
    code: "mark*down*",
    language: "md",
    meta,
    props,
  });

  expect(renderedGroupContents).toHaveLength(1);

  const codeBlock = renderedGroupContents[0]!.codeBlock;

  return {
    meta: codeBlock.meta,
    props: codeBlock.props,
  };
}
