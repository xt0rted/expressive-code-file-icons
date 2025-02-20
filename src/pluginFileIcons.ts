import { select, setProperty } from "@expressive-code/core/hast";

import { addClassNames, isTerminal } from "./utilities/hast.js";
import { iconForFile } from "./utilities/icons.js";

import type { ExpressiveCodePlugin } from "@expressive-code/core";

import type { IconName } from "./iconNames.js";
import type { PluginFileIconsOptions } from "./options.js";

export function pluginFileIcons({ iconClass, titleClass }: PluginFileIconsOptions = {}): ExpressiveCodePlugin {
  return {
    name: "File icons",
    hooks: {
      preprocessMetadata({ codeBlock }) {
        const { metaOptions, props } = codeBlock;

        props.icon = (metaOptions.getString("icon") as IconName) ?? props.icon;
        props.noIcon = metaOptions.getBoolean("no-icon") ?? props.noIcon;
      },
      postprocessRenderedBlock: async ({ codeBlock, renderData }) => {
        if (codeBlock.props.noIcon) {
          return;
        }

        if (isTerminal(renderData.blockAst)) {
          return;
        }

        const titleText = codeBlock.props["title"]; // Comes from the frames plugin

        if (!titleText) {
          return;
        }

        const iconSvgElement = await iconForFile(titleText, codeBlock.language, codeBlock.props.icon);

        if (!iconSvgElement) {
          return;
        }

        setProperty(iconSvgElement, "aria-hidden", "true");

        addClassNames(iconSvgElement, iconClass?.split(" "));

        const title = select("figcaption > .title", renderData.blockAst);

        if (!title) {
          return;
        }

        title.children?.unshift(iconSvgElement);

        addClassNames(title, titleClass?.split(" "));
      },
    },
  };
}
