import { stripIndent } from "common-tags";

import type { ExpressiveCodePlugin } from "@expressive-code/core";

import type { PluginFileIconsOptions } from "../../src/options.js";

export const debugSettings: PluginFileIconsOptions = {
  iconClass: "size-4",
  titleClass: "flex items-center gap-1",
};

export function pluginDebugStyles(): ExpressiveCodePlugin {
  return {
    name: "Debug",
    baseStyles: stripIndent/* css */ `
      .flex {
        display: flex;
      }

      .items-center {
        align-items: center;
      }

      .gap-1 {
        gap: 4px;
      }

      .size-4 {
        width: 16px;
        height: 16px;
      }
    `,
  };
}
