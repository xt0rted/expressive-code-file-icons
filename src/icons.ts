import fs from "node:fs/promises";

import { fromHtml } from "hast-util-from-html";
import pc from "picocolors";
import { DEFAULT_FILE, getIconForFile } from "vscode-icons-js";

import { fileExists } from "./utils.js";

import type { Element } from "@expressive-code/core/hast";

import type { IconName } from "./icon-names.js";

async function lookUpIcon(iconOverride?: IconName): Promise<string | undefined> {
  if (iconOverride) {
    const overrideIconFileName = `file_type_${iconOverride}.svg`;

    if (await fileExists(`icons/${overrideIconFileName}`)) {
      return overrideIconFileName;
    }

    console.error(pc.red(`Icon override not found: ${iconOverride}`));
  }

  return undefined;
}

async function selectIcon(fileName: string, language: string, iconOverride?: IconName) {
  // First try to use the override icon
  if (iconOverride) {
    const overrideIcon = await lookUpIcon(iconOverride);

    if (overrideIcon) {
      return overrideIcon;
    }
  }

  // If there was no override try to find one based on the file name
  const fileNameIcon = getIconForFile(fileName);

  if (fileNameIcon !== DEFAULT_FILE) {
    return fileNameIcon;
  }

  // Lastly if there is still no icon then try to use the language of the code block
  const languageIcon = await lookUpIcon(language as IconName);

  return languageIcon ?? DEFAULT_FILE;
}

export async function iconForFile(
  fileName: string,
  language: string,
  iconOverride?: IconName,
): Promise<Element | null> {
  const iconFileName = await selectIcon(fileName, language, iconOverride);

  const iconFile = new URL(`icons/${iconFileName}`, import.meta.url);

  const iconSvg = await fs.readFile(iconFile, "utf8");

  const iconAsHtml = fromHtml(iconSvg, { fragment: true, space: "svg" });
  const iconSvgElement = iconAsHtml.children[0] as Element;

  return iconSvgElement;
}
