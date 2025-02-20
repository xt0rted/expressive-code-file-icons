import type { IconName } from "./iconNames.js";

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
