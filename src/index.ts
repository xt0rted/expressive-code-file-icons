import { addClassName, select, setProperty } from "@expressive-code/core/hast";

import type { ExpressiveCodePlugin } from "@expressive-code/core";

import type { IconName } from "./icon-names.js";
import { iconForFile } from "./icons.js";
import { isTerminal } from "./utils.js";

export interface PluginFileIconsProps {
  icon: IconName;
  noIcon: boolean;
}

declare module "@expressive-code/core" {
  export interface ExpressiveCodeBlockProps extends PluginFileIconsProps {}
}

export interface PluginFileIconsOptions {
  iconClass?: string;
  titleClass?: string;
}

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

        if (iconClass) {
          addClassName(iconSvgElement, iconClass);
        }

        const title = select("figcaption > .title", renderData.blockAst);

        if (!title) {
          return;
        }

        title.children?.unshift(iconSvgElement);

        if (titleClass) {
          addClassName(title, titleClass);
        }
      },
    },
  };
}
